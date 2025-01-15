import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { marketData } = await req.json();
    const { filters, stateData, scenarioData } = marketData;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Fetch comprehensive market data
    const { data: soldFirms, error: soldError } = await supabase
      .from('sold_firms_data')
      .select('*')
      .eq('State', filters.region === 'all' ? undefined : filters.region);

    const { data: activeFirms, error: activeError } = await supabase
      .from('canary_firms_data')
      .select('*')
      .eq('STATE', filters.region === 'all' ? undefined : filters.region);

    const { data: censusData, error: censusError } = await supabase
      .from('county_data')
      .select('*')
      .eq('STATEFP', filters.region === 'all' ? undefined : filters.region);

    if (soldError || activeError || censusError) {
      throw new Error('Error fetching market data');
    }

    // Process and combine data for analysis
    const marketMetrics = {
      soldFirmsMetrics: {
        avgDealSize: calculateAverage(soldFirms.map(f => f.asking_price)),
        avgEmployeeCount: calculateAverage(soldFirms.map(f => f.employee_count)),
        totalDeals: soldFirms.length,
        serviceLineDistribution: getServiceLineDistribution(soldFirms),
      },
      activeFirmsMetrics: {
        avgEmployeeCount: calculateAverage(activeFirms.map(f => f.employeeCount)),
        totalFirms: activeFirms.length,
        marketDensity: activeFirms.length / censusData.length,
        specialtyDistribution: getSpecialtyDistribution(activeFirms),
      },
      censusMetrics: {
        totalPopulation: sum(censusData.map(d => d.B01001_001E)),
        medianIncome: average(censusData.map(d => d.B19013_001E)),
        employedPopulation: sum(censusData.map(d => d.B23025_004E)),
        accountantDensity: calculateAccountantDensity(censusData),
      },
      scenarioProjections: scenarioData || [],
      filters: {
        employeeRange: [filters.employeeCountMin, filters.employeeCountMax],
        revenueRange: [filters.revenueMin, filters.revenueMax],
        region: filters.region,
      }
    };

    // Create comprehensive analysis prompt
    const prompt = `
    Analyze this comprehensive market data and provide strategic insights:
    
    Historical Transaction Data:
    ${JSON.stringify(marketMetrics.soldFirmsMetrics)}
    
    Current Market Status:
    ${JSON.stringify(marketMetrics.activeFirmsMetrics)}
    
    Demographic & Economic Indicators:
    ${JSON.stringify(marketMetrics.censusMetrics)}
    
    ${scenarioData ? `Scenario Projections: ${JSON.stringify(marketMetrics.scenarioProjections)}` : ''}
    
    Analysis Scope:
    ${JSON.stringify(marketMetrics.filters)}
    
    Please provide:
    1. Market Opportunity Assessment
    - Compare historical transactions with current market conditions
    - Identify underserved areas based on demographic data
    - Analyze service line gaps and opportunities
    
    2. Growth Potential Analysis
    - Project growth based on historical patterns
    - Factor in demographic trends and economic indicators
    - Consider scenario impacts on growth trajectory
    
    3. Risk Assessment
    - Evaluate market saturation levels
    - Assess competition intensity
    - Identify economic risk factors
    
    4. Strategic Recommendations
    - Suggest optimal entry/expansion strategies
    - Recommend target firm profiles
    - Provide timing considerations
    
    5. Valuation Insights
    - Compare with historical transaction values
    - Factor in current market conditions
    - Project future value trends`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and structure the response
    const structuredInsights = parseGeminiResponse(text);

    return new Response(
      JSON.stringify(structuredInsights),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 500,
      },
    );
  }
});

// Helper functions
function calculateAverage(numbers: number[]): number {
  return numbers.reduce((acc, val) => acc + (val || 0), 0) / numbers.length;
}

function sum(numbers: number[]): number {
  return numbers.reduce((acc, val) => acc + (val || 0), 0);
}

function average(numbers: number[]): number {
  return sum(numbers) / numbers.length;
}

function getServiceLineDistribution(firms: any[]): Record<string, number> {
  return firms.reduce((acc, firm) => {
    if (firm.service_lines) {
      const services = firm.service_lines.split(',').map(s => s.trim());
      services.forEach(service => {
        acc[service] = (acc[service] || 0) + 1;
      });
    }
    return acc;
  }, {});
}

function getSpecialtyDistribution(firms: any[]): Record<string, number> {
  return firms.reduce((acc, firm) => {
    if (firm.specialities) {
      const specialties = firm.specialities.split(',').map(s => s.trim());
      specialties.forEach(specialty => {
        acc[specialty] = (acc[specialty] || 0) + 1;
      });
    }
    return acc;
  }, {});
}

function calculateAccountantDensity(censusData: any[]): number {
  const totalAccountants = sum(censusData.map(d => d.C24060_004E + d.C24060_007E));
  const totalPopulation = sum(censusData.map(d => d.B01001_001E));
  return (totalAccountants / totalPopulation) * 10000; // per 10,000 residents
}

function parseGeminiResponse(text: string): any {
  // Split response into sections
  const sections = text.split(/\d+\./);
  
  return {
    marketOpportunity: sections[1]?.trim() || '',
    growthPotential: sections[2]?.trim() || '',
    riskAssessment: sections[3]?.trim() || '',
    strategicRecommendations: sections[4]?.trim() || '',
    valuationInsights: sections[5]?.trim() || '',
  };
}