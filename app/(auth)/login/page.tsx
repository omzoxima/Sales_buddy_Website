import type { Metadata } from 'next'
import { Container, Card } from '@/components/ui'
import { LoginForm } from '@/components/forms'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Log in to your SalesBuddy AI account.',
}

export default function LoginPage() {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-gradient-hero py-16 flex items-center">
      <Container size="sm">
        <Card padding="lg" variant="elevated">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-600">
              Enter your email and we&apos;ll send you a verification code
            </p>
          </div>
          <LoginForm />
        </Card>
      </Container>
    </section>
  )
}
