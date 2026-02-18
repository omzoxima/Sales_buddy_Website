import { NextRequest } from 'next/server'

/**
 * =============================================================================
 * DEMO AGENT CHAT API ROUTE (STREAMING)
 * =============================================================================
 * 
 * Proxies messages to the AI Agent endpoint and streams the response
 * back to the client in real-time.
 * 
 * Agent endpoint: POST /message
 * Request:  { "user_query": "..." }
 * Response: Streamed JSON chunks like { "chunk": "text..." }
 *           Final chunk: { "status": "success", "response": "full text", "data_retrieved": [] }
 * 
 * Environment variables (optional override):
 *   - AGENT_API_URL (defaults to ngrok URL)
 * 
 * =============================================================================
 */

const DEFAULT_AGENT_URL = 'https://51c8-103-7-81-242.ngrok-free.app/message'

interface AgentChatRequest {
    message: string
    email: string
}

export async function POST(request: NextRequest) {
    try {
        const body: AgentChatRequest = await request.json()
        const { message, email } = body

        if (!message || !email) {
            return new Response(
                JSON.stringify({ error: 'Message and email are required' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            )
        }

        const agentUrl: string = process.env.AGENT_API_URL ?? DEFAULT_AGENT_URL
        console.log('Agent URL being used:', agentUrl)

        // Call the real agent endpoint
        const agentResponse = await fetch(agentUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_query: message }),
        })

        if (!agentResponse.ok || !agentResponse.body) {
            console.log('Agent API error:', agentResponse.status, agentUrl)
            return new Response(
                JSON.stringify({ error: 'Agent is currently unavailable' }),
                { status: 502, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Stream the response back to the client
        const reader = agentResponse.body.getReader()
        const decoder = new TextDecoder()

        const stream = new ReadableStream({
            async start(controller) {
                try {
                    while (true) {
                        const { done, value } = await reader.read()
                        if (done) break

                        const text = decoder.decode(value, { stream: true })

                        // The agent sends multiple JSON objects concatenated.
                        // Parse each one and forward chunks to the client.
                        // Each JSON object looks like: {"chunk":"text"} or {"status":"success","response":"..."}
                        const lines = text.split('\n').filter((line) => line.trim())

                        for (const line of lines) {
                            try {
                                const parsed = JSON.parse(line)
                                if (parsed.chunk) {
                                    // Send the chunk as a Server-Sent Event
                                    controller.enqueue(
                                        new TextEncoder().encode(`data: ${JSON.stringify({ chunk: parsed.chunk })}\n\n`)
                                    )
                                } else if (parsed.status === 'success') {
                                    // Final message - send done event
                                    controller.enqueue(
                                        new TextEncoder().encode(`data: ${JSON.stringify({ done: true, response: parsed.response })}\n\n`)
                                    )
                                }
                            } catch {
                                // If a line isn't valid JSON, it might be a partial chunk.
                                // Try to extract JSON objects from it.
                                const jsonMatches = line.match(/\{[^}]+\}/g)
                                if (jsonMatches) {
                                    for (const match of jsonMatches) {
                                        try {
                                            const parsed = JSON.parse(match)
                                            if (parsed.chunk) {
                                                controller.enqueue(
                                                    new TextEncoder().encode(`data: ${JSON.stringify({ chunk: parsed.chunk })}\n\n`)
                                                )
                                            } else if (parsed.status === 'success') {
                                                controller.enqueue(
                                                    new TextEncoder().encode(`data: ${JSON.stringify({ done: true, response: parsed.response })}\n\n`)
                                                )
                                            }
                                        } catch {
                                            // Skip unparseable fragments
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.error('Stream reading error:', error)
                } finally {
                    controller.close()
                }
            },
        })

        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                Connection: 'keep-alive',
            },
        })
    } catch (error) {
        console.error('Agent chat error:', error)
        return new Response(
            JSON.stringify({ error: 'Something went wrong. Please try again.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
    }
}
