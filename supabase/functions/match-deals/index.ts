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
    const { buyerProfile } = await req.json();

    console.log('Processing match request for buyer profile:', JSON.stringify(buyerProfile, null, 2));

    // Query for matching firms based on criteria
    const { data: matchingFirms, error: queryError } = await supabase
      .from('canary_firms_data')
      .select('*')
      .gte('employeeCount', buyerProfile.employee_count_min || 0)
      .lte('employeeCount', buyerProfile.employee_count_max || 999999)
      .in('STATE', buyerProfile.target_geography)
      .not('specialities', 'is', null);

    if (queryError) throw queryError;

    console.log(`Found ${matchingFirms?.length || 0} potential matches`);
    console.log('Sample of matching firms:', JSON.stringify(matchingFirms?.slice(0, 2), null, 2));

    // Prepare content for Gemini
    const content = {
      contents: [{
        parts: [{
          text: `You are an expert M&A advisor specializing in accounting firm acquisitions. 
          Analyze the compatibility between this buyer profile and potential target firms.
          
          Buyer Profile:
          ${JSON.stringify(buyerProfile, null, 2)}
          
          Potential Target Firms:
          ${JSON.stringify(matchingFirms?.slice(0, 5), null, 2)}
          
          Provide a detailed analysis of the top matches, focusing on:
          1. Employee count alignment
          2. Geographic presence
          3. Service line overlap
          4. Market presence indicators
          
          Format your response as JSON with this structure:
          {
            "matches": [
              {
                "firmName": "string",
                "matchScore": number,
                "alignmentFactors": string[],
                "concerns": string[],
                "nextSteps": string[]
              }
            ],
            "summary": "string"
          }`
        }]
      }]
    };

    console.log('Sending request to Gemini API');
    
    const geminiResponse = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${geminiApiKey}`,
      },
      body: JSON.stringify({
        ...content,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const geminiData = await geminiResponse.json();
    console.log('Received response from Gemini:', JSON.stringify(geminiData, null, 2));

    const analysisText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
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