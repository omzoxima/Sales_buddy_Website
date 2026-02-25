import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { sendDemoExpiredEmail, sendTrialExpiredEmail } from '@/lib/email'
import { nowIST } from '@/lib/timezone'

/**
 * =============================================================================
 * CRON: CHECK EXPIRED DEMO & TRIAL USERS
 * =============================================================================
 *
 * GET /api/cron/check-expiry?secret=<CRON_SECRET>
 *
 * Finds expired demo/trial users who haven't been notified yet,
 * sends them expiry emails, and marks them as notified.
 *
 * =============================================================================
 */

const CRON_SECRET = process.env.CRON_SECRET || 'default-dev-secret'

export async function GET(request: NextRequest) {
    // Verify secret
    const secret = request.nextUrl.searchParams.get('secret')
    if (secret !== CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = {
        demo: { found: 0, emailed: 0, errors: 0 },
        trial: { found: 0, emailed: 0, errors: 0 },
    }

    try {
        // =========================================================================
        // 1. EXPIRED DEMO USERS (is_active = TRUE but expires_at < NOW)
        // =========================================================================
        const expiredDemoUsers = await query<{ email: string }>(
            `SELECT email FROM demo_users
       WHERE is_active = TRUE AND expires_at < NOW()`
        )

        results.demo.found = expiredDemoUsers.length

        for (const user of expiredDemoUsers) {
            const sent = await sendDemoExpiredEmail(user.email)
            if (sent) {
                // Mark as inactive so we don't email again
                await query(
                    `UPDATE demo_users SET is_active = FALSE WHERE email = $1`,
                    [user.email]
                )
                results.demo.emailed++
            } else {
                results.demo.errors++
            }
        }

        // =========================================================================
        // 2. EXPIRED TRIAL USERS (expires_at < NOW and not yet notified)
        // =========================================================================
        // First, ensure the expiry_notified column exists
        await query(
            `ALTER TABLE trial_users ADD COLUMN IF NOT EXISTS expiry_notified BOOLEAN DEFAULT FALSE`
        )

        const expiredTrialUsers = await query<{ email: string; name: string }>(
            `SELECT email, name FROM trial_users
       WHERE expires_at < NOW() AND (expiry_notified IS NULL OR expiry_notified = FALSE)`
        )

        results.trial.found = expiredTrialUsers.length

        for (const user of expiredTrialUsers) {
            const sent = await sendTrialExpiredEmail(user.email, user.name)
            if (sent) {
                await query(
                    `UPDATE trial_users SET expiry_notified = TRUE WHERE email = $1`,
                    [user.email]
                )
                results.trial.emailed++
            } else {
                results.trial.errors++
            }
        }

        console.log('Expiry check complete:', results)

        return NextResponse.json({
            success: true,
            timestamp: nowIST().toISOString(),
            results,
        })
    } catch (error) {
        console.error('Expiry check error:', error)
        return NextResponse.json(
            { error: 'Internal server error', details: String(error) },
            { status: 500 }
        )
    }
}
