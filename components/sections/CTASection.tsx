'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Lock } from 'lucide-react'
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
  const [trialActive, setTrialActive] = useState(false)
  const [trialExpired, setTrialExpired] = useState(false)
  const [demoExpired, setDemoExpired] = useState(false)
  const [showTrialMsg, setShowTrialMsg] = useState(false)

  // All status from DATABASE — localStorage for email identification
  useEffect(() => {
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null

    if (!userEmail) {
      setDemoActive(false)
      return
    }

    fetch(`/api/user/dashboard?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.trial?.registered) {
          setDemoActive(false)
          if (data.trial.active) {
            setTrialActive(true)
          } else if (data.trial.expired) {
            setTrialActive(false)
            setTrialExpired(true)
          }
        } else {
          setTrialActive(false)
          if (data.demo?.active) {
            setDemoActive(true)
          } else if (data.demo?.expired) {
            setDemoActive(false)
            setDemoExpired(true)
          } else {
            setDemoActive(false)
          }
        }
      })
      .catch(() => { })
  }, [])

  const handleDemoClick = (e: React.MouseEvent) => {
    if (demoActive || trialActive) {
      e.preventDefault()
      setShowDemoMsg(true)
      setTimeout(() => setShowDemoMsg(false), 4000)
    }
  }

  const handleTrialClick = (e: React.MouseEvent) => {
    if (trialActive) {
      e.preventDefault()
      setShowTrialMsg(true)
      setTimeout(() => setShowTrialMsg(false), 4000)
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
            <Link href={trialActive ? "/dashboard" : primaryHref} onClick={handleDemoClick}>
              <Button
                size="lg"
                className={`w-full sm:w-auto transition-all duration-300 ${demoActive || trialActive
                  ? 'opacity-50 cursor-not-allowed !bg-slate-500 !shadow-none'
                  : ''
                  }`}
              >
                {demoActive && <CheckCircle className="w-4 h-4 mr-2" />}
                {trialActive && <Lock className="w-4 h-4 mr-2" />}
                {trialActive ? 'View Dashboard' : primaryCta}
              </Button>
            </Link>
            <Link href={secondaryHref} onClick={handleTrialClick}>
              <Button
                variant="secondary"
                size="lg"
                className={`w-full sm:w-auto transition-all duration-300 ${trialActive
                  ? 'opacity-50 cursor-not-allowed !bg-slate-500/30 !border-slate-400/30 !shadow-none text-white/60'
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
              >
                {trialActive && <CheckCircle className="w-4 h-4 mr-2" />}
                {trialActive ? 'Trial Active' : secondaryCta}
              </Button>
            </Link>
          </div>

          {/* Demo active message */}
          {showDemoMsg && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full px-5 py-2 text-sm font-medium mt-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              {trialActive ? (
                <><CheckCircle className="w-4 h-4 text-emerald-400" /> Your Trial is active! Demo access is restricted.</>
              ) : (
                <><CheckCircle className="w-4 h-4 text-emerald-400" /> Your demo is already active! Use the <strong>Live Agent</strong> button in the header.</>
              )}
            </div>
          )}

          {showTrialMsg && (
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full px-5 py-2 text-sm font-medium mt-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Your free trial is already active! Check your email for credentials.
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
