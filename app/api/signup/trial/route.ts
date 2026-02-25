import { NextRequest, NextResponse } from 'next/server'
import {
  checkTrialStatus,
  getCredentialsByRole,
  createTrialUser,
  sendTrialCredentialsEmail,
} from '@/lib/trial-credentials'
import { query } from '@/lib/db'

/**
 * =============================================================================
 * TRIAL SIGNUP API ROUTE
 * =============================================================================
 *
 * GET  /api/signup/trial?email=...  → Check if already registered (no side effects)
 * POST /api/signup/trial            → Complete signup (after OTP verified)
 *
 * =============================================================================
 */

// Check-only: is user already registered?
export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get('email')
    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const trialStatus = await checkTrialStatus(email)
    if (trialStatus.registered) {
      return NextResponse.json({
        alreadyRegistered: true,
        expired: trialStatus.expired,
      })
    }

    return NextResponse.json({ alreadyRegistered: false })
  } catch (error) {
    console.error('Trial check error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}

// Full signup: verify OTP → fetch creds → email → create user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, role } = body

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Email, name, and role are required' },
        { status: 400 }
      )
    }

    // Double-check not already registered
    const trialStatus = await checkTrialStatus(email)
    if (trialStatus.registered) {
      return NextResponse.json({
        alreadyRegistered: true,
        expired: trialStatus.expired,
        message: 'You have already registered for a free trial.',
      })
    }

    // Verify OTP was completed for this email
    const otpRows = await query<{ id: number }>(
      `SELECT id FROM otp_codes
             WHERE email = $1 AND verified = TRUE
             ORDER BY created_at DESC LIMIT 1`,
      [email]
    )

    if (otpRows.length === 0) {
      return NextResponse.json(
        { error: 'Please verify your email first' },
        { status: 400 }
      )
    }

    // Fetch credentials for this role
    const credentials = await getCredentialsByRole(role)
    if (!credentials) {
      return NextResponse.json(
        { error: 'No trial credentials available for this role. Please contact support.' },
        { status: 404 }
      )
    }

    // Create trial user (15-day expiry)
    await createTrialUser(email, name, role)

    // Send credentials email
    const sent = await sendTrialCredentialsEmail(email, name, credentials)
    if (!sent) {
      return NextResponse.json(
        { error: 'Failed to send credentials email. Please try again.' },
        { status: 500 }
      )
    }

    console.log('Trial signup complete:', { email, name, role })

    return NextResponse.json({
      success: true,
      message: 'Trial credentials sent to your email',
    })
  } catch (error) {
    console.error('Trial signup error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

