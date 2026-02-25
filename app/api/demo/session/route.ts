import { NextRequest, NextResponse } from 'next/server'
import { getSessionStatus } from '@/lib/demo-session'
import { sendDemoExpiredEmail } from '@/lib/email'
import { query } from '@/lib/db'

/**
 * =============================================================================
 * DEMO SESSION STATUS API
 * =============================================================================
 *
 * GET /api/demo/session?email=...
 * Returns: { active, email, expiresAt, daysRemaining, expired, expiry_email_sent }
 *
 * When an expired session is detected, automatically sends the expiry
 * notification email (one-time) and marks the user as notified.
 *
 * =============================================================================
 */

export async function GET(request: NextRequest) {
    try {
        const email = request.nextUrl.searchParams.get('email')

        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter is required' },
                { status: 400 }
            )
        }

        const status = await getSessionStatus(email)

        // If expired, auto-send expiry email (one-time)
        if (status.expired && status.email) {
            try {
                // Check if already notified (is_active = FALSE means already processed)
                const rows = await query<{ is_active: boolean }>(
                    'SELECT is_active FROM demo_users WHERE email = $1',
                    [email]
                )

                if (rows.length > 0 && rows[0].is_active) {
                    // First time detecting expiry — send email and mark inactive
                    await sendDemoExpiredEmail(email)
                    await query(
                        'UPDATE demo_users SET is_active = FALSE WHERE email = $1',
                        [email]
                    )
                    console.log('Demo expiry email sent to:', email)
                    return NextResponse.json({ ...status, expiry_email_sent: true })
                }
            } catch (emailErr) {
                console.error('Failed to send demo expiry email:', emailErr)
            }
        }

        return NextResponse.json(status)
    } catch (error) {
        console.error('Session check error:', error)
        return NextResponse.json(
            { error: 'Failed to check session status' },
            { status: 500 }
        )
    }
}
