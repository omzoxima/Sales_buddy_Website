'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, CheckCircle, Lock } from 'lucide-react'
import { Button, Card, Badge, Container } from '@/components/ui'
import { TRIAL_OPTIONS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function TrialOptions() {
  const [trialActive, setTrialActive] = useState(false)
  const [trialExpired, setTrialExpired] = useState(false)

  // All status from DATABASE — localStorage for email identification
  useEffect(() => {
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null

    if (!userEmail) {
      setTrialActive(false)
      return
    }

    fetch(`/api/user/dashboard?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.trial?.active) {
          setTrialActive(true)
          setTrialExpired(false)
        } else if (data.trial?.expired) {
          setTrialActive(false)
          setTrialExpired(true)
        } else {
          setTrialActive(false)
        }
      })
      .catch(() => { })
  }, [])

  return (
    <section className="section-padding bg-white">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-primary-600 font-medium text-sm tracking-wide mb-3">
            GET STARTED
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Choose How You Want to Start
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            From instant exploration to full team deployment
          </p>
        </div>

        {/* Trial Option Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {TRIAL_OPTIONS.map((option) => {
            const isTrialOption = option.id === 'trial'
            const isDisabled = isTrialOption && trialActive

            return (
              <Card
                key={option.id}
                className={cn(
                  'relative flex flex-col transition-all duration-200 cursor-pointer',
                  isDisabled
                    ? 'opacity-60'
                    : 'hover:shadow-lg hover:border-primary-500 hover:scale-[1.02]'
                )}
                padding="lg"
              >
                {/* Badge */}
                <Badge
                  variant={option.color}
                  className="absolute -top-3 left-6"
                >
                  {isTrialOption && trialExpired ? '⏰ TRIAL EXPIRED' : isDisabled ? '✓ TRIAL ACTIVE' : option.badge}
                </Badge>

                {/* Icon & Title */}
                <div className="mb-4 pt-2">
                  <span className="text-4xl mb-3 block">{option.icon}</span>
                  <h3 className="text-xl font-bold text-slate-900">{option.title}</h3>
                </div>

                {/* Description */}
                <p className="text-slate-600 mb-6">{option.description}</p>

                {/* Features */}
                <ul className="space-y-3 mb-6 flex-1">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className={cn(
                        'w-5 h-5 flex-shrink-0 mt-0.5',
                        option.color === 'demo' && 'text-demo',
                        option.color === 'trial' && 'text-trial',
                        option.color === 'pilot' && 'text-pilot'
                      )} />
                      <span className="text-sm text-slate-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Details */}
                <p className="text-sm text-slate-500 mb-4">{option.details}</p>

                {/* CTA */}
                {isDisabled ? (
                  <Button
                    variant={option.color}
                    className="w-full opacity-50 cursor-not-allowed !shadow-none !bg-slate-400"
                    disabled
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Trial Active
                  </Button>
                ) : (
                  <Link href={option.href}>
                    <Button
                      variant={option.color}
                      className="w-full"
                    >
                      {option.cta} →
                    </Button>
                  </Link>
                )}
              </Card>
            )
          })}
        </div>

        {/* Compare Link */}
        <div className="text-center mt-8">
          <Link href="/pricing" className="text-primary-600 hover:text-primary-700 font-medium">
            Compare all options in detail →
          </Link>
        </div>
      </Container>
    </section>
  )
}
