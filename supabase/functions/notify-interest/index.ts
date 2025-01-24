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
    console.log('Notify interest function called');
    const { companyId, message, userId } = await req.json() as NotifyRequest;
    console.log('Request data:', { companyId, message, userId });

    // Get practice details and generated text
    const { data: practice, error: practiceError } = await supabase
      .from('canary_firms_data')
      .select(`
        *,
        firm_generated_text (
          title
        )
      `)
      .eq('Company ID', companyId)
      .single();

    if (practiceError) {
      console.error('Error fetching practice:', practiceError);
      throw practiceError;
    }
    console.log('Practice data:', practice);

    // Get user profile and auth data
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    if (userError) {
      console.error('Error fetching user:', userError);
      throw userError;
    }
    console.log('User data:', user);

    const { data: userProfile, error: profileError } = await supabase
      .from('buyer_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      throw profileError;
    }
    console.log('User profile:', userProfile);

    const practiceTitle = practice.firm_generated_text?.[0]?.title || practice['Company Name'];

    // Prepare email content for admin
    const adminEmailHtml = `
      <h2>New Interest Expression</h2>
      <p>A user has expressed interest in a practice:</p>
      <h3>Practice Details:</h3>
      <ul>
        <li>Name: ${practiceTitle}</li>
        <li>Location: ${practice.Location}</li>
        <li>Employee Count: ${practice.employeeCount || 'Not specified'}</li>
      </ul>
      <h3>User Details:</h3>
      <ul>
        <li>Name: ${userProfile.buyer_name}</li>
        <li>Email: ${user.email}</li>
        <li>Phone: ${userProfile.contact_phone || 'Not provided'}</li>
      </ul>
      ${message ? `<h3>Message from Buyer:</h3><p>${message}</p>` : ''}
    `;

    // Prepare email content for user
    const userEmailHtml = `
      <h2>Interest Confirmation</h2>
      <p>Hello ${userProfile.buyer_name},</p>
      <p>We've received your interest in the following practice:</p>
      <ul>
        <li>Practice: ${practiceTitle}</li>
        <li>Location: ${practice.Location}</li>
      </ul>
      <p>Our team will review your interest and contact the practice owner on your behalf. We'll keep you updated on any developments.</p>
      <p>Best regards,<br>The Canary Team</p>
    `;

    console.log('Sending admin email...');
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
        subject: `New Interest: ${practiceTitle}`,
        html: adminEmailHtml,
      }),
    });

    console.log('Sending user email...');
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
    });

    if (!adminRes.ok || !userRes.ok) {
      console.error('Error response from Resend:', {
        adminStatus: adminRes.status,
        userStatus: userRes.status
      });
      const adminError = await adminRes.text();
      const userError = await userRes.text();
      console.error('Admin email error:', adminError);
      console.error('User email error:', userError);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send notification emails',
          details: { adminError, userError }
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    const data = await adminRes.json();
    console.log('Emails sent successfully:', data);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Notifications sent successfully' }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error('Error in notify-interest function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
}

serve(handler)