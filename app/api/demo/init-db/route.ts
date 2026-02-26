import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

/**
 * Initialize the database tables.
 * Call this once: GET /api/demo/init-db
 */
export async function GET(request: NextRequest) {
    try {
        // Create demo_users table
        await query(`
            CREATE TABLE IF NOT EXISTS demo_users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255),
                company VARCHAR(255),
                registered_at TIMESTAMPTZ DEFAULT NOW(),
                expires_at TIMESTAMPTZ
            )
        `)

        // Create trial_users table
        await query(`
            CREATE TABLE IF NOT EXISTS trial_users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                name VARCHAR(255),
                company VARCHAR(255),
                registered_at TIMESTAMPTZ DEFAULT NOW(),
                expires_at TIMESTAMPTZ
            )
        `)

        // Create chat_messages table
        await query(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                role VARCHAR(20) NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMPTZ DEFAULT NOW()
            )
        `)

        return NextResponse.json({ success: true, message: 'Database tables created successfully' })
    } catch (error) {
        console.error('DB init error:', error)
        return NextResponse.json(
            { error: 'Failed to initialize database', details: String(error) },
            { status: 500 }
        )
    }
}
