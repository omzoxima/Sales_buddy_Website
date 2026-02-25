'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Sparkles } from 'lucide-react'

interface ChatMessage {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export function ChatAgent() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hi! 👋 I\'m SalesBuddy AI. Ask me anything about our product, features, or pricing!',
        },
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [sessionExpired, setSessionExpired] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [isOpen])

    // Create a chat session when chat opens (no login required)
    useEffect(() => {
        if (!isOpen || sessionId) return

        const createSession = async () => {
            try {
                const res = await fetch('/api/chat-session', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                })

                const data = await res.json()

                if (data.sessionId) {
                    setSessionId(data.sessionId)
                    console.log('🆔 Chat Session ID:', data.sessionId)
                    console.log('⏰ Session Expires At:', data.expiresAt)
                }
            } catch (err) {
                console.error('Failed to create chat session:', err)
            }
        }

        createSession()
    }, [isOpen, sessionId])

    const sendMessage = async () => {
        const trimmed = input.trim()
        if (!trimmed || isLoading) return

        if (sessionExpired) return

        const userMsg: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: trimmed,
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/chat-agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: trimmed,
                    sessionId: sessionId || undefined,
                }),
            })

            const data = await res.json()

            // Check if session expired server-side
            if (data.expired) {
                setSessionExpired(true)
                setMessages(prev => [
                    ...prev,
                    {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: '⏰ Your session has expired. Please start a new demo to continue chatting.',
                    },
                ])
                return
            }

            const assistantMsg: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.reply || data.error || 'Sorry, I couldn\'t process that. Please try again.',
            }

            setMessages(prev => [...prev, assistantMsg])
        } catch {
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Sorry, I\'m having trouble connecting. Please try again in a moment.',
                },
            ])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <>
            {/* Floating Chat Button — icon only on mobile, text on desktop */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-40 flex items-center justify-center w-12 h-12 md:w-auto md:h-auto md:gap-2.5 md:pl-4 md:pr-5 md:py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 active:scale-95 group"
                    title="Ask SalesBuddy AI"
                >
                    {/* Pulsing ring */}
                    <span className="absolute inset-0 rounded-full bg-violet-400/30" style={{ animation: 'chatAgentPing 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                    <Bot className="w-5 h-5 relative group-hover:rotate-6 transition-transform" />
                    <span className="hidden md:inline text-sm relative">Ask AI</span>
                </button>
            )}

            {/* Chat Window — full-screen on mobile, floating card on desktop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-white flex flex-col md:inset-auto md:bottom-6 md:left-6 md:w-[380px] md:max-w-[calc(100vw-3rem)] md:h-[520px] md:max-h-[calc(100vh-6rem)] md:rounded-2xl md:shadow-2xl md:border md:border-slate-200 overflow-hidden"
                    style={{
                        animation: 'chatAgentSlideUp 0.3s ease-out',
                    }}
                >

                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 md:px-5 md:py-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-2.5 md:gap-3">
                            <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">SalesBuddy AI</h3>
                                <p className="text-white/70 text-[11px] md:text-xs">
                                    {sessionExpired ? 'Session expired' : 'Ask me anything about our product'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Session ID Bar */}
                    {sessionId && (
                        <div className="bg-slate-50 border-b border-slate-200 px-3 md:px-4 py-1 md:py-1.5 flex items-center">
                            <span className="text-[10px] text-slate-400 font-mono truncate">
                                Session: {sessionId.slice(0, 8)}…
                            </span>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-3 py-3 md:px-4 md:py-4 space-y-3" style={{ scrollBehavior: 'smooth' }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[88%] md:max-w-[85%] px-3 py-2 md:px-4 md:py-2.5 rounded-2xl text-[13px] md:text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md'
                                        : 'bg-slate-100 text-slate-800 rounded-bl-md'
                                        }`}
                                >
                                    <span className="whitespace-pre-wrap break-words">{msg.content}</span>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full" style={{ animation: 'chatDot 1.4s infinite ease-in-out', animationDelay: '0s' }} />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full" style={{ animation: 'chatDot 1.4s infinite ease-in-out', animationDelay: '0.2s' }} />
                                    <span className="w-2 h-2 bg-slate-400 rounded-full" style={{ animation: 'chatDot 1.4s infinite ease-in-out', animationDelay: '0.4s' }} />
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input — safe-area padding for notched phones */}
                    <div className="border-t border-slate-100 px-3 py-2 md:px-4 md:py-3 flex-shrink-0" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
                        {sessionExpired ? (
                            <div className="text-center py-2">
                                <p className="text-sm text-red-500 font-medium">⏰ Session Expired</p>
                                <p className="text-xs text-slate-400 mt-1">Start a new demo to continue chatting.</p>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about features, pricing..."
                                    disabled={isLoading}
                                    className="flex-1 min-w-0 px-3 py-2.5 md:px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 disabled:opacity-50 transition-all"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!input.trim() || isLoading}
                                    className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all active:scale-95 shadow-sm"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes chatAgentPing {
                    0% { transform: scale(1); opacity: 0.4; }
                    75%, 100% { transform: scale(1.5); opacity: 0; }
                }
                @keyframes chatAgentSlideUp {
                    from { opacity: 0; transform: translateY(16px) scale(0.96); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes chatDot {
                    0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
                    40% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </>
    )
}
