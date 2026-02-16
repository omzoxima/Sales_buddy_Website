'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Check } from 'lucide-react'
import { Button, Input, Select, Checkbox, Alert } from '@/components/ui'
import { COMPANY_SIZES, ROLES, INDUSTRIES, CRMS } from '@/lib/constants'
import { isFreeEmail } from '@/lib/utils'

const schema = z.object({
  // Step 1
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email')
    .refine((email) => !isFreeEmail(email), {
      message: 'Please use your work email',
    }),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  // Step 2
  company: z.string().min(2, 'Company name is required'),
  companySize: z.string().min(1, 'Please select company size'),
  role: z.string().min(1, 'Please select your role'),
  industry: z.string().min(1, 'Please select your industry'),
  crm: z.string().min(1, 'Please select your CRM'),
  terms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms',
  }),
})

type FormData = z.infer<typeof schema>

export function TrialSignupForm() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      terms: false,
    },
  })

  const handleNextStep = async () => {
    const isValid = await trigger(['email', 'name', 'password'])
    if (isValid) {
      setStep(2)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/signup/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      router.push('/verify?type=trial&email=' + encodeURIComponent(data.email))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            {step > 1 ? <Check className="w-4 h-4" /> : '1'}
          </div>
          <span className="text-sm font-medium text-slate-700">Your Info</span>
        </div>
        <div className="w-12 h-0.5 bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'
          }`}>
            2
          </div>
          <span className="text-sm font-medium text-slate-700">Company Info</span>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <div className="space-y-4">
            <Input
              {...register('email')}
              label="Work email"
              type="email"
              placeholder="you@company.com"
              error={errors.email?.message}
              autoComplete="email"
              autoFocus
            />

            <Input
              {...register('name')}
              label="Full name"
              placeholder="John Smith"
              error={errors.name?.message}
              autoComplete="name"
            />

            <Input
              {...register('password')}
              label="Create password"
              type="password"
              placeholder="Min 8 characters, 1 uppercase, 1 number"
              error={errors.password?.message}
              autoComplete="new-password"
            />

            <Button
              type="button"
              onClick={handleNextStep}
              className="w-full"
              size="lg"
            >
              Continue →
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
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <Input
              {...register('company')}
              label="Company name"
              placeholder="Acme Inc."
              error={errors.company?.message}
              autoComplete="organization"
            />

            <Select
              {...register('companySize')}
              label="Company size"
              options={COMPANY_SIZES}
              placeholder="Select company size"
              error={errors.companySize?.message}
            />

            <Select
              {...register('role')}
              label="Your role"
              options={ROLES}
              placeholder="Select your role"
              error={errors.role?.message}
            />

            <Select
              {...register('industry')}
              label="Industry"
              options={INDUSTRIES}
              placeholder="Select your industry"
              error={errors.industry?.message}
            />

            <Select
              {...register('crm')}
              label="Current CRM"
              options={CRMS}
              placeholder="Select your CRM"
              error={errors.crm?.message}
            />

            <Checkbox
              {...register('terms')}
              label={
                <>
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary-600 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary-600 hover:underline">
                    Privacy Policy
                  </Link>
                </>
              }
              error={errors.terms?.message}
            />

            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              Create Account →
            </Button>
          </div>
        )}
      </form>
    </div>
  )
}
