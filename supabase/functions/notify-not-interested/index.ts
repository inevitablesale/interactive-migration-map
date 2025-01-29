import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Resend } from "npm:resend@2.0.0";

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
    const { company_id, user_id } = await req.json()
    
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get company details and generated text
    const { data: companyData, error: companyError } = await supabase
      .from('canary_firms_data')
      .select('*')
      .eq('Company ID', company_id)
      .single()

    if (companyError) throw companyError

    // Get generated text
    const { data: generatedText, error: textError } = await supabase
      .from('firm_generated_text')
      .select('title')
      .eq('company_id', company_id)
      .single()

    if (textError && textError.code !== 'PGRST116') { // Ignore "no rows returned" error
      throw textError
    }

    // Get user email
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(user_id)
    if (userError) throw userError

    const practiceTitle = generatedText?.title?.replace(/Premier /g, '') || `Practice #${companyData['Company ID']}`

    const resend = new Resend(Deno.env.get('SMTP_PASSWORD'));

    console.log('Sending email to:', user.email);

    const data = await resend.emails.send({
      from: 'Canary Team <team@canary.accountants>',
      to: user.email,
      subject: `Update: ${practiceTitle} - Not Currently For Sale`,
      html: `
        <h2>Practice Update: Not Currently For Sale</h2>
        <p>We wanted to let you know that "${practiceTitle}" has indicated they are not interested in selling at this time.</p>
        <p>This practice will be removed from your active tracking list, but don't worry - there are many other opportunities available!</p>
        <p>You can continue browsing other practices that might be a better fit for your acquisition goals.</p>
        <br>
        <p>Best regards,<br>The Canary Team</p>
      `,
    });

    console.log('Email sent successfully:', data);

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})