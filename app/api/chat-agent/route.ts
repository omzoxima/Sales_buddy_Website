import { NextRequest, NextResponse } from 'next/server'

/**
 * =============================================================================
 * CHAT AGENT PROXY API
 * =============================================================================
 *
 * POST /api/chat-agent
 * Body: { message: string }
 *
 * Proxies user messages to the SalesBuddy agent backend
 * at SALESBUDDY_AGENT_URL (default: http://localhost:8000/salesbuddymessage)
 *
 * =============================================================================
 */

const AGENT_URL = process.env.SALESBUDDY_AGENT_URL

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { message } = body

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        const response = await fetch(AGENT_URL as string, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                data: [{ user_query: message }],
            }),
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

        return NextResponse.json({ reply })
    } catch (error) {
        console.error('Chat agent proxy error:', error)
        return NextResponse.json(
            { error: 'Failed to reach the agent. Please try again later.' },
            { status: 500 }
        )
    }
}
