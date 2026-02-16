import Link from 'next/link'
import { Button, Container } from '@/components/ui'

interface CTASectionProps {
  title?: string
  subtitle?: string
  primaryCta?: string
  primaryHref?: string
  secondaryCta?: string
  secondaryHref?: string
}

export function CTASection({
  title = 'Ready to Give Your Sales Team Superpowers?',
  subtitle = 'Start with a free trial. See results in your first week.',
  primaryCta = 'Try Instant Demo',
  primaryHref = '/signup/demo',
  secondaryCta = 'Start Free Trial',
  secondaryHref = '/signup/trial',
}: CTASectionProps) {
  return (
    <section className="bg-gradient-cta py-16 lg:py-24">
      <Container>
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={primaryHref}>
              <Button size="lg" className="w-full sm:w-auto">
                {primaryCta}
              </Button>
            </Link>
            <Link href={secondaryHref}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                {secondaryCta}
              </Button>
            </Link>
          </div>
          
          <Link 
            href="/signup/pilot" 
            className="inline-block mt-6 text-slate-400 hover:text-white transition-colors"
          >
            Or request a guided pilot →
          </Link>
        </div>
      </Container>
    </section>
  )
}
