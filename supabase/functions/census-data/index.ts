import { createClient } from '@supabase/supabase-js'
import { BigQuery } from '@google-cloud/bigquery'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const credentials = await getGoogleCredentials()
    const bigquery = new BigQuery({
      credentials: JSON.parse(credentials),
      projectId: JSON.parse(credentials).project_id
    })

    const query = `
      SELECT 
        geo_id,
        total_pop,
        median_income,
        median_age
      FROM \`bigquery-public-data.census_bureau_acs.county_2019_5yr\`
      LIMIT 10
    `

    const [rows] = await bigquery.query({ query })
    
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