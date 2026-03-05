"use client"

import { Container, Button } from '@/components/ui'
import { Timer, ShieldCheck, Rocket, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export const OfferSection = () => {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden">
            {/* Visible Section Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />

            <Container size="full" className="px-4">
                <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 uppercase tracking-tight">
                        The Offer
                    </h2>
                    <p className="text-xl sm:text-2xl text-blue-600 font-bold">
                        See Salezx work with your data. In 48 hours.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
                    {/* 48-Hour Proof */}
                    <div className="group p-8 rounded-[2.5rem] bg-white border-2 border-blue-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Timer className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">48-Hour Proof</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            We connect your CRM and show you Salezx working with <strong className="text-blue-600">YOUR data</strong>.
                            Not a generic demo — your accounts, your products, your pipeline, your team.
                            You'll see your reps' actual workflow transformed.
                        </p>
                    </div>

                    {/* 45-Day Guarantee */}
                    <div className="group p-8 rounded-[2.5rem] bg-white border-2 border-emerald-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">45-Day Guarantee</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            If your team doesn't adopt it in 45 days, <strong className="text-emerald-600">you owe nothing</strong>.
                            We take the risk because we've seen what happens when teams start using it.
                            Adoption isn't the challenge — getting people to stop is.
                        </p>
                    </div>

                    {/* This Quarter */}
                    <div className="group p-8 rounded-[2.5rem] bg-white border-2 border-orange-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                            <Rocket className="w-8 h-8 text-orange-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">This Quarter</h3>
                        <p className="text-slate-600 leading-relaxed font-medium">
                            We're running <strong className="text-orange-600">limited pilots</strong> for equipment and manufacturing sales teams.
                            If this conversation makes sense, we can start this week.
                        </p>
                    </div>
                </div>

                {/* CTA BOX */}
                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-6 px-8 py-6 rounded-3xl bg-white border-2 border-rose-100 shadow-lg">
                        <p className="text-xl font-bold text-slate-700">
                            Start your 48-hour proof —
                        </p>
                        <Link href="/contact">
                            <Button size="lg" className="bg-[#ff5a5f] hover:bg-[#ff4449] text-white px-10 py-6 text-lg font-bold rounded-2xl shadow-lg shadow-rose-200 uppercase tracking-wider group">
                                Contact Us
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </Container>
        </section>
    )
}
