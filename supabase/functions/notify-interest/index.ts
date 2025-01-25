import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

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

    const { companyId, userId, companyName, location, message } = await req.json()
    console.log('Received request:', { companyId, userId, companyName, location, message })

    if (!companyId || !userId) {
      throw new Error('Missing required parameters')
    }

    // Send notification email
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Canary <notifications@inevitable.sale>',
        to: ['admin@inevitable.sale'],
        subject: `New Interest: ${companyName}`,
        html: `
          <h2>New Interest Notification</h2>
          <p><strong>Company:</strong> ${companyName}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>User Message:</strong> ${message || 'No message provided'}</p>
          <hr>
          <p>Check the admin dashboard for more details.</p>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text()
      console.error('Failed to send notification email:', errorText)
      throw new Error('Failed to send notification email')
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error: any) {
    console.error('Error in notify-interest function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})