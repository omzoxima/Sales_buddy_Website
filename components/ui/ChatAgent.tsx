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

    const sendMessage = async () => {
        const trimmed = input.trim()
        if (!trimmed || isLoading) return

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
                body: JSON.stringify({ message: trimmed }),
            })

            const data = await res.json()

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
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 left-6 z-40 flex items-center gap-2.5 pl-4 pr-5 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-semibold rounded-full shadow-lg shadow-violet-500/30 hover:shadow-xl hover:shadow-violet-500/40 transition-all duration-300 active:scale-95 group"
                    title="Ask SalesBuddy AI"
                >
                    {/* Pulsing ring */}
                    <span className="absolute inset-0 rounded-full bg-violet-400/30" style={{ animation: 'chatAgentPing 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                    <Bot className="w-5 h-5 relative group-hover:rotate-6 transition-transform" />
                    <span className="text-sm relative">Ask AI</span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className="fixed bottom-6 left-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
                    style={{
                        height: 'min(520px, calc(100vh - 6rem))',
                        animation: 'chatAgentSlideUp 0.3s ease-out',
                    }}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-5 py-4 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">SalesBuddy AI</h3>
                                <p className="text-white/70 text-xs">Ask me anything about our product</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-white/70 hover:text-white transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollBehavior: 'smooth' }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md'
                                            : 'bg-slate-100 text-slate-800 rounded-bl-md'
                                        }`}
                                >
                                    <span className="whitespace-pre-wrap">{msg.content}</span>
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

                    {/* Input */}
                    <div className="border-t border-slate-100 px-4 py-3 flex-shrink-0">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask about features, pricing, etc..."
                                disabled={isLoading}
                                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 disabled:opacity-50 transition-all"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl transition-all active:scale-95 shadow-sm"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
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
