import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_ANON_KEY!
    )

    const { companyId, userId, message } = await req.json()
    console.log('Received request:', { companyId, userId, message })

    if (!companyId || !userId) {
      throw new Error('Missing required parameters')
    }

    // Get company details
    const { data: company, error: companyError } = await supabase
      .from('canary_firms_data')
      .select('*')
      .eq('Company ID', companyId)
      .single()

    if (companyError || !company) {
      console.error('Company query error:', companyError)
      throw new Error('Company not found')
    }

    // Get user profile with detailed logging
    console.log('Executing buyer_profiles query:', {
      table: 'buyer_profiles',
      filter: { user_id: userId },
      query: `SELECT * FROM buyer_profiles WHERE user_id = '${userId}'`
    })
    
    const { data: userProfile, error: userError } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    console.log('User profile query result:', { data: userProfile, error: userError })

    // If no profile exists, create one
    if (!userProfile) {
      console.log('No profile found, creating one')
      const { error: createError } = await supabase
        .from('buyer_profiles')
        .insert({
          user_id: userId,
          buyer_name: 'Anonymous',
          contact_email: 'pending@inevitable.sale',
          target_geography: [],
          subscription_tier: 'free'
        })

      if (createError) {
        console.error('Error creating profile:', createError)
        throw new Error('Could not create user profile')
      }
    }

    // Send notification email
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Canary <notifications@inevitable.sale>',
        to: ['admin@inevitable.sale'],
        subject: `New Interest: ${company['Company Name']}`,
        html: `
          <h2>New Interest Notification</h2>
          <p><strong>Company:</strong> ${company['Company Name']}</p>
          <p><strong>Location:</strong> ${company.Location}</p>
          <p><strong>User Message:</strong> ${message || 'No message provided'}</p>
          <hr>
          <p>Check the admin dashboard for more details.</p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      throw new Error('Failed to send notification email')
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})