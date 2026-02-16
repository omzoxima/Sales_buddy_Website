'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Select, Textarea, Alert } from '@/components/ui'
import { COMPANY_SIZES, ROLES, CRMS, SALES_TEAM_SIZES, TIMELINES } from '@/lib/constants'
import { isFreeEmail } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email')
    .refine((email) => !isFreeEmail(email), {
      message: 'Please use your work email',
    }),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  company: z.string().min(2, 'Company name is required'),
  companySize: z.string().min(1, 'Please select company size'),
  role: z.string().min(1, 'Please select your role'),
  salesTeamSize: z.string().min(1, 'Please select sales team size'),
  crm: z.string().min(1, 'Please select your CRM'),
  challenge: z.string().optional(),
  timeline: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function PilotRequestForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/signup/pilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      router.push('/signup/pilot/success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="error" className="mb-2" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          {...register('name')}
          label="Full name"
          placeholder="John Smith"
          error={errors.name?.message}
          autoComplete="name"
        />

        <Input
          {...register('email')}
          label="Work email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          autoComplete="email"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          {...register('phone')}
          label="Phone number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          error={errors.phone?.message}
          autoComplete="tel"
        />

        <Input
          {...register('company')}
          label="Company name"
          placeholder="Acme Inc."
          error={errors.company?.message}
          autoComplete="organization"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          {...register('companySize')}
          label="Company size"
          options={COMPANY_SIZES}
          placeholder="Select"
          error={errors.companySize?.message}
        />

        <Select
          {...register('role')}
          label="Your role"
          options={ROLES}
          placeholder="Select"
          error={errors.role?.message}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Select
          {...register('salesTeamSize')}
          label="Number of sales reps"
          options={SALES_TEAM_SIZES}
          placeholder="Select"
          error={errors.salesTeamSize?.message}
        />

        <Select
          {...register('crm')}
          label="Current CRM"
          options={CRMS}
          placeholder="Select"
          error={errors.crm?.message}
        />
      </div>

      <Textarea
        {...register('challenge')}
        label="What's your biggest sales challenge? (Optional)"
        placeholder="Tell us about the problems you're trying to solve..."
        rows={3}
      />

      <Select
        {...register('timeline')}
        label="When are you looking to implement? (Optional)"
        options={TIMELINES}
        placeholder="Select timeline"
      />

      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Request Pilot →
      </Button>

      <p className="text-xs text-slate-500 text-center">
        By submitting, you agree to our{' '}
        <Link href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </Link>
      </p>

      <p className="text-sm text-slate-600 text-center pt-2">
        Prefer to start on your own?{' '}
        <Link href="/signup/trial" className="text-primary-600 hover:underline font-medium">
          Start a free trial instead
        </Link>
      </p>
    </form>
  )
}
