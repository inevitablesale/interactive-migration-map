import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { companyName, userId, isAnonymous } = await req.json()

    // Send admin notification
    const adminEmailResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/smtp-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          to: 'chris@inevitable.sale',
          subject: `New Interest: ${companyName}`,
          html: `
            <h2>New Interest Notification</h2>
            <p>A user has expressed interest in ${companyName}</p>
            <p>User ID: ${userId}</p>
            <p>Anonymous: ${isAnonymous ? 'Yes' : 'No'}</p>
          `,
          text: `New Interest Notification\n\nA user has expressed interest in ${companyName}\nUser ID: ${userId}\nAnonymous: ${isAnonymous ? 'Yes' : 'No'}`
        })
      }
    )

    if (!adminEmailResponse.ok) {
      throw new Error('Failed to send admin notification')
    }

    // Send user confirmation
    const userEmailResponse = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/smtp-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: JSON.stringify({
          to: userId,
          subject: 'Interest Confirmation',
          html: `
            <h2>Interest Confirmation</h2>
            <p>We've received your interest in ${companyName}.</p>
            <p>Our team will review your request and get back to you soon.</p>
          `,
          text: `Interest Confirmation\n\nWe've received your interest in ${companyName}.\nOur team will review your request and get back to you soon.`
        })
      }
    )

    if (!userEmailResponse.ok) {
      throw new Error('Failed to send user confirmation')
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})