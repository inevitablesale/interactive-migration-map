import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'https://esm.sh/@resend/node'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

    const { companyId, userId, message } = await req.json()
    console.log('Received notification request:', { companyId, userId, message })

    // Get the user's profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('buyer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError) {
      console.error('Error fetching profile:', profileError)
      throw new Error('Error fetching user profile')
    }

    // Get the practice details
    const { data: practice, error: practiceError } = await supabaseClient
      .from('canary_firms_data')
      .select('*')
      .eq('Company ID', companyId)
      .single()

    if (practiceError) {
      console.error('Error fetching practice:', practiceError)
      throw new Error('Error fetching practice details')
    }

    // Send email notification
    const emailHtml = `
      <h2>New Interest Expression</h2>
      <p><strong>Buyer:</strong> ${profile.buyer_name}</p>
      <p><strong>Contact Email:</strong> ${profile.contact_email}</p>
      <p><strong>Practice:</strong> ${practice['Company Name']}</p>
      <p><strong>Location:</strong> ${practice.Location}</p>
      ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
      <p><strong>Subscription Tier:</strong> ${profile.subscription_tier}</p>
    `

    const { data: emailResponse, error: emailError } = await resend.emails.send({
      from: 'Canary <notifications@inevitable.sale>',
      to: ['chris@inevitable.sale'],
      subject: `New Interest: ${practice['Company Name']}`,
      html: emailHtml,
    })

    if (emailError) {
      console.error('Error sending email:', emailError)
      throw new Error('Failed to send notification email')
    }

    console.log('Successfully sent notification email:', emailResponse)

    return new Response(
      JSON.stringify({ message: 'Notification sent successfully' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in notify-interest function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      },
    )
  }
})