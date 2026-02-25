import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

/**
 * =============================================================================
 * CHAT AGENT PROXY API
 * =============================================================================
 *
 * POST /api/chat-agent
 * Body: { message: string, sessionId?: string }
 *
 * Proxies user messages to the SalesBuddy agent backend
 * at SALESBUDDY_AGENT_URL (default: http://localhost:8000/salesbuddymessage)
 *
 * If sessionId is provided:
 *   - Validates the session (checks expiry)
 *   - Saves user message and assistant reply to chat_messages with session_id
 *   - Returns { expired: true } if session is expired
 *
 * =============================================================================
 */

const AGENT_URL = process.env.SALESBUDDY_AGENT_URL

interface ChatSession {
    session_id: string
    user_email: string
    expires_at: string
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { message, sessionId } = body

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        // Validate session if provided
        let sessionEmail: string | null = null
        if (sessionId) {
            try {
                const sessionRows = await query<ChatSession>(
                    'SELECT session_id, user_email, expires_at FROM chat_sessions WHERE session_id = $1',
                    [sessionId]
                )

                if (sessionRows.length === 0) {
                    return NextResponse.json(
                        { error: 'Invalid session', expired: true },
                        { status: 403 }
                    )
                }

                const session = sessionRows[0]
                const now = new Date()
                if (now > new Date(session.expires_at)) {
                    return NextResponse.json(
                        { error: 'Session expired', expired: true },
                        { status: 403 }
                    )
                }

                sessionEmail = session.user_email
            } catch (err) {
                console.error('Session validation error:', err)
                // Continue without session validation on DB error
            }
        }

        // Save user message to database
        if (sessionId) {
            try {
                await query(
                    `INSERT INTO chat_messages (user_email, role, content, session_id)
                     VALUES ($1, $2, $3, $4)`,
                    [sessionEmail || 'anonymous', 'user', message, sessionId]
                )
            } catch (err) {
                console.error('Failed to save user message:', err)
            }
        }

        // Fetch all previous user messages from this session (excluding current)
        let historyMessages: { user_query: string }[] = []
        if (sessionId) {
            try {
                const rows = await query<{ content: string }>(
                    `SELECT content FROM (
                        SELECT content, created_at FROM chat_messages
                        WHERE session_id = $1
                          AND role = 'user'
                        ORDER BY created_at DESC
                        OFFSET 1
                    ) sub ORDER BY created_at ASC`,
                    [sessionId]
                )
                historyMessages = rows.map(r => ({ user_query: r.content }))
            } catch (err) {
                console.error('Failed to fetch session chat history:', err)
            }
        }

        // Build data array: old messages first, current message last (same as demo agent)
        const dataArray = [...historyMessages, { user_query: message }]
        const agentBody = {
            session_id: sessionId || undefined,
            data: dataArray,
        }
        console.log('Chat Agent request body:', JSON.stringify(agentBody, null, 2))

        const response = await fetch(AGENT_URL as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agentBody),
        })

        if (!response.ok) {
            console.error('Agent backend error:', response.status, response.statusText)
            return NextResponse.json(
                { error: 'Agent is temporarily unavailable. Please try again.' },
                { status: 502 }
            )
        }

        // Read as text first to avoid JSON parse errors if the backend returns plain text or malformed JSON
        const rawText = await response.text()
        let reply = ''
        let assembledChunks = ''

        // The agent backend might return NDJSON (Newline Delimited JSON) during streaming
        const lines = rawText.split('\n').filter(line => line.trim())

        for (const line of lines) {
            try {
                const parsed = JSON.parse(line)

                // If it's the final message object containing the full response
                if (parsed.response) {
                    reply = parsed.response
                } else if (parsed.message) {
                    reply = parsed.message
                } else if (parsed.answer) {
                    reply = parsed.answer
                } else if (parsed.chunk) {
                    // Accumulate chunks in case there is no final full response object
                    assembledChunks += parsed.chunk
                }
            } catch (e) {
                // Ignore JS syntax issues for individual partial chunks
            }
        }

        // Use accumulated streaming chunks if we haven't found a finalized response string
        if (!reply && assembledChunks) {
            reply = assembledChunks
        }

        // Fallback for an entirely different single JSON structure
        if (!reply) {
            try {
                const data = JSON.parse(rawText)
                if (typeof data === 'string') {
                    reply = data
                } else if (data?.data) {
                    reply = typeof data.data === 'string' ? data.data : JSON.stringify(data.data)
                } else {
                    reply = JSON.stringify(data)
                }
            } catch (parseError) {
                // If nothing JSON-like parses correctly, dump the raw text
                reply = rawText
            }
        }

        // Save assistant reply to database
        if (sessionId && reply) {
            try {
                await query(
                    `INSERT INTO chat_messages (user_email, role, content, session_id)
                     VALUES ($1, $2, $3, $4)`,
                    [sessionEmail || 'anonymous', 'assistant', reply, sessionId]
                )
            } catch (err) {
                console.error('Failed to save assistant reply:', err)
            }
        }

        return NextResponse.json({ reply })
    } catch (error) {
        console.error('Chat agent proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to reach the agent. Please try again later.' },
            { status: 500 }
        )
    }
}
