import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { sendOtpEmail } from '@/lib/email'

/**
 * POST /api/auth/send-otp
 * Body: { email: string }
 *
 * Generates a 6-digit OTP, stores it in the database, and emails it.
 * Rate limited to 3 OTPs per email per hour.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email } = body

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'A valid email is required' },
                { status: 400 }
            )
        }

        // Rate limit: max 3 OTPs per email in the last hour
        const recentOtps = await query<{ count: string }>(
            `SELECT COUNT(*) as count FROM otp_codes
             WHERE email = $1 AND created_at > NOW() - INTERVAL '1 hour'`,
            [email]
        )

        if (parseInt(recentOtps[0]?.count || '0') >= 3) {
            return NextResponse.json(
                { error: 'Too many OTP requests. Please try again later.' },
                { status: 429 }
            )
        }

        // Generate 6-digit OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString()

        // Store OTP with 10-minute expiry
        await query(
            `INSERT INTO otp_codes (email, code, expires_at)
             VALUES ($1, $2, NOW() + INTERVAL '10 minutes')`,
            [email, code]
        )

        // Send OTP via email
        const sent = await sendOtpEmail(email, code)

        if (!sent) {
            return NextResponse.json(
                { error: 'Failed to send verification email. Please try again.' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Verification code sent to your email',
        })
    } catch (error) {
        console.error('Send OTP error:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}
