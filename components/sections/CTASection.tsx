'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
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
  const [demoActive, setDemoActive] = useState(false)
  const [showDemoMsg, setShowDemoMsg] = useState(false)

  // Check if demo is already active
  useEffect(() => {
    const cookieEmail = document.cookie
      .split(';')
      .map(c => c.trim().split('='))
      .find(([key]) => key === 'demo_session')?.[1]

    if (!cookieEmail) return
    const email = decodeURIComponent(cookieEmail)

    fetch(`/api/demo/session?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.active) {
          setDemoActive(true)
        }
      })
      .catch(() => { })
  }, [])

  const handleDemoClick = (e: React.MouseEvent) => {
    if (demoActive) {
      e.preventDefault()
      setShowDemoMsg(true)
      setTimeout(() => setShowDemoMsg(false), 4000)
    }
  }

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
            <Link href={primaryHref} onClick={handleDemoClick}>
              <Button
                size="lg"
                className={`w-full sm:w-auto transition-all duration-300 ${demoActive
                    ? 'opacity-50 cursor-not-allowed !bg-slate-500 !shadow-none'
                    : ''
                  }`}
              >
                {demoActive && <CheckCircle className="w-4 h-4 mr-2" />}
                {primaryCta}
              </Button>
            </Link>
            <Link href={secondaryHref}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                {secondaryCta}
              </Button>
            </Link>
          </div>

          {/* Demo active message */}
          {showDemoMsg && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full px-5 py-2 text-sm font-medium mt-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              Your demo is already active! Use the <strong>Live Agent</strong> button in the header.
            </div>
          )}

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
