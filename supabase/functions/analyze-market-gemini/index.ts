import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 50; // Maximum requests per hour
const requestCounts = new Map<string, { count: number; timestamp: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientRequests = requestCounts.get(clientId);

  if (!clientRequests) {
    requestCounts.set(clientId, { count: 1, timestamp: now });
    return true;
  }

  if (now - clientRequests.timestamp > RATE_LIMIT_WINDOW) {
    requestCounts.set(clientId, { count: 1, timestamp: now });
    return true;
  }

  if (clientRequests.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  clientRequests.count++;
  return true;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const clientId = req.headers.get('x-client-info') || 'anonymous';

    if (!checkRateLimit(clientId)) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { marketData } = await req.json();
    
    // Validate input data
    if (!marketData) {
      console.error('Market data is missing');
      return new Response(
        JSON.stringify({ error: 'Market data is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Process market data safely
    const processedData = {
      opportunities: "Analyzing market opportunities...",
      growth: "Calculating growth potential...",
      risks: "Evaluating risk factors...",
      recommendations: "Generating recommendations..."
    };

    // Create analysis prompt
    const prompt = `Analyze the following market data and provide insights:
      ${JSON.stringify(marketData, null, 2)}
      
      Please provide:
      1. Key market opportunities
      2. Growth potential analysis
      3. Risk factors
      4. Strategic recommendations`;

    console.log('Sending prompt to Gemini:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the response into sections
    const sections = text.split(/\d+\./).filter(Boolean);
    
    const insights = {
      opportunities: sections[0]?.trim() || processedData.opportunities,
      growth: sections[1]?.trim() || processedData.growth,
      risks: sections[2]?.trim() || processedData.risks,
      recommendations: sections[3]?.trim() || processedData.recommendations
    };

    return new Response(
      JSON.stringify(insights),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-market-gemini function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});