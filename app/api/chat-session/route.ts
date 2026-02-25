import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

/**
 * =============================================================================
 * CHAT SESSION API (No login required)
 * =============================================================================
 *
 * POST /api/chat-session   → Create a new anonymous chat session
 *   Body: {} (no email needed)
 *   Returns: { sessionId, expiresAt }
 *
 * GET  /api/chat-session?sessionId=...  → Validate a session
 *   Returns: { valid, expired, sessionId }
 *
 * =============================================================================
 */

const SESSION_DURATION_HOURS = 24 // anonymous sessions last 24 hours

interface ChatSession {
    session_id: string
    user_email: string
    expires_at: string
}

export async function POST() {
    try {
        // Create a new anonymous chat session with 24h expiry
        const expires = new Date()
        expires.setHours(expires.getHours() + SESSION_DURATION_HOURS)
        const expiresAt = expires.toISOString()

        const rows = await query<{ session_id: string; expires_at: string }>(
            `INSERT INTO chat_sessions (user_email, expires_at)
             VALUES ($1, $2)
             RETURNING session_id, expires_at`,
            ['anonymous', expiresAt]
        )

        const session = rows[0]
        console.log(`✅ New chat session created: ${session.session_id} (anonymous)`)

        return NextResponse.json({
            sessionId: session.session_id,
            expiresAt: session.expires_at,
        })
    } catch (error) {
        console.error('Chat session creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create chat session' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const sessionId = request.nextUrl.searchParams.get('sessionId')

        if (!sessionId) {
            return NextResponse.json(
                { error: 'sessionId parameter is required' },
                { status: 400 }
            )
        }

        const rows = await query<ChatSession>(
            'SELECT session_id, user_email, expires_at FROM chat_sessions WHERE session_id = $1',
            [sessionId]
        )

        if (rows.length === 0) {
            return NextResponse.json({ valid: false, expired: true, sessionId })
        }

        const session = rows[0]
        const now = new Date()
        const expired = now > new Date(session.expires_at)

        return NextResponse.json({
            valid: !expired,
            expired,
            sessionId: session.session_id,
            expiresAt: session.expires_at,
        })
    } catch (error) {
        console.error('Chat session validation error:', error)
        return NextResponse.json(
            { error: 'Failed to validate session' },
            { status: 500 }
        )
    }
}
