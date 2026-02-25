'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    Clock, Zap, ArrowUpRight, AlertTriangle, CheckCircle,
    Shield, Rocket, Users, Mail, MessageSquare, Lock,
    CalendarDays, Sparkles, ExternalLink, ChevronRight, Activity,
    BarChart3, BookOpen, FileText, HelpCircle, Eye, X, Download, Loader2
} from 'lucide-react'

interface DemoStatus {
    active: boolean
    expired: boolean
    email: string
    createdAt: string
    expiresAt: string
    timeRemaining: string
}

interface TrialStatus {
    active: boolean
    expired: boolean
    registered: boolean
    email: string
    name: string
    role: string
    createdAt: string
    expiresAt: string
    timeRemaining: string
    teamLink?: string
}

interface DashboardData {
    demo: DemoStatus | null
    trial: TrialStatus | null
    currentPlan: string
    upgradeOptions: string[]
}

interface SharePointDoc {
    id: string
    name: string
    type: string
    size: string
    url?: string
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '—'
    const d = new Date(dateStr)
    return d.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function getDaysLeft(expiresAt: string): number {
    const now = Date.now()
    const exp = new Date(expiresAt).getTime()
    const diff = exp - now
    if (diff <= 0) return 0
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function getHoursLeft(expiresAt: string): number {
    const now = Date.now()
    const exp = new Date(expiresAt).getTime()
    const diff = exp - now
    if (diff <= 0) return 0
    return Math.ceil(diff / (1000 * 60 * 60))
}

function getProgressPercent(createdAt: string, expiresAt: string): number {
    const created = new Date(createdAt).getTime()
    const expires = new Date(expiresAt).getTime()
    const now = Date.now()
    const total = expires - created
    const remaining = expires - now
    if (total <= 0) return 0
    return Math.min(100, Math.max(0, (remaining / total) * 100))
}

// SVG Circular Progress Component
function CircularProgress({ percent, size = 160, stroke = 10, children }: {
    percent: number
    size?: number
    stroke?: number
    children: React.ReactNode
}) {
    const radius = (size - stroke) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (percent / 100) * circumference

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="rgba(255,255,255,0.15)"
                    strokeWidth={stroke}
                />
                {/* Progress arc */}
                <circle
                    cx={size / 2} cy={size / 2} r={radius}
                    fill="none" stroke="white"
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {children}
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    const [email, setEmail] = useState<string | null>(null)
    const [emailInput, setEmailInput] = useState('')
    const [lookupError, setLookupError] = useState<string | null>(null)
    const [needsEmailInput, setNeedsEmailInput] = useState(false)
    const [documents, setDocuments] = useState<SharePointDoc[]>([])
    const [docsLoading, setDocsLoading] = useState(false)
    const [previewDoc, setPreviewDoc] = useState<SharePointDoc | null>(null)

    const fetchDashboard = (userEmail: string) => {
        setLoading(true)
        setLookupError(null)
        fetch(`/api/user/dashboard?email=${encodeURIComponent(userEmail)}`)
            .then(res => res.json())
            .then(d => {
                if (!d.demo && !d.trial) {
                    setLookupError('No demo or trial found for this email. Please sign up first.')
                    setData(null)
                    setNeedsEmailInput(true)
                } else {
                    setData(d)
                    setEmail(userEmail)
                    setNeedsEmailInput(false)

                    // Save to localStorage for automatic login on future visits
                    localStorage.setItem('user_email', userEmail)

                    // Fetch SharePoint documents
                    setDocsLoading(true)
                    fetch(`/api/demo/documents?email=${encodeURIComponent(userEmail)}`)
                        .then(res => res.json())
                        .then(docData => {
                            if (docData.documents && Array.isArray(docData.documents)) {
                                setDocuments(docData.documents.map((doc: { id: string; name: string; type?: string; size?: string; downloadUrl?: string }) => ({
                                    id: doc.id,
                                    name: doc.name,
                                    type: (doc.type || 'file').toUpperCase(),
                                    size: doc.size || '',
                                    url: doc.downloadUrl || '',
                                })))
                            }
                        })
                        .catch(() => { })
                        .finally(() => setDocsLoading(false))
                }
                setLoading(false)
                setInitialLoading(false)
            })
            .catch(() => {
                setLookupError('Something went wrong. Please try again.')
                setLoading(false)
                setInitialLoading(false)
            })
    }

    useEffect(() => {
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null

        if (!userEmail) {
            setNeedsEmailInput(true)
            setInitialLoading(false)
            return
        }

        setEmail(userEmail)
        fetchDashboard(userEmail)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleEmailLookup = (e: React.FormEvent) => {
        e.preventDefault()
        if (!emailInput.trim() || !emailInput.includes('@')) {
            setLookupError('Please enter a valid email address.')
            return
        }
        fetchDashboard(emailInput.trim())
    }

    // ── Loading ──
    if (initialLoading) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#F0F4F8]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin" />
                    <p className="text-slate-500 text-sm font-medium">Loading your dashboard...</p>
                </div>
            </div>
        )
    }

    // ── Email Lookup ──
    if (needsEmailInput && !data) {
        return (
            <section className="min-h-[calc(100vh-5rem)] bg-[#F0F4F8] py-16 flex items-center">
                <div className="max-w-md mx-auto px-4 sm:px-6 w-full">
                    <div className="rounded-2xl bg-white shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-emerald-50 flex items-center justify-center mx-auto mb-4 shadow-sm">
                                <Shield className="w-8 h-8 text-teal-600" />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Check Your Status</h1>
                            <p className="text-slate-500 text-sm">Enter the email you used to sign up.</p>
                        </div>
                        <form onSubmit={handleEmailLookup} className="space-y-4">
                            <input
                                type="email"
                                value={emailInput}
                                onChange={(e) => { setEmailInput(e.target.value); setLookupError(null) }}
                                placeholder="you@company.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm bg-slate-50/50"
                                autoFocus
                            />
                            {lookupError && (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-3 py-2.5 rounded-xl">
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                    {lookupError}
                                </div>
                            )}
                            <button type="submit" disabled={loading}
                                className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-semibold rounded-xl hover:from-teal-700 hover:to-emerald-700 transition-all text-sm disabled:opacity-50 shadow-lg shadow-teal-600/20">
                                {loading ? 'Checking...' : 'View Dashboard'}
                            </button>
                        </form>
                        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
                            <p className="text-xs text-slate-400">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup/demo" className="text-teal-600 hover:underline font-medium">Try Instant Demo</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (!data) {
        return (
            <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-[#F0F4F8]">
                <p className="text-slate-500">Something went wrong. Please try again.</p>
            </div>
        )
    }

    const { demo, trial, currentPlan } = data
    const isTrialUser = trial?.registered
    const isDemoOnly = !isTrialUser && demo !== null
    const demoExpired = demo?.expired ?? false
    const trialExpired = trial?.expired ?? false
    const demoActive = demo?.active ?? false
    const trialActive = trial?.active ?? false
    const hasActiveSession = demoActive || trialActive

    const activeCreatedAt = (isTrialUser ? trial?.createdAt : demo?.createdAt) || ''
    const activeExpiresAt = (isTrialUser ? trial?.expiresAt : demo?.expiresAt) || ''
    const progress = activeCreatedAt && activeExpiresAt ? getProgressPercent(activeCreatedAt, activeExpiresAt) : 0
    const daysLeft = activeExpiresAt ? getDaysLeft(activeExpiresAt) : 0
    const hoursLeft = activeExpiresAt ? getHoursLeft(activeExpiresAt) : 0

    const planLabel = trialActive ? 'Free Trial' :
        demoActive ? 'Instant Demo' :
            trialExpired ? 'Trial' :
                demoExpired ? 'Demo' : 'None'

    const userName = trial?.name || email?.split('@')[0] || 'User'
    const firstName = userName.split(' ')[0]
    // Capitalize first letter
    const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1)

    // For demo: show hours; for trial: show days
    const countdownNumber = trialActive || trialExpired ? daysLeft : hoursLeft
    const countdownUnit = trialActive || trialExpired ? (daysLeft === 1 ? 'Day Left' : 'Days Left') : (hoursLeft === 1 ? 'Hour Left' : 'Hours Left')
    const totalDuration = trialActive || trialExpired ? '15 Days' : '7 Days'

    return (
        <>
            <section className="min-h-[calc(100vh-5rem)] bg-[#F0F4F8] overflow-x-hidden">
                <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6 lg:py-8">

                    {/* ═══════════════════════════════════════════ */}
                    {/* WELCOME HEADER */}
                    {/* ═══════════════════════════════════════════ */}
                    <div className="mb-4 sm:mb-6">
                        <h1 className="text-xl sm:text-3xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="text-xl sm:text-2xl">👋</span> Welcome, {displayName}
                        </h1>
                        <p className="text-slate-500 text-xs sm:text-sm mt-1">
                            {hasActiveSession
                                ? `Your ${planLabel.toLowerCase()} ends in ${trialActive ? `${daysLeft} days` : `${hoursLeft} hours`}`
                                : `Your ${planLabel.toLowerCase()} has expired`}
                        </p>
                    </div>

                    {/* ═══════════════════════════════════════════ */}
                    {/* HERO BANNER WITH CIRCULAR COUNTDOWN */}
                    {/* ═══════════════════════════════════════════ */}
                    <div className={`relative rounded-2xl overflow-hidden mb-4 sm:mb-5 ${hasActiveSession
                        ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-cyan-500'
                        : 'bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800'
                        }`}>
                        {/* Decorative blurs */}
                        <div className="absolute inset-0 overflow-hidden">
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
                            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl" />
                        </div>

                        <div className="relative px-4 py-5 sm:px-8 sm:py-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                            {/* Circular countdown — smaller on mobile */}
                            <div className="flex-shrink-0">
                                {/* Mobile size */}
                                <div className="block sm:hidden">
                                    <CircularProgress percent={hasActiveSession ? progress : 0} size={110} stroke={7}>
                                        <span className="text-3xl font-black text-white leading-none">
                                            {hasActiveSession ? countdownNumber : 0}
                                        </span>
                                        <span className="text-[10px] text-white/70 font-medium mt-1">
                                            {hasActiveSession ? countdownUnit : 'Expired'}
                                        </span>
                                        <span className="text-[9px] text-white/40 mt-0.5">
                                            {planLabel} • {totalDuration}
                                        </span>
                                    </CircularProgress>
                                </div>
                                {/* Desktop size */}
                                <div className="hidden sm:block">
                                    <CircularProgress percent={hasActiveSession ? progress : 0} size={140} stroke={8}>
                                        <span className="text-4xl font-black text-white leading-none">
                                            {hasActiveSession ? countdownNumber : 0}
                                        </span>
                                        <span className="text-xs text-white/70 font-medium mt-1">
                                            {hasActiveSession ? countdownUnit : 'Expired'}
                                        </span>
                                        <span className="text-[10px] text-white/40 mt-0.5">
                                            {planLabel} • {totalDuration}
                                        </span>
                                    </CircularProgress>
                                </div>
                            </div>

                            {/* Info & Actions */}
                            <div className="flex-1 text-center sm:text-left min-w-0">
                                <h2 className="text-lg sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">
                                    {hasActiveSession
                                        ? `Your ${planLabel.toLowerCase()} ends in ${trialActive ? `${daysLeft} days` : `${hoursLeft} hours`}`
                                        : `Your ${planLabel.toLowerCase()} has expired`}
                                </h2>
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-white/70 text-xs sm:text-sm mb-4 sm:mb-5">
                                    <span className="flex items-center gap-1.5">
                                        <CalendarDays className="w-3.5 h-3.5" />
                                        Started: {formatDate(activeCreatedAt)}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        {hasActiveSession ? 'Ends' : 'Ended'}: {formatDate(activeExpiresAt)}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
                                    {/* Primary action button */}
                                    {demoActive && (
                                        <Link href={`/demo/agent?email=${encodeURIComponent(email || '')}`}>
                                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-black/10 text-sm">
                                                <Zap className="w-4 h-4" />
                                                Open Live Agent
                                            </button>
                                        </Link>
                                    )}
                                    {trialActive && trial?.teamLink && (
                                        <Link href={trial.teamLink} target="_blank" rel="noopener noreferrer">
                                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-black/10 text-sm">
                                                <Users className="w-4 h-4" />
                                                Open in Teams
                                            </button>
                                        </Link>
                                    )}
                                    {hasActiveSession && (
                                        <Link href={isDemoOnly ? '/signup/trial' : '/signup/pilot'}>
                                            <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition-all border border-white/20 text-sm backdrop-blur-sm">
                                                <Rocket className="w-4 h-4" />
                                                {isDemoOnly ? 'Start Free Trial' : 'Upgrade Now'}
                                            </button>
                                        </Link>
                                    )}
                                    {!hasActiveSession && (
                                        <>
                                            {demoExpired && !isTrialUser && (
                                                <Link href="/signup/trial">
                                                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-teal-700 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-black/10 text-sm">
                                                        <Rocket className="w-4 h-4" />
                                                        Start Free Trial
                                                    </button>
                                                </Link>
                                            )}
                                            {trialExpired && (
                                                <Link href="/signup/pilot">
                                                    <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-lg shadow-black/10 text-sm">
                                                        <Users className="w-4 h-4" />
                                                        Request Pilot
                                                    </button>
                                                </Link>
                                            )}
                                            <Link href="/contact">
                                                <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 text-white font-semibold rounded-xl hover:bg-white/25 transition-all border border-white/20 text-sm backdrop-blur-sm">
                                                    <Mail className="w-4 h-4" />
                                                    Contact Sales
                                                </button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════ */}
                    {/* STATS BAR */}
                    {/* ═══════════════════════════════════════════ */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
                        {/* Time Remaining */}
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock className={`w-4 h-4 ${hasActiveSession ? 'text-teal-500' : 'text-red-400'}`} />
                                <span className="text-xs font-medium text-slate-400">Time Left</span>
                            </div>
                            <p className={`text-lg font-bold ${hasActiveSession ? 'text-slate-800' : 'text-red-500'}`}>
                                {trialActive ? trial!.timeRemaining :
                                    demoActive ? demo!.timeRemaining : 'Expired'}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                {hasActiveSession ? (trialActive ? 'Full Team Access' : 'Single User Access') : 'Benefits Revoked'}
                            </p>
                        </div>

                        {/* Plan Type */}
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <Users className="w-4 h-4 text-indigo-500" />
                                <span className="text-xs font-medium text-slate-400">Plan</span>
                            </div>
                            <p className="text-lg font-bold text-slate-800">{planLabel}</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                {isTrialUser ? `Role: ${trial?.role || '—'}` : 'Sample Data Mode'}
                            </p>
                        </div>

                        {/* Status */}
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                {hasActiveSession
                                    ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    : <Lock className="w-4 h-4 text-red-400" />}
                                <span className="text-xs font-medium text-slate-400">Status</span>
                            </div>
                            <p className={`text-lg font-bold ${hasActiveSession ? 'text-emerald-600' : 'text-red-500'}`}>
                                {hasActiveSession ? 'Active' : 'Expired'}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                                {hasActiveSession ? 'All features available' : 'Upgrade to continue'}
                            </p>
                        </div>

                        {/* Usage / Progress */}
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 className="w-4 h-4 text-amber-500" />
                                <span className="text-xs font-medium text-slate-400">Usage</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${hasActiveSession
                                            ? 'bg-gradient-to-r from-teal-400 to-emerald-500'
                                            : 'bg-red-400'}`}
                                        style={{ width: `${hasActiveSession ? 100 - progress : 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-slate-600">
                                    {hasActiveSession ? `${Math.round(100 - progress)}%` : '100%'}
                                </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1.5">
                                {hasActiveSession ? 'Time elapsed' : 'Fully consumed'}
                            </p>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════ */}
                    {/* BOTTOM GRID: RESOURCES + UPGRADE */}
                    {/* ═══════════════════════════════════════════ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

                        {/* ── Site Documents (from SharePoint) ── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-teal-500" />
                                    Your Documents
                                </h3>
                                <span className="text-xs text-slate-400">{documents.length} files</span>
                            </div>

                            {docsLoading ? (
                                <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Loading documents...</span>
                                </div>
                            ) : documents.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileText className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                    <p className="text-sm text-slate-400">No documents found</p>
                                </div>
                            ) : (
                                <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                                    {documents.map((doc, idx) => (
                                        <div key={idx} className="group flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-800 truncate">{doc.name}</p>
                                                <p className="text-xs text-slate-400">{doc.type} {doc.size && `• ${doc.size}`}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {doc.id && (
                                                    <button
                                                        onClick={() => setPreviewDoc(doc)}
                                                        className="w-7 h-7 rounded-lg bg-teal-50 hover:bg-teal-100 flex items-center justify-center text-teal-600 transition-colors"
                                                        title="Preview"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                                {doc.url && (
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"
                                                        title="Download"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Upgrade Your Plan ── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                    Upgrade Your Plan
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* Free Trial Card */}
                                {(isDemoOnly || currentPlan === 'demo_expired') && (
                                    <Link href="/signup/trial" className="group">
                                        <div className="relative rounded-xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-emerald-50 p-4 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-100 transition-all duration-300 h-full">
                                            <span className="absolute -top-2.5 left-3 text-[9px] font-bold text-white bg-teal-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                                            <div className="flex items-center gap-2 mb-2 mt-1">
                                                <Rocket className="w-4 h-4 text-teal-600" />
                                                <span className="font-bold text-slate-800 text-sm">Free Trial</span>
                                            </div>
                                            <p className="text-xl font-black text-teal-700 mb-1">15 Days</p>
                                            <p className="text-[10px] text-slate-500 mb-3">Team access, upload docs, MS Teams</p>
                                            <div className="bg-teal-600 text-white text-xs font-semibold py-2 px-3 rounded-lg text-center group-hover:bg-teal-700 transition-colors">
                                                Start Free →
                                            </div>
                                        </div>
                                    </Link>
                                )}

                                {/* Pilot Card */}
                                <div className="relative rounded-xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100 transition-all duration-300 h-full">
                                    {isTrialUser && (
                                        <span className="absolute -top-2.5 left-3 text-[9px] font-bold text-white bg-amber-500 px-2 py-0.5 rounded-full uppercase tracking-wider">Recommended</span>
                                    )}
                                    <div className="flex items-center gap-2 mb-2 mt-1">
                                        <Users className="w-4 h-4 text-amber-600" />
                                        <span className="font-bold text-slate-800 text-sm">Pilot</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mb-3">Full CRM integration, custom setup</p>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {[3, 6, 9, 12].map(m => (
                                            <Link key={m} href={`/signup/pilot?duration=${m}`}
                                                className="text-center text-[10px] font-bold text-amber-700 bg-white hover:bg-amber-100 py-1.5 rounded-lg transition-colors border border-amber-200/60 hover:border-amber-300">
                                                {m} Mon
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* If trial user and no free trial card, show a "Contact Sales" card instead */}
                                {isTrialUser && (
                                    <Link href="/contact" className="group">
                                        <div className="rounded-xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-100 transition-all duration-300 h-full flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                                                    <span className="font-bold text-slate-800 text-sm">Contact Sales</span>
                                                </div>
                                                <p className="text-xs text-slate-500 mb-3">Get a custom quote for your team</p>
                                            </div>
                                            <div className="bg-indigo-600 text-white text-xs font-semibold py-2 px-3 rounded-lg text-center group-hover:bg-indigo-700 transition-colors">
                                                Talk to Us →
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ─── One-Time Demo Notice ─── */}
                    {demoExpired && !isTrialUser && (
                        <div className="mt-5 rounded-xl bg-white border border-slate-100 p-4 flex items-center gap-3 shadow-sm">
                            <Shield className="w-5 h-5 text-slate-400 flex-shrink-0" />
                            <p className="text-xs text-slate-500">
                                <strong className="text-slate-700">One demo per email.</strong> You can start a new demo with a different work email or upgrade to a free trial.
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── Document Preview Modal ─── */}
            {
                previewDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setPreviewDoc(null)} />
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/80">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4 text-blue-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-800 truncate">{previewDoc.name}</p>
                                        <p className="text-xs text-slate-400">{previewDoc.type} {previewDoc.size && `• ${previewDoc.size}`}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {previewDoc.url && (
                                        <a
                                            href={previewDoc.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                            Download
                                        </a>
                                    )}
                                    <button
                                        onClick={() => setPreviewDoc(null)}
                                        className="w-8 h-8 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {/* Preview Body */}
                            <div className="flex-1 bg-slate-100">
                                <iframe
                                    src={`/api/demo/documents/preview?id=${encodeURIComponent(previewDoc.id)}&email=${encodeURIComponent(email || '')}`}
                                    className="w-full h-full border-0"
                                    title={`Preview ${previewDoc.name}`}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}
