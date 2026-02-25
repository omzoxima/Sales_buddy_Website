'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Lock } from 'lucide-react'
import { Container, Button } from '@/components/ui'

export function PricingBottomCTA() {
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
                        {trialActive ? (
                            <Button
                                className="opacity-50 cursor-not-allowed !bg-slate-400 !shadow-none"
                                disabled
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Trial Active
                            </Button>
                        ) : (
                            <Link href="/signup/trial">
                                <Button>Start Free Trial</Button>
                            </Link>
                        )}
                        <Link href="/signup/pilot">
                            <Button variant="outline">Talk to Sales</Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    )
}
