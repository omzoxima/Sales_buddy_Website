import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'
import { nowIST } from '@/lib/timezone'

/**
 * =============================================================================
 * USER DASHBOARD API
 * =============================================================================
 *
 * GET /api/user/dashboard?email=...
 *
 * Returns aggregated demo + trial status for the dashboard page.
 *
 * =============================================================================
 */

interface DemoRow {
    email: string
    created_at: string
    expires_at: string
    is_active: boolean
}

interface TrialRow {
    email: string
    name: string
    role: string
    created_at: string
    expires_at: string
    expiry_notified: boolean
}

interface TrialCredentialsRow {
    team_link: string
}

function formatTimeRemaining(expiresAt: Date, now: Date): string {
    const diff = expiresAt.getTime() - now.getTime()
    if (diff <= 0) return 'Expired'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
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

        const now = nowIST()

        // Fetch demo status
        const demoRows = await query<DemoRow>(
            'SELECT email, created_at, expires_at, is_active FROM demo_users WHERE email = $1',
            [email]
        )

        // Fetch trial status
        let trialRows: TrialRow[] = []
        try {
            trialRows = await query<TrialRow>(
                'SELECT email, name, role, created_at, expires_at, expiry_notified FROM trial_users WHERE email = $1',
                [email]
            )
        } catch {
            // trial_users table might not have expiry_notified column yet
        }

        // Build demo status
        let demo = null
        if (demoRows.length > 0) {
            const d = demoRows[0]
            const expiresAt = new Date(d.expires_at)
            const expired = now > expiresAt || !d.is_active
            demo = {
                active: !expired,
                expired,
                email: d.email,
                createdAt: d.created_at,
                expiresAt: d.expires_at,
                timeRemaining: expired ? 'Expired' : formatTimeRemaining(expiresAt, now),
            }
        }

        // Build trial status
        let trial = null
        if (trialRows.length > 0) {
            const t = trialRows[0]
            const expiresAt = new Date(t.expires_at)
            const expired = now > expiresAt

            let teamLink = null
            try {
                const creds = await query<TrialCredentialsRow>(
                    'SELECT team_link FROM trial_credentials WHERE role = $1',
                    [t.role]
                )
                if (creds.length > 0) {
                    teamLink = creds[0].team_link
                }
            } catch {
                console.error('Failed to fetch team link for role:', t.role)
            }

            trial = {
                active: !expired,
                expired,
                registered: true,
                email: t.email,
                name: t.name,
                role: t.role,
                createdAt: t.created_at,
                expiresAt: t.expires_at,
                timeRemaining: expired ? 'Expired' : formatTimeRemaining(expiresAt, now),
                teamLink
            }

            // User is in trial phase, invalidate demo benefits
            if (demo) {
                demo.active = false;
                demo.expired = true;
                demo.timeRemaining = 'Expired';
            }
        }

        // Determine current plan and upgrade options
        let currentPlan = 'none'
        const upgradeOptions: string[] = []

        if (trial?.active) {
            currentPlan = 'trial'
            upgradeOptions.push('pilot')
        } else if (trial?.expired) {
            currentPlan = 'trial_expired'
            upgradeOptions.push('pilot')
        } else if (demo?.active) {
            currentPlan = 'demo'
            upgradeOptions.push('trial', 'pilot')
        } else if (demo?.expired) {
            currentPlan = 'demo_expired'
            upgradeOptions.push('trial', 'pilot')
        } else {
            currentPlan = 'none'
            upgradeOptions.push('demo', 'trial', 'pilot')
        }

        return NextResponse.json({
            demo,
            trial,
            currentPlan,
            upgradeOptions,
        })
    } catch (error) {
        console.error('Dashboard API error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        )
    }
}
