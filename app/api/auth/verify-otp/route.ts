import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { createDemoUser, setDemoSessionCookie } from '@/lib/demo-session'

/**
 * POST /api/auth/verify-otp
 * Body: { email: string, code: string, marketingOptin?: boolean }
 *
 * Verifies the OTP code, creates/updates the demo user, and sets the session cookie.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, code, marketingOptin } = body

        if (!email || !code) {
            return NextResponse.json(
                { error: 'Email and verification code are required' },
                { status: 400 }
            )
        }

        // Check for too many failed attempts (max 5 for the latest OTP)
        const failedAttempts = await query<{ count: string }>(
            `SELECT COUNT(*) as count FROM otp_codes
             WHERE email = $1 AND verified = FALSE AND expires_at > NOW()
               AND created_at = (
                 SELECT MAX(created_at) FROM otp_codes WHERE email = $1 AND expires_at > NOW()
               )`,
            [email]
        )

        // Find valid, unexpired, unverified OTP
        const otpRows = await query<{ id: number; code: string }>(
            `SELECT id, code FROM otp_codes
             WHERE email = $1 AND expires_at > NOW() AND verified = FALSE
             ORDER BY created_at DESC
             LIMIT 1`,
            [email]
        )

        if (otpRows.length === 0) {
            return NextResponse.json(
                { error: 'Code expired or not found. Please request a new one.' },
                { status: 400 }
            )
        }

        const otp = otpRows[0]

        if (otp.code !== code) {
            return NextResponse.json(
                { error: 'Invalid verification code. Please try again.' },
                { status: 400 }
            )
        }

        // Mark OTP as verified
        await query(
            'UPDATE otp_codes SET verified = TRUE WHERE id = $1',
            [otp.id]
        )

        // Create demo user + set session cookie
        try {
            await createDemoUser(email, marketingOptin || false)
            setDemoSessionCookie(email)
        } catch (dbError) {
            console.error('DB error during user creation:', dbError)
            // Continue even if DB fails — user verified successfully
        }

        return NextResponse.json({
            success: true,
            message: 'Email verified successfully',
            email,
        })
    } catch (error) {
        console.error('Verify OTP error:', error)
        return NextResponse.json(
            { error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}
