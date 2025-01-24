import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'chris@inevitable.sale'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotifyRequest {
  practiceId: number;
  message?: string;
  userId: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { practiceId, message, userId } = await req.json() as NotifyRequest

    // Get practice details
    const { data: practice, error: practiceError } = await supabase
      .from('canary_firms_data')
      .select('*')
      .eq('Company ID', practiceId)
      .single()

    if (practiceError) throw practiceError

    // Get user profile
    const { data: userProfile, error: userError } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (userError) throw userError

    // Prepare email content
    const emailHtml = `
      <h2>New Interest Expression</h2>
      <p>A user has expressed interest in a practice:</p>
      <h3>Practice Details:</h3>
      <ul>
        <li>Name: ${practice['Company Name']}</li>
        <li>Location: ${practice.Location}</li>
        <li>Employee Count: ${practice.employeeCount || 'Not specified'}</li>
      </ul>
      <h3>User Details:</h3>
      <ul>
        <li>Name: ${userProfile.buyer_name}</li>
        <li>Email: ${userProfile.contact_email}</li>
        <li>Phone: ${userProfile.contact_phone || 'Not provided'}</li>
      </ul>
      ${message ? `<h3>Message:</h3><p>${message}</p>` : ''}
    `

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Canary <notifications@canary.accountants>',
        to: [ADMIN_EMAIL],
        subject: `New Interest: ${practice['Company Name']}`,
        html: emailHtml,
      }),
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(`Failed to send email: ${error}`)
    }

    const data = await res.json()
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in notify-interest function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

serve(handler)