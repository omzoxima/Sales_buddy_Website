import { NextRequest, NextResponse } from 'next/server'
import { initDatabase } from '@/lib/db'

/**
 * Initialize the database tables.
 * Call this once: GET /api/demo/init-db
 */
export async function GET(request: NextRequest) {
    try {
        await initDatabase()
        return NextResponse.json({ success: true, message: 'Database tables created successfully' })
    } catch (error) {
        console.error('DB init error:', error)
        return NextResponse.json(
            { error: 'Failed to initialize database', details: String(error) },
            { status: 500 }
        )
    }
}
