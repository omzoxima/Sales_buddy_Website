import type { Metadata } from 'next'
import { Container, Card } from '@/components/ui'
import { TrialSignupForm } from '@/components/forms'

export const metadata: Metadata = {
  title: 'Start Free Trial',
  description: 'Start your 15-day free trial of SalesBuddy AI. Upload your documents and test with your real data.',
}

export default function TrialSignupPage() {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-gradient-hero py-16">
      <Container size="sm">
        <Card padding="lg" variant="elevated">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Start Your Free Trial
            </h1>
            <p className="text-slate-600">
              15 days free. No credit card required.
            </p>
          </div>
          <TrialSignupForm />
        </Card>
      </Container>
    </section>
  )
}
