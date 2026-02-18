'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Alert } from '@/components/ui'
import { isFreeEmail } from '@/lib/utils'
import { Shield, Mail, ArrowLeft } from 'lucide-react'

const emailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email')
    .refine((email) => !isFreeEmail(email), {
      message: 'Please use your work email',
    }),
})

type EmailFormData = z.infer<typeof emailSchema>

export function DemoSignupForm() {
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [marketingOptin, setMarketingOptin] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  })

  // Countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // Auto-focus first OTP input
  useEffect(() => {
    if (step === 'otp') {
      otpRefs.current[0]?.focus()
    }
  }, [step])

  const sendOtp = async (data: EmailFormData) => {
    if (!agreedToTerms) {
      setError('Please accept the Terms of Service to continue')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to send OTP')
      }

      setEmail(data.email)
      setStep('otp')
      setCountdown(60)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendOtp = async () => {
    if (countdown > 0) return
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Failed to resend OTP')
      }

      setCountdown(60)
      setOtp(['', '', '', '', '', ''])
      otpRefs.current[0]?.focus()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const verifyOtp = async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit code')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, marketingOptin }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || 'Verification failed')
      }

      // Full page redirect so Header re-mounts with the new cookie
      window.location.href =
        '/demo/experience?email=' + encodeURIComponent(email) + '&welcome=true'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // numbers only

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // take last digit
    setOtp(newOtp)

    // Auto-advance to next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5 && newOtp.every((d) => d !== '')) {
      setTimeout(() => verifyOtp(), 100)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
      setTimeout(() => verifyOtp(), 100)
    }
  }

  // =========================================================================
  // STEP 2: OTP VERIFICATION
  // =========================================================================
  if (step === 'otp') {
    return (
      <div className="space-y-5">
        {error && (
          <Alert variant="error" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div className="text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Mail className="w-6 h-6 text-primary-600" />
          </div>
          <p className="text-sm text-slate-600">
            We sent a 6-digit code to
          </p>
          <p className="font-semibold text-slate-900 text-sm mt-1">
            {email}
          </p>
        </div>

        {/* OTP Input Boxes */}
        <div className="flex justify-center gap-2" onPaste={handleOtpPaste}>
          {otp.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { otpRefs.current[i] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(i, e)}
              className="w-12 h-14 text-center text-xl font-bold border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-slate-900"
            />
          ))}
        </div>

        <Button
          type="button"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
          onClick={verifyOtp}
          disabled={otp.some((d) => d === '')}
        >
          Verify & Start Demo →
        </Button>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => {
              setStep('email')
              setOtp(['', '', '', '', '', ''])
              setError(null)
            }}
            className="text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Change email
          </button>
          <button
            type="button"
            onClick={resendOtp}
            disabled={countdown > 0 || isSubmitting}
            className="text-primary-600 hover:text-primary-700 disabled:text-slate-400 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
          </button>
        </div>
      </div>
    )
  }

  // =========================================================================
  // STEP 1: EMAIL INPUT
  // =========================================================================
  return (
    <form onSubmit={handleSubmit(sendOtp)} className="space-y-4">
      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Input
        {...register('email')}
        type="email"
        placeholder="Enter your work email"
        error={errors.email?.message}
        autoComplete="email"
        autoFocus
      />

      {/* Terms & Conditions */}
      <div className="space-y-3 pt-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-5 h-5 rounded-md border-2 border-slate-300 peer-checked:border-primary-500 peer-checked:bg-primary-500 transition-all duration-200 flex items-center justify-center group-hover:border-primary-400">
              {agreedToTerms && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-slate-600 leading-snug">
            <Shield className="w-3.5 h-3.5 inline-block text-primary-500 mr-1 -mt-0.5" />
            I agree to the{' '}
            <Link href="/terms" className="text-primary-600 hover:underline font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary-600 hover:underline font-medium">
              Privacy Policy
            </Link>
          </span>
        </label>

        {/* Marketing Opt-in */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={marketingOptin}
              onChange={(e) => setMarketingOptin(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-5 h-5 rounded-md border-2 border-slate-300 peer-checked:border-primary-500 peer-checked:bg-primary-500 transition-all duration-200 flex items-center justify-center group-hover:border-primary-400">
              {marketingOptin && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-slate-500 leading-snug">
            <Mail className="w-3.5 h-3.5 inline-block text-slate-400 mr-1 -mt-0.5" />
            I&apos;d like to receive product updates and marketing communications
          </span>
        </label>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        isLoading={isSubmitting}
        disabled={!agreedToTerms}
      >
        Send Verification Code →
      </Button>

      <p className="text-sm text-slate-600 text-center pt-2">
        Want to try with your own data?{' '}
        <Link href="/signup/trial" className="text-primary-600 hover:underline font-medium">
          Start a Document Trial instead
        </Link>
      </p>
    </form>
  )
}
