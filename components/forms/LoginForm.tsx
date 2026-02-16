'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button, Input, Alert } from '@/components/ui'

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
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
      // TODO: Implement actual login logic
      // For now, just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      // Redirect to app
      // router.push('/app')
      setError('Login functionality not yet implemented. Connect to your auth provider.')
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
        label="Email"
        type="email"
        placeholder="you@company.com"
        error={errors.email?.message}
        autoComplete="email"
        autoFocus
      />

      <Input
        {...register('password')}
        label="Password"
        type="password"
        placeholder="Enter your password"
        error={errors.password?.message}
        autoComplete="current-password"
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary-600" />
          <span className="text-sm text-slate-600">Remember me</span>
        </label>
        <Link href="/forgot-password" className="text-sm text-primary-600 hover:underline">
          Forgot password?
        </Link>
      </div>

      <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
        Log in
      </Button>

      <p className="text-sm text-slate-600 text-center pt-4">
        Don&apos;t have an account?{' '}
        <Link href="/signup/trial" className="text-primary-600 hover:underline font-medium">
          Start a free trial
        </Link>
      </p>
    </form>
  )
}
