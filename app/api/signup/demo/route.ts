import { NextRequest, NextResponse } from 'next/server'
import { createDemoUser, setDemoSessionCookie } from '@/lib/demo-session'

/**
 * =============================================================================
 * DEMO SIGNUP API ROUTE
 * =============================================================================
 * 
 * This endpoint handles Instant Demo signups (email only).
 * 
 * INTEGRATION POINTS (TODO):
 * 1. Email verification - Send verification email
 * 2. CRM - Create lead in HubSpot/Salesforce
 * 3. Database - Store signup for analytics
 * 4. Notifications - Slack alert for new signups
 * 5. Product - Create demo user account
 * 
 * =============================================================================
 */

interface DemoSignupRequest {
  email: string
  marketingOptin?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: DemoSignupRequest = await request.json()
    const { email, marketingOptin } = body

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      )
    }

    // Block free email providers
    const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com']
    const domain = email.split('@')[1]?.toLowerCase()
    if (freeProviders.includes(domain)) {
      return NextResponse.json(
        { error: 'Please use your work email' },
        { status: 400 }
      )
    }

    console.log('Demo signup received:', { email })

    // Create demo user in database + set session cookie
    try {
      await createDemoUser(email, marketingOptin || false)
      setDemoSessionCookie(email)
    } catch (dbError) {
      console.error('DB error during signup:', dbError)
      // Continue even if DB fails — user can still access demo
    }

    // =========================================================================
    // TODO: Add your integrations below
    // =========================================================================

    // 1. SEND VERIFICATION EMAIL
    // --------------------------
    // Option A: SendGrid
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    // await sgMail.send({
    //   to: email,
    //   from: process.env.SENDGRID_FROM_EMAIL,
    //   subject: 'Verify your email for SalesBuddy AI Demo',
    //   html: `<p>Click <a href="${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=...">here</a> to verify.</p>`,
    // })
    //
    // Option B: Resend
    // const { Resend } = require('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'hello@zoxima.com',
    //   to: email,
    //   subject: 'Verify your email for SalesBuddy AI Demo',
    //   html: '...',
    // })

    // 2. CREATE LEAD IN CRM
    // ---------------------
    // Option A: HubSpot
    // const hubspot = require('@hubspot/api-client')
    // const hubspotClient = new hubspot.Client({ accessToken: process.env.HUBSPOT_API_KEY })
    // await hubspotClient.crm.contacts.basicApi.create({
    //   properties: {
    //     email: email,
    //     lifecyclestage: 'lead',
    //     trial_type: 'demo',
    //     trial_start_date: new Date().toISOString(),
    //   }
    // })
    //
    // Option B: Salesforce
    // Use jsforce or Salesforce REST API

    // 3. STORE IN DATABASE
    // --------------------
    // Option A: Supabase
    // const { createClient } = require('@supabase/supabase-js')
    // const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    // await supabase.from('signups').insert({
    //   email,
    //   type: 'demo',
    //   created_at: new Date().toISOString(),
    // })

    // 4. SEND SLACK NOTIFICATION
    // --------------------------
    // await fetch(process.env.SLACK_WEBHOOK_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     text: `🚀 New Demo Signup: ${email}`,
    //   }),
    // })

    // 5. CREATE DEMO USER IN PRODUCT
    // ------------------------------
    // Call your product API to create the demo user account

    // =========================================================================
    // END INTEGRATIONS
    // =========================================================================

    return NextResponse.json({
      success: true,
      message: 'Demo signup successful',
      email,
    })

  } catch (error) {
    console.error('Demo signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
