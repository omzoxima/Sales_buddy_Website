import type { Metadata } from 'next'
import { SolutionSection, CTASection } from '@/components/sections'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Features',
  description: 'Discover how SalesBuddy AI helps your sales team with instant product answers, pipeline intelligence, and voice CRM updates.',
}

export default function FeaturesPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-hero py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Everything Your Sales Team Needs
            </h1>
            <p className="text-lg text-slate-600">
              From instant product answers to CRM automation, SalesBuddy has you covered.
            </p>
          </div>
        </Container>
      </section>

      {/* Features */}
      <SolutionSection />

      {/* CTA */}
      <CTASection />
    </>
  )
}
