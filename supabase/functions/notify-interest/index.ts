import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
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

    // Send admin notification using SMTP
    const { error: adminEmailError } = await supabase.auth.admin.sendEmail({
      email: 'chris@inevitable.sale',
      subject: `New Interest: ${anonymizedName}`,
      template: 'interest-notification-admin',
      template_data: {
        practice: anonymizedName,
        location: location,
        employeeCount: employeeCount || 'Not specified',
        specialities: specialities || 'Not specified',
        message: message || 'No message provided',
        companyId: companyId,
        userId: userId,
        userEmail: userEmail
      }
    })

    if (adminEmailError) {
      console.error('Failed to send admin notification email:', adminEmailError)
      throw adminEmailError
    }

    // Send user confirmation using SMTP
    const { error: userEmailError } = await supabase.auth.admin.sendEmail({
      email: userEmail,
      subject: `Interest Confirmed: ${anonymizedName}`,
      template: 'interest-confirmation-user',
      template_data: {
        practice: anonymizedName,
        location: location,
        employeeCount: employeeCount || 'Not specified',
        specialities: specialities || 'Not specified',
        message: message || '',
      }
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