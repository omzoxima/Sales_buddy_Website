import { cookies } from 'next/headers'
import { query } from './db'

/**
 * =============================================================================
 * DEMO SESSION UTILITIES
 * =============================================================================
 *
 * Manages demo user sessions via cookies + PostgreSQL.
 *
 * Cookie: demo_session = email (HttpOnly, 7 days max-age)
 *
 * =============================================================================
 */

const COOKIE_NAME = 'demo_session'
const DEMO_DURATION_DAYS = 7

interface DemoUser {
    id: number
    email: string
    created_at: Date
    expires_at: Date
    is_active: boolean
}

interface SessionStatus {
    active: boolean
    email: string
    expiresAt: string
    daysRemaining: number
    expired: boolean
}

/**
 * Get the demo email from the session cookie
 */
export function getDemoEmail(): string | null {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get(COOKIE_NAME)
    return sessionCookie?.value || null
}

/**
 * Set the demo session cookie
 */
export function setDemoSessionCookie(email: string): void {
    const cookieStore = cookies()
    cookieStore.set(COOKIE_NAME, email, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: DEMO_DURATION_DAYS * 24 * 60 * 60, // 7 days in seconds
        path: '/',
    })
}

/**
 * Clear the demo session cookie
 */
export function clearDemoSessionCookie(): void {
    const cookieStore = cookies()
    cookieStore.delete(COOKIE_NAME)
}

/**
 * Create or update a demo user in the database
 */
export async function createDemoUser(email: string): Promise<DemoUser> {
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + DEMO_DURATION_DAYS)

    // Upsert: if user already exists, update expires_at
    const rows = await query<DemoUser>(
        `INSERT INTO demo_users (email, expires_at, is_active)
     VALUES ($1, $2, TRUE)
     ON CONFLICT (email) DO UPDATE SET
       expires_at = GREATEST(demo_users.expires_at, $2),
       is_active = TRUE
     RETURNING *`,
        [email, expiresAt.toISOString()]
    )

    return rows[0]
}

/**
 * Get the session status for a given email
 */
export async function getSessionStatus(email: string): Promise<SessionStatus> {
    const rows = await query<DemoUser>(
        'SELECT * FROM demo_users WHERE email = $1',
        [email]
    )

    if (rows.length === 0) {
        return {
            active: false,
            email,
            expiresAt: '',
            daysRemaining: 0,
            expired: true,
        }
    }

    const user = rows[0]
    const now = new Date()
    const expiresAt = new Date(user.expires_at)
    const expired = now > expiresAt || !user.is_active
    const daysRemaining = expired
        ? 0
        : Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    return {
        active: !expired,
        email: user.email,
        expiresAt: expiresAt.toISOString(),
        daysRemaining,
        expired,
    }
}
