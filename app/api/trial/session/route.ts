import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { sendTrialExpiredEmail } from '@/lib/email'
import { nowIST } from '@/lib/timezone'

/**
 * =============================================================================
 * TRIAL SESSION STATUS API
 * =============================================================================
 *
 * GET /api/trial/session?email=...
 * Returns: { active, email, expiresAt, daysRemaining, expired, expiry_email_sent }
 *
 * When an expired trial is detected, automatically sends the expiry
 * notification email (one-time) and marks the user as notified.
 *
 * =============================================================================
 */

interface TrialUser {
    id: number
    email: string
    name: string
    role: string
    created_at: string
    expires_at: string
    expiry_notified: boolean
}

export async function GET(request: NextRequest) {
    try {
        const email = request.nextUrl.searchParams.get('email')

        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter is required' },
                { status: 400 }
            )
        }

        // Ensure expiry_notified column exists
        await query(
            'ALTER TABLE trial_users ADD COLUMN IF NOT EXISTS expiry_notified BOOLEAN DEFAULT FALSE'
        )

        const rows = await query<TrialUser>(
            'SELECT * FROM trial_users WHERE email = $1',
            [email]
        )

        if (rows.length === 0) {
            return NextResponse.json({
                active: false,
                email,
                expiresAt: '',
                daysRemaining: 0,
                expired: true,
            })
        }

        const user = rows[0]
        const now = nowIST()
        const expiresAt = new Date(user.expires_at)
        const expired = now > expiresAt
        const daysRemaining = expired
            ? 0
            : Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        // If expired and not yet notified, auto-send expiry email
        let expiry_email_sent = false
        if (expired && !user.expiry_notified) {
            try {
                await sendTrialExpiredEmail(email, user.name)
                await query(
                    'UPDATE trial_users SET expiry_notified = TRUE WHERE email = $1',
                    [email]
                )
                expiry_email_sent = true
                console.log('Trial expiry email sent to:', email)
            } catch (emailErr) {
                console.error('Failed to send trial expiry email:', emailErr)
            }
        }

        return NextResponse.json({
            active: !expired,
            email: user.email,
            expiresAt: expiresAt.toISOString(),
            daysRemaining,
            expired,
            expiry_email_sent,
        })
    } catch (error) {
        console.error('Trial session check error:', error)
        return NextResponse.json(
            { error: 'Failed to check trial session' },
            { status: 500 }
        )
    }
}
