import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'
import { BigQuery } from 'https://esm.sh/@google-cloud/bigquery@7.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { stateFips } = await req.json()
    if (!stateFips) {
      throw new Error('State FIPS code is required')
    }

    console.log('Processing request for FIPS code:', stateFips)

    const credentials = await getGoogleCredentials()
    console.log('Retrieved Google credentials')

    const bigquery = new BigQuery({
      credentials: JSON.parse(credentials),
      projectId: JSON.parse(credentials).project_id
    })

    // First query to validate FIPS code
    const fipsQuery = `
      SELECT state_fips_code, state_name
      FROM \`bigquery-public-data.census_utility.fips_codes_all\`
      WHERE state_fips_code = '${stateFips.padStart(2, '0')}'
      LIMIT 1
    `
    console.log('Executing FIPS validation query:', fipsQuery)
    const [fipsRows] = await bigquery.query({ query: fipsQuery })
    
    if (!fipsRows || fipsRows.length === 0) {
      throw new Error('Invalid state FIPS code')
    }

    console.log('FIPS validation successful:', fipsRows[0])

    // Then query the ACS data
    const acsQuery = `
      SELECT 
        geo_id,
        total_pop,
        median_income,
        median_age,
        housing_units,
        employment_rate,
        bachelors_degree_or_higher_rate
      FROM \`bigquery-public-data.census_bureau_acs.state_2021_1yr\`
      WHERE geo_id = '${fipsRows[0].state_fips_code}'
    `
    console.log('Executing ACS query:', acsQuery)
    const [rows] = await bigquery.query({ query: acsQuery })
    console.log('ACS query successful, returned rows:', rows.length)
    
    return new Response(
      JSON.stringify(rows),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  } catch (error) {
    console.error('Error in census-data function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})

async function getGoogleCredentials() {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? ''
  )

  const { data, error } = await supabaseClient
    .from('secrets')
    .select('secret')
    .eq('name', 'GOOGLE_CLOUD_CREDENTIALS')
    .single()

  if (error) throw error
  return data.secret
}