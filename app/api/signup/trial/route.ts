import { NextRequest, NextResponse } from 'next/server'

/**
 * =============================================================================
 * TRIAL SIGNUP API ROUTE
 * =============================================================================
 * 
 * This endpoint handles Document Trial signups (full form).
 * 
 * INTEGRATION POINTS (TODO):
 * 1. Email verification - Send verification email
 * 2. CRM - Create lead with full details
 * 3. Database - Store user and company info
 * 4. Notifications - Slack alert with details
 * 5. Product - Create trial user account
 * 6. Analytics - Track signup event
 * 
 * =============================================================================
 */

interface TrialSignupRequest {
  email: string
  name: string
  password: string
  company: string
  companySize: string
  role: string
  industry: string
  crm: string
}

export async function POST(request: NextRequest) {
  try {
    const body: TrialSignupRequest = await request.json()
    const { email, name, password, company, companySize, role, industry, crm } = body

    // Validate required fields
    if (!email || !name || !password || !company || !companySize || !role || !industry || !crm) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!email.includes('@')) {
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

    // Validate password strength
    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters with 1 uppercase and 1 number' },
        { status: 400 }
      )
    }

    console.log('Trial signup received:', { email, name, company, companySize, role, industry, crm })

    // =========================================================================
    // TODO: Add your integrations below
    // =========================================================================

    // 1. HASH PASSWORD & CREATE USER
    // ------------------------------
    // const bcrypt = require('bcrypt')
    // const hashedPassword = await bcrypt.hash(password, 10)
    // 
    // Store in your auth system (NextAuth, Clerk, Auth0, or custom)

    // 2. SEND VERIFICATION EMAIL
    // --------------------------
    // See demo route for examples

    // 3. CREATE LEAD IN CRM WITH FULL DETAILS
    // ---------------------------------------
    // Option A: HubSpot
    // await hubspotClient.crm.contacts.basicApi.create({
    //   properties: {
    //     email,
    //     firstname: name.split(' ')[0],
    //     lastname: name.split(' ').slice(1).join(' '),
    //     company,
    //     jobtitle: role,
    //     industry,
    //     numemployees: companySize,
    //     lifecyclestage: 'lead',
    //     trial_type: 'document_trial',
    //     trial_start_date: new Date().toISOString(),
    //     current_crm: crm,
    //   }
    // })

    // 4. STORE IN DATABASE
    // --------------------
    // await supabase.from('users').insert({
    //   email,
    //   name,
    //   password_hash: hashedPassword,
    //   company,
    //   company_size: companySize,
    //   role,
    //   industry,
    //   crm,
    //   trial_type: 'document_trial',
    //   trial_expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days
    //   created_at: new Date().toISOString(),
    // })

    // 5. SEND SLACK NOTIFICATION
    // --------------------------
    // await fetch(process.env.SLACK_WEBHOOK_URL, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     text: `📄 New Trial Signup!\n*Email:* ${email}\n*Company:* ${company} (${companySize})\n*Role:* ${role}\n*Industry:* ${industry}\n*CRM:* ${crm}`,
    //   }),
    // })

    // 6. TRACK ANALYTICS EVENT
    // ------------------------
    // Mixpanel, Amplitude, Segment, etc.

    // =========================================================================
    // END INTEGRATIONS
    // =========================================================================

    return NextResponse.json({
      success: true,
      message: 'Trial signup successful',
      email,
    })

  } catch (error) {
    console.error('Trial signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
