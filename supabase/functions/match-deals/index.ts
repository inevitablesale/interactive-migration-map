import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { buyerProfile, firms } = await req.json();

    console.log('=== Input Data ===');
    console.log('Buyer Profile:', JSON.stringify(buyerProfile, null, 2));
    console.log('Number of firms to analyze:', firms.length);
    console.log('Sample firms:', JSON.stringify(firms.slice(0, 2), null, 2));

    const systemPrompt = `You are an M&A advisor analyzing accounting firm matches.
    For each firm, assess:
    1. Size compatibility
    2. Location fit
    3. Service alignment
    4. Growth potential
    5. Deal structure fit

    Provide a JSON response with this structure:
    {
      "matches": [
        {
          "firmId": string,
          "firmName": string,
          "score": number,
          "strengths": string[],
          "concerns": string[],
          "nextSteps": string[]
        }
      ],
      "summary": {
        "totalMatches": number,
        "averageScore": number,
        "recommendations": string[]
      }
    }`;

    const userPrompt = `
    Analyze these firms for the following buyer:
    - Type: ${buyerProfile.buyerType}
    - Timeline: ${buyerProfile.timeline}
    - Deal Types: ${buyerProfile.dealPreferences?.join(', ')}
    - Size Range: ${buyerProfile.practiceSize}

    Firms to analyze:
    ${JSON.stringify(firms.map(f => ({
      name: f["Company Name"],
      location: f.Location,
      employees: f.employeeCount,
      specialties: f.specialities
    })), null, 2)}

    Provide specific, data-driven matches with clear rationale.`;

    console.log('=== Prompts ===');
    console.log('System Prompt:', systemPrompt);
    console.log('User Prompt:', userPrompt);
    
    const requestBody = {
      contents: [
        {
          parts: [
            { text: systemPrompt },
            { text: userPrompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      }
    };

    console.log('=== Request to Gemini ===');
    console.log('Request Body:', JSON.stringify(requestBody, null, 2));
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      throw new Error(`Gemini API returned status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('=== Gemini Response ===');
    console.log('Response:', JSON.stringify(data, null, 2));

    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!analysisText) {
      console.error('No text content in Gemini response:', data);
      throw new Error('No valid response received from Gemini');
    }

    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysisText);
      
      if (!parsedAnalysis.matches || !Array.isArray(parsedAnalysis.matches)) {
        console.error('Invalid response structure:', parsedAnalysis);
        throw new Error('Invalid response structure');
      }

      parsedAnalysis.matches.forEach((match, index) => {
        if (!match.firmId || !match.firmName || !match.score) {
          console.error(`Invalid match at index ${index}:`, match);
          throw new Error('Invalid match data structure');
        }
      });
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse AI response');
    }

    const { data: opportunity, error: opportunityError } = await supabase
      .from('ai_opportunities')
      .insert({
        buyer_profile_id: buyerProfile.id,
        opportunity_data: parsedAnalysis,
        status: 'new'
      })
      .select()
      .single();

    if (opportunityError) {
      console.error('Error storing opportunity:', opportunityError);
      throw opportunityError;
    }

    return new Response(JSON.stringify({
      success: true,
      analysis: parsedAnalysis,
      opportunityId: opportunity.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in match-deals function:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});