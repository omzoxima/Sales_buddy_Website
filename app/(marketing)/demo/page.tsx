import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, DollarSign, Target, BarChart3, Mic } from 'lucide-react'
import { Container, Card } from '@/components/ui'
import { DemoSignupForm } from '@/components/forms'

export const metadata: Metadata = {
  title: 'Instant Demo',
  description: 'See SalesBuddy AI working in 60 seconds with sample equipment data. No signup hassle.',
}

const features = [
  { icon: Search, text: 'Ask Any Product Question - Query our sample equipment catalog instantly' },
  { icon: DollarSign, text: 'Check Pricing & Availability - Look up prices, lead times, configurations' },
  { icon: Target, text: 'Competitive Comparisons - See how our sample products stack up vs competitors' },
  { icon: BarChart3, text: 'Pipeline Preview - See what CRM integration looks like (preview mode)' },
  { icon: Mic, text: 'Try Voice Commands - Experience voice CRM updates (demo mode)' },
]

const sampleQueries = [
  "What's the spindle speed on the VM-50?",
  "How do we compare to Haas on accuracy?",
  "What's the price for VM-40 with probing?",
  "Show me my pipeline this month",
]

export default function DemoLandingPage() {
  return (
    <section className="bg-gradient-hero min-h-[calc(100vh-5rem)] py-16 lg:py-24">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              See AI for Sales in 60 Seconds
            </h1>
            <p className="text-lg text-slate-600 mb-8">
              Pre-loaded with sample equipment data. No signup hassle. Just explore.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <h2 className="font-semibold text-slate-900">What You&apos;ll Experience</h2>
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <feature.icon className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-600">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Sample Queries */}
            <div className="mb-8">
              <h2 className="font-semibold text-slate-900 mb-3">Try These Queries</h2>
              <div className="space-y-2">
                {sampleQueries.map((query, index) => (
                  <p key={index} className="text-slate-600 italic text-sm">
                    &ldquo;{query}&rdquo;
                  </p>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-4 bg-slate-100 rounded-lg">
              <p className="font-medium text-slate-900 mb-2">After the Demo</p>
              <p className="text-sm text-slate-600">
                <strong>Like what you see?</strong>{' '}
                <Link href="/signup/trial" className="text-primary-600 hover:underline">
                  Start a Document Trial
                </Link>{' '}
                with your own products, or{' '}
                <Link href="/signup/pilot" className="text-primary-600 hover:underline">
                  Request a Guided Pilot
                </Link>{' '}
                with full CRM integration.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:sticky lg:top-24">
            <Card padding="lg" variant="elevated">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Start Your Instant Demo
              </h2>
              <p className="text-slate-600 mb-6">
                Enter your email to get started. No credit card required.
              </p>
              <DemoSignupForm />
            </Card>
          </div>
        </div>
      </Container>
    </section>
  )
}
