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
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { buyerProfile, firms } = await req.json();

    console.log('Processing match request for buyer profile:', JSON.stringify(buyerProfile, null, 2));
    console.log('Number of firms to analyze:', firms.length);
    console.log('Sample of firms data:', JSON.stringify(firms.slice(0, 2), null, 2));

    // Construct the system prompt
    const systemPrompt = `You are an expert M&A advisor specializing in accounting firm acquisitions. 
    Analyze the compatibility between a buyer's preferences and potential target firms.
    Focus on concrete, measurable factors:
    - Employee count alignment
    - Geographic presence
    - Service line overlap
    - Market presence indicators
    
    Provide specific, data-backed reasons for each match.
    Be direct and professional, avoiding speculation.
    Structure your response as valid JSON matching the expected schema.`;

    // Construct the user prompt with the actual data
    const userPrompt = `
    Buyer Profile:
    ${JSON.stringify(buyerProfile, null, 2)}
    
    Potential Target Firms:
    ${JSON.stringify(firms, null, 2)}
    
    Analyze these firms and provide matches with detailed rationale.
    Focus on factual alignment points and clear next steps.`;

    console.log('System Prompt:', systemPrompt);
    console.log('User Prompt:', userPrompt);
    console.log('Sending request to Gemini API');
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${geminiApiKey}`,
      },
      body: JSON.stringify({
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
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();
    console.log('Received response from Gemini:', JSON.stringify(data, null, 2));

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

    // Store the analysis in Supabase if needed
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