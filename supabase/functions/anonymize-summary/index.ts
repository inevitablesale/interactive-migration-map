import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { summary, location, specialties } = await req.json();
    
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY')!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Rewrite the following company description to be completely anonymous, removing any company names 
      while maintaining the key business information. Use the location and specialties naturally in the text.
      
      Original Summary: ${summary}
      Location: ${location}
      Specialties: ${specialties}
      
      Rules:
      - Remove all company names and identifying information
      - Incorporate the location naturally
      - Mention the specialties as part of the business description
      - Keep the tone professional
      - Maintain key business metrics and achievements
      - Keep it concise (2-3 sentences)
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    console.log('Generated anonymous description:', text);

    return new Response(
      JSON.stringify({ description: text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});