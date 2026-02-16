import Image from 'next/image'
import { MessageSquare, Lightbulb, Mic, Mail, LucideIcon } from 'lucide-react'
import { Container, Badge } from '@/components/ui'
import { FEATURES } from '@/lib/constants'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  Lightbulb,
  Mic,
  Mail,
}

const featureImages: Record<string, string> = {
  ask: '/feature-ask.svg',
  know: '/feature-know.svg',
  act: '/feature-act.svg',
  respond: '/feature-respond.svg',
}

export function SolutionSection() {
  return (
    <section className="section-padding bg-white">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary-600 font-medium text-sm tracking-wide mb-3">
            THE SOLUTION
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Your Team&apos;s AI Knowledge Partner
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            SalesBuddy combines your product knowledge with CRM intelligence to make every rep your best rep.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-16 lg:space-y-24">
          {FEATURES.map((feature, index) => {
            const Icon = iconMap[feature.icon]
            const isReversed = index % 2 === 1

            return (
              <div
                key={feature.id}
                className={cn(
                  'flex flex-col lg:flex-row gap-8 lg:gap-16 items-center',
                  isReversed && 'lg:flex-row-reverse'
                )}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', feature.color)}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-500 tracking-wide">
                      {feature.label}
                    </span>
                    {feature.requiresCrm && (
                      <Badge variant="default" size="sm">Requires CRM</Badge>
                    )}
                  </div>

                  <h3 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-lg text-slate-600 mb-6">
                    {feature.description}
                  </p>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-500">Try asking:</p>
                    {feature.examples.map((example, i) => (
                      <p key={i} className="text-sm text-slate-600 italic">
                        &ldquo;{example}&rdquo;
                      </p>
                    ))}
                  </div>
                </div>

                {/* Feature Image */}
                <div className="flex-1 w-full">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-slate-200">
                    <Image
                      src={featureImages[feature.id]}
                      alt={`${feature.title} - ${feature.label} feature`}
                      width={600}
                      height={450}
                      className="w-full h-auto"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
