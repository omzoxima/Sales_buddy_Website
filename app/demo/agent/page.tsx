'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Send, Bot, User, ArrowLeft, Sparkles, MessageSquare, ShieldAlert, Clock, BookOpen, Users } from 'lucide-react'
import { GuidedTour } from '@/components/demo/GuidedTour'

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    dateLabel?: string
}

interface SessionStatus {
    active: boolean
    email: string
    expiresAt: string
    daysRemaining: number
    expired: boolean
}

export default function AgentDemoPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const email = searchParams.get('email') || ''
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [isStreaming, setIsStreaming] = useState(false)
    const [isLoadingHistory, setIsLoadingHistory] = useState(true)
    const [sessionStatus, setSessionStatus] = useState<SessionStatus | null>(null)
    const [isExpired, setIsExpired] = useState(false)
    const [showTour, setShowTour] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const chatContainerRef = useRef<HTMLDivElement>(null)
    const shouldAutoScroll = useRef(true)

    // Check session validity
    useEffect(() => {
        if (!email) {
            router.push('/signup/demo')
            return
        }

        const checkSession = async () => {
            try {
                const res = await fetch(`/api/demo/session?email=${encodeURIComponent(email)}`)
                const data: SessionStatus = await res.json()
                setSessionStatus(data)
                if (data.expired) {
                    setIsExpired(true)
                    setIsLoadingHistory(false)
                    return
                }
            } catch {
                // If session check fails, allow access (graceful degradation)
                console.error('Session check failed, allowing access')
            }

            // Load chat history
            try {
                const historyRes = await fetch(`/api/demo/chat-history?email=${encodeURIComponent(email)}`)
                const historyData = await historyRes.json()

                if (historyData.success && historyData.messages.length > 0) {
                    const loadedMessages: Message[] = historyData.messages.map((msg: { id: string; role: string; content: string; timestamp: string; dateLabel: string }) => ({
                        id: msg.id,
                        role: msg.role as 'user' | 'assistant',
                        content: msg.content,
                        timestamp: new Date(msg.timestamp),
                        dateLabel: msg.dateLabel,
                    }))
                    setMessages(loadedMessages)
                } else {
                    // No history — show welcome message
                    setMessages([
                        {
                            id: 'welcome',
                            role: 'assistant',
                            content:
                                "👋 Hi there! I'm **SalesBuddy AI**, your intelligent sales assistant. I can help you with product information, pricing, competitive analysis, and CRM insights.\n\nTry asking me something like:\n- *\"What are the key features?\"*\n- *\"Tell me about pricing plans\"*\n- *\"How does it compare to competitors?\"*",
                            timestamp: new Date(),
                            dateLabel: 'Today',
                        },
                    ])
                }
            } catch {
                // If history load fails, show welcome message
                setMessages([
                    {
                        id: 'welcome',
                        role: 'assistant',
                        content:
                            "👋 Hi there! I'm **SalesBuddy AI**, your intelligent sales assistant.\n\nTry asking me something like:\n- *\"What are the key features?\"*\n- *\"Tell me about pricing plans\"*",
                        timestamp: new Date(),
                        dateLabel: 'Today',
                    },
                ])
            } finally {
                setIsLoadingHistory(false)
            }
        }

        checkSession()
    }, [email, router])

    // Scroll tracking
    const handleScroll = useCallback(() => {
        const container = chatContainerRef.current
        if (!container) return
        const { scrollTop, scrollHeight, clientHeight } = container
        shouldAutoScroll.current = scrollHeight - scrollTop - clientHeight < 150
    }, [])

    useEffect(() => {
        if (shouldAutoScroll.current) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isTyping])

    // Save a message to the database
    const saveMessage = async (role: string, content: string) => {
        try {
            await fetch('/api/demo/chat-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, role, content }),
            })
        } catch {
            console.error('Failed to save message')
        }
    }

    const sendMessage = async () => {
        if (!input.trim() || isTyping) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
            dateLabel: 'Today',
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsTyping(true)
        shouldAutoScroll.current = true

        // Save user message to DB
        saveMessage('user', userMessage.content)

        const assistantMessageId = (Date.now() + 1).toString()
        const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            dateLabel: 'Today',
        }

        setTimeout(() => {
            setMessages((prev) => [...prev, assistantMessage])
            setIsStreaming(true)
        }, 400)

        let fullResponse = ''

        try {
            const res = await fetch('/api/demo/agent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    email,
                }),
            })

            if (!res.ok) {
                throw new Error('Agent request failed')
            }

            const reader = res.body?.getReader()
            if (!reader) throw new Error('No response stream')

            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })

                const lines = buffer.split('\n\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                    const dataLine = line.replace(/^data: /, '').trim()
                    if (!dataLine) continue

                    try {
                        const parsed = JSON.parse(dataLine)
                        if (parsed.chunk) {
                            fullResponse += parsed.chunk
                            setMessages((prev) =>
                                prev.map((msg) =>
                                    msg.id === assistantMessageId
                                        ? { ...msg, content: msg.content + parsed.chunk }
                                        : msg
                                )
                            )
                        }
                    } catch {
                        // Skip unparseable events
                    }
                }
            }

            // Save the complete assistant response to DB
            if (fullResponse) {
                saveMessage('assistant', fullResponse)
            }
        } catch (err) {
            console.error('Agent error:', err)
            const errorContent = '⚠️ Sorry, I encountered an error. Please try again.'
            setMessages((prev) => {
                const hasMsg = prev.find((m) => m.id === assistantMessageId)
                if (hasMsg) {
                    return prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: errorContent }
                            : msg
                    )
                }
                return [
                    ...prev,
                    {
                        id: assistantMessageId,
                        role: 'assistant' as const,
                        content: errorContent,
                        timestamp: new Date(),
                        dateLabel: 'Today',
                    },
                ]
            })
        } finally {
            setIsTyping(false)
            setIsStreaming(false)
            inputRef.current?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    const formatContent = (content: string) => {
        if (!content) return ''
        return content
            .split('\n')
            .map((line) => {
                let formatted = line.replace(
                    /\*\*(.*?)\*\*/g,
                    '<strong class="font-semibold text-slate-800">$1</strong>'
                )
                formatted = formatted.replace(
                    /\*(.*?)\*/g,
                    '<em class="text-slate-600">$1</em>'
                )
                const numberedMatch = formatted.match(/^(\d+)\.\s(.*)/)
                if (numberedMatch) {
                    formatted = `<div class="flex gap-2 py-0.5"><span class="text-primary-500 font-semibold min-w-[1.25rem]">${numberedMatch[1]}.</span><span>${numberedMatch[2]}</span></div>`
                } else if (formatted.startsWith('- ')) {
                    formatted = `<div class="flex gap-2 py-0.5"><span class="text-primary-500 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0"></span><span>${formatted.slice(2)}</span></div>`
                }
                return formatted
            })
            .join('<br/>')
    }

    // Get unique date labels for rendering separators
    const getDateSeparators = () => {
        const seen = new Set<string>()
        const separators: Record<number, string> = {}
        messages.forEach((msg, index) => {
            const label = msg.dateLabel || 'Today'
            if (!seen.has(label)) {
                seen.add(label)
                separators[index] = label
            }
        })
        return separators
    }

    const dateSeparators = getDateSeparators()

    // =========================================================================
    // EXPIRED DEMO SCREEN
    // =========================================================================
    if (isExpired) {
        return (
            <section className="h-[calc(100vh-5rem)] flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f1f5f9 100%)' }}>
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/20">
                        <ShieldAlert className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-3">Demo Has Expired</h1>
                    <p className="text-slate-600 mb-2">
                        Your 7-day demo access for <strong className="text-slate-800">{email}</strong> has ended.
                    </p>
                    <p className="text-slate-500 text-sm mb-8">
                        Contact our team to get full access or start a trial with your own data.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => router.push('/signup/trial')}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all active:scale-95"
                        >
                            Start Free Trial
                        </button>
                        <button
                            onClick={() => router.push('/contact')}
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all"
                        >
                            Contact Sales
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    // =========================================================================
    // LOADING STATE
    // =========================================================================
    if (isLoadingHistory) {
        return (
            <section className="h-[calc(100vh-5rem)] flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f1f5f9 100%)' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/25 animate-pulse">
                        <Bot className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-slate-500 text-sm font-medium">Loading chat history...</p>
                </div>
            </section>
        )
    }

    // =========================================================================
    // MAIN CHAT UI
    // =========================================================================
    return (
        <>
            {showTour && <GuidedTour onClose={() => setShowTour(false)} />}
            <section className="h-[calc(100vh-5rem)] flex flex-col" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f1f5f9 100%)' }}>
                {/* Chat Header */}
                <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-sm relative z-10">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center gap-4 py-3.5">
                            <button
                                onClick={() =>
                                    router.push(
                                        '/demo/experience?email=' + encodeURIComponent(email)
                                    )
                                }
                                className="w-9 h-9 rounded-xl hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all duration-200"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-3 flex-1">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 via-primary-600 to-blue-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white ring-2 ring-emerald-500/20" />
                                </div>
                                <div>
                                    <h1 className="font-bold text-slate-900 text-sm tracking-tight">
                                        SalesBuddy AI
                                    </h1>
                                    <p className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                                        <Sparkles className="w-3 h-3" />
                                        {isTyping ? 'Thinking...' : 'Online'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {sessionStatus && sessionStatus.daysRemaining > 0 && (
                                    <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-lg">
                                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                                        <span>{sessionStatus.daysRemaining}d remaining</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => setShowTour(true)}
                                    className="flex items-center gap-1.5 text-xs font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-200 px-3 py-1.5 rounded-lg transition-all duration-200"
                                    title="Guided Tour"
                                >
                                    <BookOpen className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Guided Tour</span>
                                </button>
                                <a
                                    href="/contact"
                                    className="flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg transition-all duration-200"
                                    title="Connect to Team"
                                >
                                    <Users className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Connect to Team</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Messages */}
                <div ref={chatContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
                        {messages.map((message, index) => (
                            <div key={message.id}>
                                {/* Date Separator */}
                                {dateSeparators[index] && (
                                    <div className="flex items-center gap-3 mb-5 mt-2">
                                        <div className="flex-1 h-px bg-slate-200" />
                                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                            {dateSeparators[index]}
                                        </span>
                                        <div className="flex-1 h-px bg-slate-200" />
                                    </div>
                                )}

                                <div
                                    className={`flex gap-3 animate-fadeIn ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    {/* Avatar */}
                                    <div className="flex-shrink-0 mt-1">
                                        {message.role === 'assistant' ? (
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-md shadow-primary-500/20">
                                                <Bot className="w-4 h-4 text-white" />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-md shadow-slate-500/20">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Message Content */}
                                    <div className={`max-w-[80%] ${message.role === 'user' ? 'flex flex-col items-end' : ''}`}>
                                        <p className="text-xs font-medium mb-1.5 text-slate-500">
                                            {message.role === 'assistant' ? 'SalesBuddy AI' : 'You'}
                                        </p>
                                        <div
                                            className={`rounded-2xl px-4 py-3 ${message.role === 'assistant'
                                                ? 'bg-white border border-slate-200/80 shadow-sm rounded-tl-md'
                                                : 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-500/20 rounded-tr-md'
                                                }`}
                                        >
                                            {message.content ? (
                                                <div
                                                    className={`text-[14px] leading-relaxed ${message.role === 'assistant'
                                                        ? 'text-slate-700'
                                                        : 'text-white'
                                                        }`}
                                                    dangerouslySetInnerHTML={{
                                                        __html: formatContent(message.content),
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-1 py-1">
                                                    <div className="w-1.5 h-5 bg-primary-500 rounded-full animate-pulse" />
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-[10px] mt-1.5 text-slate-400">
                                            {message.timestamp.toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && !isStreaming && (
                            <div className="flex gap-3 animate-fadeIn">
                                <div className="flex-shrink-0 mt-1">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center shadow-md shadow-primary-500/20">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-medium mb-1.5 text-slate-500">SalesBuddy AI</p>
                                    <div className="bg-white border border-slate-200/80 shadow-sm rounded-2xl rounded-tl-md px-5 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Chat Input */}
                <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200/60 relative z-10">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="flex-1 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={isTyping ? 'Waiting for response...' : 'Ask me anything about sales...'}
                                    disabled={isTyping}
                                    className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                />
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || isTyping}
                                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all duration-200 hover:shadow-lg hover:shadow-primary-600/30 active:scale-95 shadow-md shadow-primary-500/20"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-[11px] text-slate-400 text-center mt-3">
                            SalesBuddy AI can make mistakes. Verify important information.
                        </p>
                    </div>
                </div>

                <style jsx global>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
            </section>
        </>
    )
}
