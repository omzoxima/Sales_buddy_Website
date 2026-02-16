import { NextRequest, NextResponse } from 'next/server'

/**
 * =============================================================================
 * PILOT REQUEST API ROUTE
 * =============================================================================
 * 
 * This endpoint handles Guided Pilot requests (sales-assisted).
 * These are high-intent leads that need immediate sales follow-up.
 * 
 * INTEGRATION POINTS (TODO):
 * 1. CRM - Create lead with HIGH priority
 * 2. Email - Send confirmation to prospect
 * 3. Email - Alert sales team immediately
 * 4. Slack - Urgent notification to sales channel
 * 5. Calendar - Optionally book Calendly slot
 * 6. Database - Store for tracking
 * 
 * =============================================================================
 */

interface PilotRequestBody {
  name: string
  email: string
  phone: string
  company: string
  companySize: string
  role: string
  salesTeamSize: string
  crm: string
  challenge?: string
  timeline?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: PilotRequestBody = await request.json()
    const { 
      name, email, phone, company, companySize, role, 
      salesTeamSize, crm, challenge, timeline 
    } = body

    // Validate required fields
    if (!name || !email || !phone || !company || !companySize || !role || !salesTeamSize || !crm) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      )
    }

    // Validate email
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

    console.log('Pilot request received:', { 
      name, email, phone, company, companySize, role, 
      salesTeamSize, crm, challenge, timeline 
    })

    // =========================================================================
    // TODO: Add your integrations below
    // IMPORTANT: Pilot requests are high-priority - notify sales immediately!
    // =========================================================================

    // 1. CREATE HIGH-PRIORITY LEAD IN CRM
    // -----------------------------------
    // Option A: HubSpot
    // await hubspotClient.crm.contacts.basicApi.create({
    //   properties: {
    //     email,
    //     firstname: name.split(' ')[0],
    //     lastname: name.split(' ').slice(1).join(' '),
    //     phone,
    //     company,
    //     jobtitle: role,
    //     numemployees: companySize,
    //     lifecyclestage: 'salesqualifiedlead', // High priority!
    //     trial_type: 'pilot',
    //     sales_team_size: salesTeamSize,
    //     current_crm: crm,
    //     pain_points: challenge,
    //     timeline: timeline,
    //     lead_source: 'Website - Pilot Request',
    //   }
    // })
    //
    // Also create a TASK for sales follow-up:
    // await hubspotClient.crm.objects.tasks.basicApi.create({
    //   properties: {
    //     hs_task_subject: `URGENT: Follow up with ${name} at ${company}`,
    //     hs_task_body: `Pilot request received. Call within 24 hours.\n\nPhone: ${phone}\nCRM: ${crm}\nTeam Size: ${salesTeamSize}\nChallenge: ${challenge}`,
    //     hs_task_status: 'NOT_STARTED',
    //     hs_task_priority: 'HIGH',
    //   }
    // })

    // 2. SEND CONFIRMATION EMAIL TO PROSPECT
    // --------------------------------------
    // await sendEmail({
    //   to: email,
    //   subject: "We received your pilot request - we'll call you within 24 hours",
    //   html: `
    //     <h1>Thanks for your interest, ${name.split(' ')[0]}!</h1>
    //     <p>A member of our team will call you at ${phone} within 24 hours.</p>
    //     <p>In the meantime, feel free to try our <a href="...">Instant Demo</a>.</p>
    //   `
    // })

    // 3. ALERT SALES TEAM IMMEDIATELY
    // -------------------------------
    // Send email to sales@zoxima.com or specific AE

    // 4. URGENT SLACK NOTIFICATION
    // ----------------------------
    // await fetch(process.env.SLACK_WEBHOOK_URL, {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     text: `🔥 *URGENT: New Pilot Request!*\n\n*Name:* ${name}\n*Company:* ${company} (${companySize})\n*Phone:* ${phone}\n*Email:* ${email}\n*Role:* ${role}\n*Sales Team:* ${salesTeamSize}\n*CRM:* ${crm}\n*Timeline:* ${timeline || 'Not specified'}\n*Challenge:* ${challenge || 'Not specified'}\n\n⏰ *Call within 24 hours!*`,
    //   }),
    // })

    // 5. STORE IN DATABASE
    // --------------------
    // await supabase.from('pilot_requests').insert({
    //   name,
    //   email,
    //   phone,
    //   company,
    //   company_size: companySize,
    //   role,
    //   sales_team_size: salesTeamSize,
    //   crm,
    //   challenge,
    //   timeline,
    //   status: 'new',
    //   created_at: new Date().toISOString(),
    // })

    // =========================================================================
    // END INTEGRATIONS
    // =========================================================================

    return NextResponse.json({
      success: true,
      message: 'Pilot request submitted successfully',
    })

  } catch (error) {
    console.error('Pilot request error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
