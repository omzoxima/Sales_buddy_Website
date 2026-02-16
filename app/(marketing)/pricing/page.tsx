import type { Metadata } from 'next'
import Link from 'next/link'
import { Check } from 'lucide-react'
import { Container, Button, Card, Badge } from '@/components/ui'
import { TrialOptions, FAQSection, CTASection } from '@/components/sections'
import { PRICING_PLANS, PRICING_FAQ } from '@/lib/constants'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing for SalesBuddy AI. Start free, upgrade when ready.',
}

export default function PricingPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-hero py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-slate-600">
              Start free. Upgrade when you&apos;re ready for more.
            </p>
          </div>
        </Container>
      </section>

      {/* Trial Options */}
      <TrialOptions />

      {/* Paid Plans */}
      <section className="section-padding bg-slate-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Paid Plans</h2>
            <p className="text-lg text-slate-600">For teams ready to deploy</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {PRICING_PLANS.map((plan) => (
              <Card
                key={plan.name}
                className={cn(
                  'relative flex flex-col transition-all duration-200 hover:shadow-lg hover:border-primary-500 hover:scale-[1.02] cursor-pointer',
                  plan.featured && 'border-2 border-primary-100'
                )}
                padding="lg"
              >
                {plan.featured && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    MOST POPULAR
                  </Badge>
                )}

                <div className="mb-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <div className="mb-2">
                    {plan.price.monthly ? (
                      <>
                        <span className="text-4xl font-bold text-slate-900">
                          ${plan.price.monthly.toLocaleString()}
                        </span>
                        <span className="text-slate-600">/month</span>
                      </>
                    ) : (
                      <span className="text-4xl font-bold text-slate-900">Custom</span>
                    )}
                  </div>
                  {plan.perUser && (
                    <p className="text-sm text-slate-500">
                      ${plan.perUser} per user/month
                    </p>
                  )}
                  <p className="text-slate-600 mt-2">{plan.description}</p>
                  <p className="text-sm font-medium text-slate-700 mt-2">{plan.userLimit}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={plan.href}>
                  <Button
                    variant={plan.featured ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <FAQSection faqs={PRICING_FAQ} />

      {/* Bottom CTA */}
      <section className="py-16 bg-slate-50">
        <Container>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Not sure which plan is right for you?
            </h3>
            <p className="text-slate-600 mb-6">
              Start with a free trial or talk to our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup/trial">
                <Button>Start Free Trial</Button>
              </Link>
              <Link href="/signup/pilot">
                <Button variant="outline">Talk to Sales</Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
