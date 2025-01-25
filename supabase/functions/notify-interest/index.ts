import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { Resend } from "npm:resend@2.0.0";

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

const resend = new Resend(RESEND_API_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !RESEND_API_KEY) {
      throw new Error('Missing configuration')
    }

    const { companyId, userId, location, message, employeeCount, specialities } = await req.json()
    console.log('Received request:', { companyId, userId, location, message })

    if (!companyId || !userId) {
      throw new Error('Missing required parameters')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get user's email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }

    const userEmail = userData.user.email

    // Get anonymized company name
    const { data: generatedText, error: textError } = await supabase
      .from('firm_generated_text')
      .select('title')
      .eq('company_id', companyId)
      .single()

    const anonymizedName = generatedText?.title || `Practice in ${location}`

    // Send admin notification using Resend
    const adminEmailResponse = await resend.emails.send({
      from: "Canary <notifications@inevitable.sale>",
      to: "chris@inevitable.sale",
      subject: `New Interest: ${anonymizedName}`,
      html: `
        <h2>New Interest Notification</h2>
        <p>A user has expressed interest in ${anonymizedName}</p>
        <h3>Details:</h3>
        <ul>
          <li>Location: ${location}</li>
          <li>Employee Count: ${employeeCount || 'Not specified'}</li>
          <li>Specialities: ${specialities || 'Not specified'}</li>
          <li>Message: ${message || 'No message provided'}</li>
        </ul>
        <h3>User Information:</h3>
        <ul>
          <li>User ID: ${userId}</li>
          <li>User Email: ${userEmail}</li>
        </ul>
        <h3>Practice Information:</h3>
        <ul>
          <li>Company ID: ${companyId}</li>
        </ul>
      `,
    });

    if (adminEmailResponse.error) {
      console.error('Failed to send admin notification email:', adminEmailResponse.error)
      throw adminEmailResponse.error
    }

    // Send user confirmation using Resend
    const userEmailResponse = await resend.emails.send({
      from: "Canary <notifications@inevitable.sale>",
      to: userEmail,
      subject: `Interest Confirmed: ${anonymizedName}`,
      html: `
        <h2>Interest Confirmation</h2>
        <p>Thank you for expressing interest in ${anonymizedName}!</p>
        <h3>Practice Details:</h3>
        <ul>
          <li>Location: ${location}</li>
          <li>Employee Count: ${employeeCount || 'Not specified'}</li>
          <li>Specialities: ${specialities || 'Not specified'}</li>
        </ul>
        ${message ? `<p>Your message: "${message}"</p>` : ''}
        <p>Our team will review your interest and contact you shortly with next steps.</p>
      `,
    });

    if (userEmailResponse.error) {
      console.error('Failed to send user confirmation email:', userEmailResponse.error)
      throw userEmailResponse.error
    }

    console.log('Successfully sent notification emails')

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