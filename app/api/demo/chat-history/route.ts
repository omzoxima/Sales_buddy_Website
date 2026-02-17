import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

/**
 * =============================================================================
 * CHAT HISTORY API
 * =============================================================================
 *
 * GET  /api/demo/chat-history?email=...  → Fetch all messages for this email
 * POST /api/demo/chat-history            → Save a message
 *
 * Messages are returned ordered by created_at, with a date label to group
 * messages by day (like ChatGPT: "Today", "Yesterday", "Feb 14", etc.)
 *
 * =============================================================================
 */

interface ChatMessage {
    id: number
    user_email: string
    role: string
    content: string
    created_at: string
}

function getDateLabel(dateStr: string): string {
    const date = new Date(dateStr)
    const now = new Date()

    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

    if (messageDate.getTime() === today.getTime()) return 'Today'
    if (messageDate.getTime() === yesterday.getTime()) return 'Yesterday'

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

        const messages = await query<ChatMessage>(
            `SELECT id, user_email, role, content, created_at
       FROM chat_messages
       WHERE user_email = $1
       ORDER BY created_at ASC`,
            [email]
        )

        // Add date labels for grouping
        const messagesWithDates = messages.map((msg) => ({
            id: msg.id.toString(),
            role: msg.role,
            content: msg.content,
            timestamp: msg.created_at,
            dateLabel: getDateLabel(msg.created_at),
        }))

        return NextResponse.json({ success: true, messages: messagesWithDates })
    } catch (error) {
        console.error('Chat history fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch chat history' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, role, content } = body

        if (!email || !role || !content) {
            return NextResponse.json(
                { error: 'email, role, and content are required' },
                { status: 400 }
            )
        }

        const rows = await query(
            `INSERT INTO chat_messages (user_email, role, content)
       VALUES ($1, $2, $3)
       RETURNING id, created_at`,
            [email, role, content]
        )

        return NextResponse.json({ success: true, id: rows[0] })
    } catch (error) {
        console.error('Chat history save error:', error)
        return NextResponse.json(
            { error: 'Failed to save message' },
            { status: 500 }
        )
    }
}
