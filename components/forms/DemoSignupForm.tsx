'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Alert } from '@/components/ui'
import { isFreeEmail } from '@/lib/utils'

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
      const response = await fetch('/api/signup/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong')
      }

      // Redirect to demo experience page
      router.push('/demo/experience?email=' + encodeURIComponent(data.email))
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

      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Start Instant Demo →
      </Button>

      <p className="text-xs text-slate-500 text-center">
        By continuing, you agree to our{' '}
        <Link href="/terms" className="text-primary-600 hover:underline">
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link href="/privacy" className="text-primary-600 hover:underline">
          Privacy Policy
        </Link>
      </p>

      <p className="text-sm text-slate-600 text-center pt-2">
        Want to try with your own data?{' '}
        <Link href="/signup/trial" className="text-primary-600 hover:underline font-medium">
          Start a Document Trial instead
        </Link>
      </p>
    </form>
  )
}
