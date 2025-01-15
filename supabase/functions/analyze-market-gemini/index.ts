import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 3600000; // 1 hour in milliseconds
const MAX_REQUESTS_PER_WINDOW = 50; // Maximum requests per hour
const requestCounts = new Map<string, { count: number; timestamp: number }>();

// Token count estimation (approximate)
const ESTIMATED_TOKENS_PER_CHAR = 0.25;
const MAX_TOKENS_PER_REQUEST = 30000; // Adjust based on your Gemini API plan

function estimateTokenCount(text: string): number {
  return Math.ceil(text.length * ESTIMATED_TOKENS_PER_CHAR);
}

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const clientRequests = requestCounts.get(clientId);

  if (!clientRequests) {
    requestCounts.set(clientId, { count: 1, timestamp: now });
    return true;
  }

  if (now - clientRequests.timestamp > RATE_LIMIT_WINDOW) {
    // Reset if window has passed
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
    // Extract client identifier (you might want to use auth token or IP)
    const clientId = req.headers.get('x-client-info') || 'anonymous';

    // Check rate limit
    if (!checkRateLimit(clientId)) {
      console.log(`Rate limit exceeded for client: ${clientId}`);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { marketData } = await req.json();
    const { filters, soldFirms, activeFirms, censusData } = marketData;

    // Process and correlate data
    const marketMetrics = processMarketData(soldFirms, activeFirms, censusData);
    
    // Estimate token count for the request
    const metricsJson = JSON.stringify(marketMetrics, null, 2);
    const estimatedTokens = estimateTokenCount(metricsJson);

    if (estimatedTokens > MAX_TOKENS_PER_REQUEST) {
      console.log(`Token limit exceeded. Estimated tokens: ${estimatedTokens}`);
      return new Response(
        JSON.stringify({ error: 'Request too large. Please reduce the data size.' }),
        { 
          status: 413,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY'));
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create comprehensive analysis prompt with context
    const prompt = `You are a market analysis expert specializing in professional services firms, particularly accounting and advisory practices. Your task is to analyze market data and provide strategic insights.

CONTEXT:
Professional services firms' value is heavily influenced by:
- Service line mix and specialization
- Client relationships and retention
- Geographic market conditions
- Workforce quality and stability
- Local economic indicators

AVAILABLE DATA:
${JSON.stringify(marketMetrics, null, 2)}

ANALYSIS OBJECTIVES:

1. Service Line Analysis:
- Identify most profitable service combinations
- Correlate service types with client retention
- Map service demands to geographic areas
- Calculate revenue per service line

2. Client Base Analysis:
- Segment clients by industry and size
- Map geographic distribution of client types
- Analyze revenue per client segment
- Identify underserved markets

3. Geographic Analysis:
- Correlate location with firm performance
- Analyze demographic impacts on pricing
- Identify market saturation levels
- Map expansion opportunities

4. Financial Metrics:
- Calculate revenue per employee
- Analyze price-to-revenue ratios
- Compare valuations across regions
- Identify pricing trends

5. Workforce Analysis:
- Optimal employee structures
- Geographic talent availability
- Compensation trends
- Growth constraints

Please analyze these relationships and provide:
1. Key correlations between service lines, clientele, and financial performance
2. Geographic market opportunities based on census data
3. Pricing insights based on service mix and location
4. Strategic recommendations for market entry or expansion
5. Risk factors specific to each market segment

Format your response with clear sections for:
- Opportunities (based on data correlations)
- Growth Potential (with specific metrics)
- Risk Factors (by market segment)
- Strategic Recommendations (actionable insights)`;

    console.log('Sending prompt to Gemini:', prompt);
    console.log('Estimated token count:', estimatedTokens);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Received response from Gemini:', text);

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