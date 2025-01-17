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

    // Construct a more focused system prompt
    const systemPrompt = `You are an expert M&A advisor specializing in accounting firm acquisitions. 
    Analyze the compatibility between a buyer's preferences and potential target firms.
    Focus on these key factors:
    1. Size match (employee count)
    2. Geographic alignment
    3. Service line overlap
    4. Growth potential
    5. Deal structure compatibility
    
    For each match, provide:
    - Compatibility score (0-100)
    - Key strengths
    - Potential concerns
    - Next steps
    
    Format your response as valid JSON with this structure:
    {
      "matches": [
        {
          "firmId": "string",
          "firmName": "string",
          "compatibilityScore": number,
          "strengths": string[],
          "concerns": string[],
          "nextSteps": string[],
          "rationale": "string"
        }
      ],
      "summary": {
        "totalMatches": number,
        "averageScore": number,
        "recommendedActions": string[]
      }
    }`;

    // Construct the user prompt with the actual data
    const userPrompt = `
    Buyer Profile:
    ${JSON.stringify({
      type: buyerProfile.buyerType,
      timeline: buyerProfile.timeline,
      dealPreferences: buyerProfile.dealPreferences,
      location: buyerProfile.location,
      size: {
        min: buyerProfile.practiceSize === 'small' ? 1 : buyerProfile.practiceSize === 'growing' ? 6 : buyerProfile.practiceSize === 'established' ? 16 : 31,
        max: buyerProfile.practiceSize === 'small' ? 5 : buyerProfile.practiceSize === 'growing' ? 15 : buyerProfile.practiceSize === 'established' ? 30 : 100
      }
    }, null, 2)}
    
    Potential Target Firms:
    ${JSON.stringify(firms, null, 2)}
    
    Analyze these firms and provide matches with detailed rationale.
    Focus on alignment with buyer preferences and practical next steps.`;

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
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${geminiApiKey}`,
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

    // Extract and validate the response
    const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!analysisText) {
      throw new Error('No valid response received from Gemini');
    }

    // Parse the response and ensure it matches our expected schema
    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysisText);
      
      // Basic validation of the response structure
      if (!parsedAnalysis.matches || !Array.isArray(parsedAnalysis.matches)) {
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      throw new Error('Failed to parse AI response');
    }

    // Store the analysis in Supabase
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