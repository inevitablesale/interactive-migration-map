import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration')
    }

    const { companyId, userId, location, message, employeeCount, specialities } = await req.json()
    console.log('Received request:', { companyId, userId, location, message })

    if (!companyId || !userId) {
      throw new Error('Missing required parameters')
    }

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get user's email
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }

    const userEmail = userData.user.email

    // Get anonymized company name from firm_generated_text
    const { data: generatedText, error: textError } = await supabase
      .from('firm_generated_text')
      .select('title')
      .eq('company_id', companyId)
      .single()

    if (textError) {
      console.error('Error getting generated text:', textError)
      // Don't throw, we'll use fallback
    }

    // Use anonymized title or fallback to generic location-based name
    const anonymizedName = generatedText?.title || `Practice in ${location}`

    // Send notification to admin
    const { error: adminEmailError } = await supabase.auth.admin.sendRawEmail({
      email: 'chris@inevitable.sale',
      subject: `New Interest: ${anonymizedName}`,
      html: `
        <h2>New Interest Notification</h2>
        <p><strong>Practice:</strong> ${anonymizedName}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Employee Count:</strong> ${employeeCount || 'Not specified'}</p>
        <p><strong>Specialities:</strong> ${specialities || 'Not specified'}</p>
        <p><strong>User Message:</strong> ${message || 'No message provided'}</p>
        <hr>
        <p>Company ID: ${companyId}</p>
        <p>User ID: ${userId}</p>
        <p>User Email: ${userEmail}</p>
      `
    })

    if (adminEmailError) {
      console.error('Failed to send admin notification email:', adminEmailError)
      throw adminEmailError
    }

    // Send confirmation to user
    const { error: userEmailError } = await supabase.auth.admin.sendRawEmail({
      email: userEmail,
      subject: `Interest Confirmed: ${anonymizedName}`,
      html: `
        <h2>Interest Confirmation</h2>
        <p>Thank you for expressing interest in ${anonymizedName}.</p>
        <p>Our team has been notified and will review your interest shortly. We aim to make contact within 4 hours during business hours.</p>
        <p><strong>Practice Details:</strong></p>
        <ul>
          <li>Location: ${location}</li>
          <li>Employee Count: ${employeeCount || 'Not specified'}</li>
          <li>Specialities: ${specialities || 'Not specified'}</li>
        </ul>
        ${message ? `<p><strong>Your Message:</strong> "${message}"</p>` : ''}
        <p>If you have any questions in the meantime, please reply to this email.</p>
        <br>
        <p>Best regards,</p>
        <p>The Canary Team</p>
      `
    })

    if (userEmailError) {
      console.error('Failed to send user confirmation email:', userEmailError)
      throw userEmailError
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