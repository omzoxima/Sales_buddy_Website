import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

/**
 * POST /api/demo/feedback
 * Body: { email: string, rating: number (1-5), comment?: string }
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, rating, comment } = body

        if (!email || !rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Valid email and rating (1-5) are required' },
                { status: 400 }
            )
        }

        await query(
            `INSERT INTO feedback (user_email, rating, comment)
             VALUES ($1, $2, $3)`,
            [email, rating, comment || null]
        )

        return NextResponse.json({ success: true, message: 'Feedback submitted successfully' })
    } catch (error) {
        console.error('Feedback save error:', error)
        return NextResponse.json(
            { error: 'Failed to save feedback' },
            { status: 500 }
        )
    }
}
