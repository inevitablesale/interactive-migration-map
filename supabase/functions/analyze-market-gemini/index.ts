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
    const { filters, soldFirms, activeFirms, censusData } = marketData;

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Process and correlate data
    const marketMetrics = processMarketData(soldFirms, activeFirms, censusData);
    
    // Create comprehensive analysis prompt
    const prompt = generateAnalysisPrompt(marketMetrics, filters);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and structure the response
    const insights = parseGeminiResponse(text);

    return new Response(
      JSON.stringify(insights),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

function processMarketData(soldFirms, activeFirms, censusData) {
  // Service Line Analysis
  const serviceLineMetrics = analyzeServiceLines(soldFirms, activeFirms);
  
  // Client Base Analysis
  const clienteleMetrics = analyzeClientele(soldFirms);
  
  // Geographic Analysis
  const locationMetrics = analyzeLocations(soldFirms, activeFirms, censusData);
  
  // Financial Metrics
  const financialMetrics = analyzeFinancials(soldFirms);
  
  // Workforce Analysis
  const workforceMetrics = analyzeWorkforce(soldFirms, activeFirms, censusData);

  return {
    serviceLineMetrics,
    clienteleMetrics,
    locationMetrics,
    financialMetrics,
    workforceMetrics
  };
}

function analyzeServiceLines(soldFirms, activeFirms) {
  const serviceLineDistribution = {};
  const specialtyCorrelations = {};
  
  // Analyze service lines and specialties
  soldFirms.forEach(firm => {
    if (firm.service_lines) {
      const services = firm.service_lines.split(',').map(s => s.trim());
      services.forEach(service => {
        if (!serviceLineDistribution[service]) {
          serviceLineDistribution[service] = {
            count: 0,
            avgPrice: 0,
            avgRevenue: 0,
            successRate: 0
          };
        }
        serviceLineDistribution[service].count++;
        serviceLineDistribution[service].avgPrice += firm.asking_price || 0;
        serviceLineDistribution[service].avgRevenue += firm.annual_revenue || 0;
      });
    }
  });

  // Calculate averages and correlations
  Object.keys(serviceLineDistribution).forEach(service => {
    const metrics = serviceLineDistribution[service];
    metrics.avgPrice = metrics.avgPrice / metrics.count;
    metrics.avgRevenue = metrics.avgRevenue / metrics.count;
  });

  return {
    distribution: serviceLineDistribution,
    correlations: specialtyCorrelations
  };
}

function analyzeClientele(soldFirms) {
  const clientSegments = {};
  
  soldFirms.forEach(firm => {
    if (firm.clientele) {
      const segments = firm.clientele.split(',').map(c => c.trim());
      segments.forEach(segment => {
        if (!clientSegments[segment]) {
          clientSegments[segment] = {
            count: 0,
            avgDealSize: 0,
            industries: new Set(),
            geographicPreference: {}
          };
        }
        clientSegments[segment].count++;
        clientSegments[segment].avgDealSize += firm.asking_price || 0;
        if (firm.service_lines) {
          firm.service_lines.split(',').forEach(service => 
            clientSegments[segment].industries.add(service.trim())
          );
        }
      });
    }
  });

  // Calculate averages and convert Sets to arrays
  Object.keys(clientSegments).forEach(segment => {
    const metrics = clientSegments[segment];
    metrics.avgDealSize = metrics.avgDealSize / metrics.count;
    metrics.industries = Array.from(metrics.industries);
  });

  return clientSegments;
}

function analyzeLocations(soldFirms, activeFirms, censusData) {
  const locationMetrics = {};
  
  // Combine firm and census data by location
  [...soldFirms, ...activeFirms].forEach(firm => {
    const location = firm.State || firm.STATE;
    if (!locationMetrics[location]) {
      const censusDatum = censusData.find(c => c.STATEFP === location);
      locationMetrics[location] = {
        totalFirms: 0,
        avgEmployeeCount: 0,
        avgRevenue: 0,
        medianIncome: censusDatum?.B19013_001E || 0,
        employedPopulation: censusDatum?.B23025_004E || 0,
        educationRate: censusDatum ? 
          (censusDatum.B15003_022E + censusDatum.B15003_023E) / censusDatum.B15003_001E : 0,
        marketSaturation: 0
      };
    }
    locationMetrics[location].totalFirms++;
    locationMetrics[location].avgEmployeeCount += firm.employee_count || firm.employeeCount || 0;
    locationMetrics[location].avgRevenue += firm.annual_revenue || 0;
  });

  // Calculate averages and market saturation
  Object.keys(locationMetrics).forEach(location => {
    const metrics = locationMetrics[location];
    metrics.avgEmployeeCount = metrics.avgEmployeeCount / metrics.totalFirms;
    metrics.avgRevenue = metrics.avgRevenue / metrics.totalFirms;
    metrics.marketSaturation = metrics.totalFirms / (metrics.employedPopulation || 1) * 10000;
  });

  return locationMetrics;
}

function analyzeFinancials(soldFirms) {
  return {
    priceRanges: calculatePriceRanges(soldFirms),
    revenueMultiples: calculateRevenueMultiples(soldFirms),
    employeeValueMetrics: calculateEmployeeValueMetrics(soldFirms)
  };
}

function analyzeWorkforce(soldFirms, activeFirms, censusData) {
  const workforceMetrics = {
    employeeDistribution: {},
    skillsetDemand: {},
    geographicFactors: {}
  };

  // Analyze workforce patterns
  [...soldFirms, ...activeFirms].forEach(firm => {
    const empCount = firm.employee_count || firm.employeeCount;
    const location = firm.State || firm.STATE;
    
    if (empCount && location) {
      if (!workforceMetrics.employeeDistribution[location]) {
        workforceMetrics.employeeDistribution[location] = {
          totalEmployees: 0,
          firms: 0,
          avgSize: 0
        };
      }
      
      workforceMetrics.employeeDistribution[location].totalEmployees += empCount;
      workforceMetrics.employeeDistribution[location].firms++;
    }
  });

  // Calculate averages and correlate with census data
  Object.keys(workforceMetrics.employeeDistribution).forEach(location => {
    const metrics = workforceMetrics.employeeDistribution[location];
    metrics.avgSize = metrics.totalEmployees / metrics.firms;
    
    const censusDatum = censusData.find(c => c.STATEFP === location);
    if (censusDatum) {
      workforceMetrics.geographicFactors[location] = {
        laborForceParticipation: censusDatum.B23025_004E / censusDatum.B01001_001E,
        educationLevel: (censusDatum.B15003_022E + censusDatum.B15003_023E) / censusDatum.B15003_001E,
        medianIncome: censusDatum.B19013_001E
      };
    }
  });

  return workforceMetrics;
}

function generateAnalysisPrompt(marketMetrics, filters) {
  return `
Analyze this comprehensive market data and provide strategic insights:

Market Data:
${JSON.stringify(marketMetrics, null, 2)}

Analysis Scope:
${JSON.stringify(filters, null, 2)}

Please provide detailed analysis on:

1. Service Line & Specialization Analysis
- Most successful service combinations
- Correlation between specialties and financial performance
- Geographic variations in service demand

2. Client Base Insights
- High-value client segment identification
- Geographic and demographic alignment
- Service line preferences by client type

3. Location-Based Analysis
- Market saturation levels by region
- Economic indicator correlations
- Workforce availability and quality

4. Financial Performance Patterns
- Price-to-revenue relationships
- Employee count impact on valuation
- Regional valuation variations

5. Workforce & Operational Insights
- Optimal employee structures
- Geographic workforce advantages
- Skill distribution patterns

6. Strategic Recommendations
- Market entry/expansion strategies
- Service line optimization
- Geographic targeting
- Pricing strategies

Please provide specific, data-driven insights based on the correlations between service lines, clientele, specialties, location, employee counts, asking prices, annual revenue, and census data indicators.`;
}

function parseGeminiResponse(text) {
  const sections = text.split(/\d+\./).filter(Boolean);
  
  return {
    serviceAnalysis: sections[0]?.trim() || '',
    clientInsights: sections[1]?.trim() || '',
    locationAnalysis: sections[2]?.trim() || '',
    financialPatterns: sections[3]?.trim() || '',
    workforceInsights: sections[4]?.trim() || '',
    recommendations: sections[5]?.trim() || ''
  };
}

// Helper functions for financial analysis
function calculatePriceRanges(firms) {
  // Implementation for price range analysis
  return {};
}

function calculateRevenueMultiples(firms) {
  // Implementation for revenue multiple analysis
  return {};
}

function calculateEmployeeValueMetrics(firms) {
  // Implementation for employee value metrics
  return {};
}