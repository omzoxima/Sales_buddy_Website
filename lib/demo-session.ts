import { cookies } from 'next/headers'
import { query } from './db'
import { nowIST } from './timezone'

/**
 * =============================================================================
 * DEMO SESSION UTILITIES
 * =============================================================================
 *
 * Manages demo user sessions via user_email cookie (server-side) + PostgreSQL.
 * Client-side uses localStorage for identification.
 *
 * Cookie: user_email = email (server-side set for httpOnly access)
 *
 * =============================================================================
 */

const COOKIE_NAME = 'user_email'
const DEMO_DURATION_HOURS = 7 * 24  // 7 days

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
        maxAge: Math.round(DEMO_DURATION_HOURS * 60 * 60), // 5 minutes in seconds
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
export async function createDemoUser(email: string, marketingOptin: boolean = false): Promise<DemoUser> {
    // Check if user has already upgraded to trial
    const trialRows = await query<{ email: string }>(
        'SELECT email FROM trial_users WHERE email = $1',
        [email]
    )
    if (trialRows.length > 0) {
        throw new Error('You have already taken a trial and cannot start a new demo.');
    }

    const expiresAt = nowIST()
    expiresAt.setHours(expiresAt.getHours() + DEMO_DURATION_HOURS)

    // Check if demo already exists
    const existingDemo = await query<DemoUser>(
        'SELECT * FROM demo_users WHERE email = $1',
        [email]
    )

    if (existingDemo.length > 0) {
        const demo = existingDemo[0];
        const now = nowIST();
        const demoExpires = new Date(demo.expires_at);
        if (now > demoExpires || !demo.is_active) {
            throw new Error('Your demo expired. You cannot get any benefits of this. You can upgrade your plan.');
        }
        // Still active — let user continue from where they left off
        return demo;
    }

    // Creating new demo
    const rows = await query<DemoUser>(
        `INSERT INTO demo_users (email, expires_at, is_active, marketing_optin)
     VALUES ($1, $2, TRUE, $3)
     RETURNING *`,
        [email, expiresAt.toISOString(), marketingOptin]
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
    const now = nowIST()
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
