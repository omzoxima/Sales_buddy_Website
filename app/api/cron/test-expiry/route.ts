import { NextRequest, NextResponse } from 'next/server'
import { sendDemoExpiredEmail, sendTrialExpiredEmail } from '@/lib/email'

/**
 * =============================================================================
 * TEST: SEND EXPIRY EMAIL (for testing purposes only)
 * =============================================================================
 *
 * POST /api/cron/test-expiry
 * Body: { email: string, type: "demo" | "trial", name?: string }
 *
 * Sends a test expiry email immediately without modifying the database.
 *
 * =============================================================================
 */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, type, name } = body

        if (!email || !type) {
            return NextResponse.json(
                { error: 'email and type ("demo" or "trial") are required' },
                { status: 400 }
            )
        }

        if (type !== 'demo' && type !== 'trial') {
            return NextResponse.json(
                { error: 'type must be "demo" or "trial"' },
                { status: 400 }
            )
        }

        let sent = false

        if (type === 'demo') {
            sent = await sendDemoExpiredEmail(email)
        } else {
            sent = await sendTrialExpiredEmail(email, name || 'User')
        }

        if (sent) {
            return NextResponse.json({
                success: true,
                message: `Test ${type} expiry email sent to ${email}`,
            })
        } else {
            return NextResponse.json(
                { error: 'Failed to send email. Check SMTP configuration.' },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('Test expiry email error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        )
    }
}
