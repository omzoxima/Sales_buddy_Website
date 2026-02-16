import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Container, Card } from '@/components/ui'
import { DemoSignupForm } from '@/components/forms'

export const metadata: Metadata = {
  title: 'Try Instant Demo',
  description: 'See SalesBuddy AI working in 60 seconds with sample equipment data.',
}

const benefits = [
  'See product Q&A in action',
  'Explore CRM features in preview mode',
  'No credit card required',
  'Ready in 60 seconds',
]

const includes = [
  '7 days access',
  'Pre-loaded equipment catalog',
  '100 queries included',
]

export default function DemoSignupPage() {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-gradient-hero py-16">
      <Container size="md">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Benefits */}
          <div className="order-2 md:order-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Why try the demo?
            </h2>
            <ul className="space-y-3 mb-8">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-500" />
                  <span className="text-slate-600">{benefit}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              What&apos;s included
            </h2>
            <ul className="space-y-2">
              {includes.map((item, index) => (
                <li key={index} className="text-slate-600">• {item}</li>
              ))}
            </ul>
          </div>

          {/* Right: Form */}
          <div className="order-1 md:order-2">
            <Card padding="lg" variant="elevated">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Try SalesBuddy AI Instantly
              </h1>
              <p className="text-slate-600 mb-6">
                See it working with sample equipment data. No setup required.
              </p>
              <DemoSignupForm />
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}
