import { NextRequest, NextResponse } from 'next/server'
import { getSessionStatus } from '@/lib/demo-session'

/**
 * =============================================================================
 * DEMO SESSION STATUS API
 * =============================================================================
 *
 * GET /api/demo/session?email=...
 * Returns: { active, email, expiresAt, daysRemaining, expired }
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
        return NextResponse.json(status)
    } catch (error) {
        console.error('Session check error:', error)
        return NextResponse.json(
            { error: 'Failed to check session status' },
            { status: 500 }
        )
    }
}
