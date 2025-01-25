import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from "npm:resend@2.0.0";
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

interface InterestRequest {
  companyId: number
  userId: string
  location: string
  message?: string
  employeeCount?: number
  specialities?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders
    })
  }

  try {
    console.log('Starting notify-interest function')
    
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase configuration')
    }

    const requestData: InterestRequest = await req.json()
    const { companyId, userId, location, message, employeeCount, specialities } = requestData
    
    console.log('Received request:', { companyId, userId, location, employeeCount, specialities })

    if (!companyId || !userId) {
      throw new Error('Missing required parameters: companyId and userId are required')
    }

    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    // Get user's email
    console.log('Fetching user data...')
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError) {
      console.error('Error getting user:', userError)
      throw userError
    }

    const userEmail = userData.user.email

    // Get anonymized company name from firm_generated_text
    console.log('Fetching generated text data...')
    const { data: generatedText, error: textError } = await supabase
      .from('firm_generated_text')
      .select('title, teaser')
      .eq('company_id', companyId)
      .single()

    if (textError) {
      console.error('Error getting generated text:', textError)
      console.log('Falling back to location-based name')
    }

    // Get company data for additional context
    console.log('Fetching company data...')
    const { data: companyData, error: companyError } = await supabase
      .from('canary_firms_data')
      .select('*')
      .eq('Company ID', companyId)
      .single()

    if (companyError) {
      console.error('Error getting company data:', companyError)
    }

    // Use anonymized title or fallback to generic location-based name
    const anonymizedName = generatedText?.title || `Practice in ${location}`
    const teaser = generatedText?.teaser || 'Details available upon request'

    // Admin email template
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">New Interest Notification</h2>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Practice:</strong> ${anonymizedName}</p>
              <p><strong>Location:</strong> ${location}</p>
              <p><strong>Employee Count:</strong> ${employeeCount || 'Not specified'}</p>
              <p><strong>Specialities:</strong> ${specialities || 'Not specified'}</p>
              ${message ? `<p><strong>User Message:</strong> "${message}"</p>` : ''}
            </div>
            <div style="background: #e5e7eb; padding: 15px; border-radius: 5px;">
              <h4 style="margin-top: 0;">Technical Details:</h4>
              <p>Company ID: ${companyId}</p>
              <p>User ID: ${userId}</p>
              <p>User Email: ${userEmail}</p>
            </div>
          </div>
        </body>
      </html>
    `

    // User confirmation email template
    const userEmailHtml = `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Interest Confirmation</h2>
            <p>Thank you for expressing interest in ${anonymizedName}.</p>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Practice Overview</h3>
              <p>${teaser}</p>
              <h4>Details:</h4>
              <ul style="list-style: none; padding-left: 0;">
                <li>📍 Location: ${location}</li>
                ${employeeCount ? `<li>👥 Employee Count: ${employeeCount}</li>` : ''}
                ${specialities ? `<li>🎯 Specialities: ${specialities}</li>` : ''}
              </ul>
              ${message ? `<p><strong>Your Message:</strong> "${message}"</p>` : ''}
            </div>
            <p>Our team has been notified and will review your interest shortly. We aim to make contact within 4 hours during business hours.</p>
            <p>If you have any questions in the meantime, please reply to this email.</p>
            <div style="margin-top: 30px;">
              <p>Best regards,</p>
              <p>The Canary Team</p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send admin notification email using Resend
    console.log('Sending admin notification email...')
    const adminEmailResponse = await resend.emails.send({
      from: "Canary <notifications@inevitable.sale>",
      to: "chris@inevitable.sale",
      subject: `New Interest: ${anonymizedName}`,
      html: adminEmailHtml
    });

    if (!adminEmailResponse.id) {
      console.error('Failed to send admin notification email:', adminEmailResponse);
      throw new Error('Failed to send admin notification email');
    }

    // Send user confirmation email using Resend
    console.log('Sending user confirmation email...')
    const userEmailResponse = await resend.emails.send({
      from: "Canary <notifications@inevitable.sale>",
      to: userEmail,
      subject: `Interest Confirmed: ${anonymizedName}`,
      html: userEmailHtml
    });

    if (!userEmailResponse.id) {
      console.error('Failed to send user confirmation email:', userEmailResponse);
      throw new Error('Failed to send user confirmation email');
    }

    console.log('Successfully sent notification emails')

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Notification emails sent successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error: any) {
    console.error('Error in notify-interest function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})