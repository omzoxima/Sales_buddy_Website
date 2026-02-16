import type { Metadata } from 'next'
import { Check } from 'lucide-react'
import { Container, Card } from '@/components/ui'
import { PilotRequestForm } from '@/components/forms'

export const metadata: Metadata = {
  title: 'Request Guided Pilot',
  description: 'Request a guided pilot of SalesBuddy AI. We set up everything for you.',
}

const includes = [
  'We upload your documents',
  'We connect your CRM',
  'Training for your team',
  '14 days full access',
  'Dedicated support',
]

const process = [
  "We'll call you within 24 hours",
  'Quick discovery call (15 min)',
  'We collect your docs & CRM access',
  'We set everything up (1-3 days)',
  'Training and go-live!',
]

export default function PilotSignupPage() {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-gradient-hero py-16">
      <Container>
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left: Form */}
          <Card padding="lg" variant="elevated">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Request a Guided Pilot
            </h1>
            <p className="text-slate-600 mb-6">
              We&apos;ll set up everything for you. Full features, zero effort.
            </p>
            <PilotRequestForm />
          </Card>

          {/* Right: Info */}
          <div className="lg:sticky lg:top-24">
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                What&apos;s Included
              </h2>
              <ul className="space-y-3">
                {includes.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-slate-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 bg-slate-100 rounded-lg">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                What Happens Next
              </h2>
              <ol className="space-y-3">
                {process.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-slate-600">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
