import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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

    if (queryError) {
      console.error('Database query error:', queryError);
      throw queryError;
    }

    console.log(`Found ${matchingFirms?.length || 0} potential matches`);
    console.log('Sample of matching firms:', JSON.stringify(matchingFirms?.slice(0, 2), null, 2));

    // Store basic match results in opportunities
    const { data: opportunity, error: opportunityError } = await supabase
      .from('ai_opportunities')
      .insert({
        buyer_profile_id: buyerProfile.id,
        opportunity_data: {
          matches: matchingFirms,
          searchCriteria: {
            employeeRange: `${buyerProfile.employee_count_min || 0} - ${buyerProfile.employee_count_max || 'unlimited'}`,
            locations: buyerProfile.target_geography,
            serviceLines: buyerProfile.service_lines
          }
        },
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
      matches: matchingFirms,
      matchCount: matchingFirms?.length || 0,
      searchCriteria: {
        employeeRange: `${buyerProfile.employee_count_min || 0} - ${buyerProfile.employee_count_max || 'unlimited'}`,
        locations: buyerProfile.target_geography,
        serviceLines: buyerProfile.service_lines
      },
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