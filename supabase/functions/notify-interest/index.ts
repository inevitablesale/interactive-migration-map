import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const ADMIN_EMAIL = 'chris@inevitable.sale'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NotifyRequest {
  companyId: number;
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
    const { companyId, message, userId } = await req.json() as NotifyRequest

    // Get practice details
    const { data: practice, error: practiceError } = await supabase
      .from('canary_firms_data')
      .select('*')
      .eq('Company ID', companyId)
      .single()

    if (practiceError) throw practiceError

    // Get user profile and auth data
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId)
    if (userError) throw userError

    const { data: userProfile, error: profileError } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (profileError) throw profileError

    // Prepare email content for admin
    const adminEmailHtml = `
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
        <li>Email: ${user.email}</li>
        <li>Phone: ${userProfile.contact_phone || 'Not provided'}</li>
      </ul>
      ${message ? `<h3>Message:</h3><p>${message}</p>` : ''}
    `

    // Prepare email content for user
    const userEmailHtml = `
      <h2>Interest Confirmation</h2>
      <p>Hello ${userProfile.buyer_name},</p>
      <p>We've received your interest in the following practice:</p>
      <ul>
        <li>Practice: ${practice['Company Name']}</li>
        <li>Location: ${practice.Location}</li>
      </ul>
      <p>Our team will review your interest and contact the practice owner on your behalf. We'll keep you updated on any developments.</p>
      <p>Best regards,<br>The Canary Team</p>
    `

    // Send email to admin
    const adminRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Canary Notifications <notifications@canary.accountants>',
        to: [ADMIN_EMAIL],
        subject: `New Interest: ${practice['Company Name']}`,
        html: adminEmailHtml,
      }),
    })

    // Send confirmation email to user
    const userRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Canary <team@canary.accountants>',
        to: [user.email],
        subject: 'Interest Confirmation - Canary',
        html: userEmailHtml,
      }),
    })

    if (!adminRes.ok || !userRes.ok) {
      const error = await adminRes.text();
      throw new Error(`Failed to send email: ${error}`);
    }

    const data = await adminRes.json();
    
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    console.error('Error in notify-interest function:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
}

serve(handler)