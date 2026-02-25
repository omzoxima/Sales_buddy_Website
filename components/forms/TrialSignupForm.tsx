'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail, CheckCircle2, AlertTriangle, FileText, Cloud, Home, ArrowRight, Sparkles, Loader2 } from 'lucide-react'
import { Button, Input, Alert } from '@/components/ui'

const ROLE_OPTIONS = [
  { value: 'sales-rep', label: 'Sales Rep' },
  { value: 'sales-manager', label: 'Sales Manager' },
  { value: 'sales-ops', label: 'Sales Operations' },
  { value: 'vp-director', label: 'VP / Director of Sales' },
  { value: 'owner-executive', label: 'Owner / Executive' },
]

type Step = 'form' | 'otp' | 'success' | 'already-registered'

// ── Guided Onboarding Steps ──
const GUIDE_STEPS = [
  {
    icon: '✅',
    title: 'Credentials Sent!',
    description: 'Your Microsoft Teams credentials have been sent to your email. Use them to log in and start chatting with SalesBuddy AI.',
    details: [
      '📧 Username & Password in your inbox',
      '🔗 Teams Link to join the workspace',
      '📱 Search the App Name in Teams to start',
    ],
    color: 'from-emerald-500 to-green-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
  },
  {
    icon: '📄',
    title: 'Documents Already Loaded',
    description: 'We\u2019ve uploaded key product documents for your trial. These are also available on the SharePoint site shared with your account. Ask the AI anything about them!',
    details: [],
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  {
    icon: '☁️',
    title: 'Salesforce Connected',
    description: 'We\u2019ve integrated Salesforce with your trial so you can access real-time sales data — pipeline, accounts, opportunities, and more — right inside Teams.',
    details: [
      '📊 Pipeline & deal insights available',
      '🏢 Account 360° views ready',
      '🎤 Update CRM by voice — no typing needed',
    ],
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700',
  },
  {
    icon: '🚀',
    title: "You're All Set!",
    description: 'Everything is configured and ready. Open Teams, find SalesBuddy AI, and start asking questions!',
    details: [
      '⏱️ 10 minutes of full access',
      '👥 Invite up to 5 team members',
      '💡 500 queries included',
    ],
    color: 'from-primary-500 to-primary-700',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    textColor: 'text-primary-700',
  },
]

export function TrialSignupForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('form')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const isVerifyingRef = useRef(false)
  const [termsAccepted, setTermsAccepted] = useState(false)

  // Guided onboarding sub-step (0–3)
  const [guideStep, setGuideStep] = useState(0)

  // Documents fetched from SharePoint
  const [documents, setDocuments] = useState<{ name: string; type: string; size: string }[]>([])
  const [docsLoading, setDocsLoading] = useState(false)

  // OTP state
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [otpSending, setOtpSending] = useState(false)
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  // Save email to localStorage for identification when entering success step
  useEffect(() => {
    if (step === 'success') {
      localStorage.setItem('user_email', email)

      // Fetch real documents from SharePoint
      setDocsLoading(true)
      fetch(`/api/demo/documents?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(data => {
          if (data.documents && Array.isArray(data.documents)) {
            setDocuments(data.documents.map((d: any) => ({
              name: d.name,
              type: (d.type || 'file').toUpperCase(),
              size: d.size || '',
            })))
          }
        })
        .catch(() => { })
        .finally(() => setDocsLoading(false))
    }
  }, [step, email])

  // ── Step 1: Submit form → check if registered → send OTP ──
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !name || !role) {
      setError('All fields are required')
      return
    }

    // Validate email has a proper TLD (e.g. .com, .in, .org)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address (e.g. you@company.com)')
      return
    }

    setIsSubmitting(true)
    try {
      // Check if already registered via GET (no side effects)
      const checkRes = await fetch(`/api/signup/trial?email=${encodeURIComponent(email)}`)
      const checkData = await checkRes.json()

      if (checkData.alreadyRegistered) {
        setIsExpired(checkData.expired || false)
        setStep('already-registered')
        return
      }

      // Not registered — send OTP
      const otpRes = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'trial' }),
      })
      const otpData = await otpRes.json()

      if (!otpRes.ok) {
        throw new Error(otpData.error || 'Failed to send OTP')
      }

      setResendTimer(60)
      setStep('otp')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── OTP Input Handlers ──
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits filled (with guard to prevent double calls)
    if (value && newOtp.every(d => d !== '') && !isVerifyingRef.current) {
      verifyOtpAndSignup(newOtp.join(''))
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      const newOtp = pasted.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
      verifyOtpAndSignup(pasted)
    }
  }

  // ── Step 2: Verify OTP → complete trial signup ──
  const verifyOtpAndSignup = async (code: string) => {
    if (isVerifyingRef.current) return
    isVerifyingRef.current = true
    setOtpVerifying(true)
    setError(null)

    try {
      // Verify OTP
      const verifyRes = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const verifyData = await verifyRes.json()

      if (!verifyRes.ok) {
        throw new Error(verifyData.error || 'Invalid code')
      }

      // OTP verified — now complete trial signup
      const trialRes = await fetch('/api/signup/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, role }),
      })
      const trialData = await trialRes.json()

      if (trialData.alreadyRegistered) {
        setIsExpired(trialData.expired || false)
        setStep('already-registered')
        return
      }

      if (!trialRes.ok) {
        throw new Error(trialData.error || 'Failed to complete signup')
      }

      setGuideStep(0)
      setStep('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      isVerifyingRef.current = false
      setOtpVerifying(false)
    }
  }

  // ── Resend OTP ──
  const handleResend = async () => {
    setOtpSending(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'trial' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResendTimer(60)
      setOtp(['', '', '', '', '', ''])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend')
    } finally {
      setOtpSending(false)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  // ── Already Registered ──
  if (step === 'already-registered') {
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Already Registered
        </h3>
        <p className="text-slate-600 mb-6">
          You have already registered for a free trial
          {isExpired ? ' and your trial has expired' : ''}.
          <br />
          Connect to our team for more assistance.
        </p>
        <div className="space-y-3">
          <Link href="/contact">
            <Button className="w-full" size="lg">
              Connect to Team →
            </Button>
          </Link>
          <button
            onClick={() => { setStep('form'); setEmail(''); setError(null) }}
            className="text-sm text-primary-600 hover:underline"
          >
            Try a different email
          </button>
        </div>
      </div>
    )
  }

  // ── Success — Guided Onboarding ──
  if (step === 'success') {
    const currentGuide = GUIDE_STEPS[guideStep]
    const isLastStep = guideStep === GUIDE_STEPS.length - 1

    return (
      <div className="py-2">
        {/* Progress Stepper */}
        <div className="flex items-center justify-center gap-1.5 mb-8">
          {GUIDE_STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-500 ${i === guideStep
                ? 'w-8 bg-gradient-to-r ' + GUIDE_STEPS[i].color
                : i < guideStep
                  ? 'w-4 bg-emerald-400'
                  : 'w-4 bg-slate-200'
                }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="text-center" key={guideStep} style={{ animation: 'guideSlideIn 0.4s ease-out' }}>
          {/* Icon */}
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${currentGuide.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
            <span className="text-3xl">{currentGuide.icon}</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            {currentGuide.title}
          </h3>

          {/* Email shown on first step */}
          {guideStep === 0 && (
            <p className="font-medium text-primary-600 mb-2">{email}</p>
          )}

          {/* Description */}
          <p className="text-slate-600 mb-5 text-sm leading-relaxed">
            {currentGuide.description}
          </p>

          {/* Details Card — dynamic for documents step, static for others */}
          {guideStep === 1 ? (
            <div className={`${currentGuide.bgColor} border ${currentGuide.borderColor} rounded-xl p-4 mb-6 text-left`}>
              {docsLoading ? (
                <div className="flex items-center justify-center gap-2 py-3 text-blue-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading documents from SharePoint...</span>
                </div>
              ) : documents.length > 0 ? (
                <ul className={`text-sm ${currentGuide.textColor} space-y-2`}>
                  {documents.map((doc, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <FileText className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate flex-1">{doc.name}</span>
                      <span className="text-xs opacity-60 flex-shrink-0">{doc.size}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className={`text-sm ${currentGuide.textColor}`}>Documents will be available in your SharePoint site.</p>
              )}
            </div>
          ) : (
            <div className={`${currentGuide.bgColor} border ${currentGuide.borderColor} rounded-xl p-4 mb-6 text-left`}>
              <ul className={`text-sm ${currentGuide.textColor} space-y-2.5`}>
                {currentGuide.details.map((detail, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            {guideStep > 0 && (
              <button
                onClick={() => setGuideStep(guideStep - 1)}
                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-all"
              >
                ← Back
              </button>
            )}

            {isLastStep ? (
              <button
                onClick={() => { window.location.href = '/' }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Home Page
              </button>
            ) : (
              <button
                onClick={() => setGuideStep(guideStep + 1)}
                className={`flex-1 px-4 py-3 bg-gradient-to-r ${currentGuide.color} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2`}
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Skip link */}
          {!isLastStep && (
            <button
              onClick={() => router.push('/')}
              className="text-xs text-slate-400 hover:text-slate-600 mt-4 inline-block transition-colors"
            >
              Skip & go to home
            </button>
          )}
        </div>

        {/* Trial validity note */}
        <p className="text-xs text-slate-400 text-center mt-6">
          Trial valid for 10 minutes. Need help?{' '}
          <Link href="/contact" className="text-primary-600 hover:underline">
            Contact support
          </Link>
        </p>

        <style jsx>{`
          @keyframes guideSlideIn {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    )
  }

  // ── OTP Step ──
  if (step === 'otp') {
    return (
      <div>
        <button
          onClick={() => { setStep('form'); setOtp(['', '', '', '', '', '']); setError(null) }}
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Change email
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-7 h-7 text-primary-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Verify Your Email</h3>
          <p className="text-sm text-slate-500">
            Enter the 6-digit code sent to <strong>{email}</strong>
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-4" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* OTP Boxes */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={el => { inputRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              onPaste={i === 0 ? handleOtpPaste : undefined}
              disabled={otpVerifying}
              className="w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all disabled:opacity-50"
              autoFocus={i === 0}
            />
          ))}
        </div>

        {otpVerifying && (
          <p className="text-center text-sm text-primary-600 mb-4">Verifying...</p>
        )}

        <div className="text-center">
          {resendTimer > 0 ? (
            <p className="text-sm text-slate-500">
              Resend code in <strong>{resendTimer}s</strong>
            </p>
          ) : (
            <button
              onClick={handleResend}
              disabled={otpSending}
              className="text-sm text-primary-600 hover:underline disabled:opacity-50"
            >
              {otpSending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </div>
      </div>
    )
  }

  // ── Form Step ──
  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      {error && (
        <Alert variant="error" className="mb-2" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Input
        label="Full name"
        placeholder="John Smith"
        value={name}
        onChange={e => setName(e.target.value)}
        autoComplete="name"
        autoFocus
      />

      <Input
        label="Work email"
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={e => setEmail(e.target.value)}
        autoComplete="email"
      />

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          Your Role
        </label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all bg-white"
        >
          <option value="">Select your role</option>
          {ROLE_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-start gap-2 pt-1">
        <input
          type="checkbox"
          id="trial-terms"
          checked={termsAccepted}
          onChange={e => setTermsAccepted(e.target.checked)}
          className="mt-1 rounded border-slate-300"
        />
        <label htmlFor="trial-terms" className="text-sm text-slate-600">
          I agree to the{' '}
          <Link href="/terms" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>
        </label>
      </div>

      <Button
        type="submit"
        className={`w-full transition-all ${!termsAccepted ? 'opacity-50 cursor-not-allowed' : ''}`}
        size="lg"
        isLoading={isSubmitting}
        disabled={!termsAccepted || isSubmitting}
      >
        Start Free Trial →
      </Button>

      <p className="text-sm text-slate-600 text-center pt-2">
        Just want to explore first?{' '}
        <Link href="/signup/demo" className="text-primary-600 hover:underline font-medium">
          Try our Instant Demo
        </Link>
      </p>

      <p className="text-sm text-slate-600 text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 hover:underline font-medium">
          Log in
        </Link>
      </p>
    </form>
  )
}
