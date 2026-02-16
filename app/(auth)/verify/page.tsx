import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail } from 'lucide-react'
import { Container, Card, Button } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Verify Your Email',
  description: 'Check your email to verify your account.',
}

export default function VerifyPage({
  searchParams,
}: {
  searchParams: { type?: string; email?: string }
}) {
  const email = searchParams.email || 'your email'
  
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-gradient-hero py-16 flex items-center">
      <Container size="sm">
        <Card padding="lg" variant="elevated" className="text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-primary-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Check Your Email
          </h1>
          <p className="text-slate-600 mb-6">
            We sent a verification link to <strong>{email}</strong>. 
            Click the link to activate your account.
          </p>

          <div className="space-y-4">
            <p className="text-sm text-slate-500">
              Didn&apos;t receive it?{' '}
              <button className="text-primary-600 hover:underline">
                Resend verification email
              </button>
            </p>
            
            <p className="text-sm text-slate-500">
              Wrong email?{' '}
              <Link href="/signup/trial" className="text-primary-600 hover:underline">
                Go back to change it
              </Link>
            </p>
            
            <p className="text-xs text-slate-400">
              Check your spam folder if you don&apos;t see it.
            </p>
          </div>
        </Card>
      </Container>
    </section>
  )
}
