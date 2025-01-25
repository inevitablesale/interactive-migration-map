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

    const { companyId, userId, companyName, location, message, employeeCount, specialities } = await req.json()
    console.log('Received request:', { companyId, userId, companyName, location, message })

    if (!companyId || !userId) {
      throw new Error('Missing required parameters')
    }

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Send email using Supabase's built-in email service
    const { error: emailError } = await supabase.auth.admin.sendRawEmail({
      email: 'admin@inevitable.sale',
      subject: `New Interest: ${companyName}`,
      html: `
        <h2>New Interest Notification</h2>
        <p><strong>Company:</strong> ${companyName}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Employee Count:</strong> ${employeeCount || 'Not specified'}</p>
        <p><strong>Specialities:</strong> ${specialities || 'Not specified'}</p>
        <p><strong>User Message:</strong> ${message || 'No message provided'}</p>
        <hr>
        <p>Check the admin dashboard for more details.</p>
        <p>Company ID: ${companyId}</p>
        <p>User ID: ${userId}</p>
      `
    })

    if (emailError) {
      console.error('Failed to send notification email:', emailError)
      throw new Error('Failed to send notification email')
    }

    console.log('Successfully sent notification email')

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