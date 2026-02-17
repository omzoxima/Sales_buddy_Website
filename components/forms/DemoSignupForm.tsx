'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Alert } from '@/components/ui'
import { isFreeEmail } from '@/lib/utils'
import { Shield, Mail } from 'lucide-react'

const schema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email')
    .refine((email) => !isFreeEmail(email), {
      message: 'Please use your work email',
    }),
})

type FormData = z.infer<typeof schema>

export function DemoSignupForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [marketingOptin, setMarketingOptin] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    if (!agreedToTerms) {
      setError('Please accept the Terms of Service to continue')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/signup/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, marketingOptin }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      // Full page redirect so Header re-mounts with the new cookie
      window.location.href = '/demo/experience?email=' + encodeURIComponent(data.email) + '&welcome=true'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        Start Instant Demo →
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
