import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    // Create Supabase client
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!
    )

    const { companyId, userId, message } = await req.json()
    console.log('Received notification request:', { companyId, userId, message })

    // Get company details
    const { data: company, error: companyError } = await supabase
      .from('canary_firms_data')
      .select('*')
      .eq('Company ID', companyId)
      .maybeSingle()

    if (companyError) {
      console.error('Error fetching company:', companyError)
      throw new Error('Company not found')
    }

    if (!company) {
      console.error('No company found for ID:', companyId)
      throw new Error('Company not found')
    }

    // Get user details - get most recent profile
    console.log('Fetching user profile for userId:', userId)
    const { data: userProfile, error: userError } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    console.log('User profile query result:', { data: userProfile, error: userError })

    if (userError) {
      console.error('Error fetching user profile:', userError)
      throw new Error(`Error fetching user profile: ${userError.message}`)
    }

    if (!userProfile) {
      console.error('No user profile found for ID:', userId)
      throw new Error('User profile not found')
    }

    // Send email using Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Canary <notifications@inevitable.sale>',
        to: ['chris@inevitable.sale'],
        subject: `New Interest: ${company["Company Name"]}`,
        html: `
          <h2>New Interest Notification</h2>
          <p>A user has expressed interest in ${company["Company Name"]}.</p>
          
          <h3>User Details:</h3>
          <ul>
            <li>Name: ${userProfile.buyer_name}</li>
            <li>Email: ${userProfile.contact_email}</li>
            <li>Phone: ${userProfile.contact_phone || 'Not provided'}</li>
          </ul>

          <h3>Company Details:</h3>
          <ul>
            <li>Location: ${company.Location}</li>
            <li>Employee Count: ${company.employeeCount}</li>
            <li>Specialties: ${company.specialities || 'Not specified'}</li>
          </ul>

          ${message ? `<h3>Message from User:</h3><p>${message}</p>` : ''}
          
          <p>Please follow up with the user within 4 hours.</p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.text()
      console.error('Error sending email:', errorData)
      throw new Error('Failed to send notification email')
    }

    const emailResult = await emailResponse.json()
    console.log('Email sent successfully:', emailResult)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )

  } catch (error) {
    console.error('Error in notify-interest function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})