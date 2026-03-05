"use client"

import { Container } from '@/components/ui'

const PARTNERS = [
    { title: "Building Materials - 10B USD", border: "border-blue-400", bg: "bg-blue-50/50" },
    { title: "Healthcare - 1B USD", border: "border-emerald-400", bg: "bg-emerald-50/50" },
    { title: "FMCG - 3B USD", border: "border-purple-400", bg: "bg-purple-50/50" },
    { title: "Electric Products - 1B USD", border: "border-orange-400", bg: "bg-orange-50/50" },
    { title: "FMCG - 4B USD", border: "border-rose-400", bg: "bg-rose-50/50" },
    { title: "Fortune 500 — B2B", border: "border-indigo-400", bg: "bg-indigo-50/50" }
]

export const EnterpriseTestimonialSection = () => {
    return (
        <section className="py-20 bg-white relative overflow-hidden">
            {/* Visible Section Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />

            <Container size="full" className="px-4">
                <div className="max-w-6xl mx-auto text-center mb-10 px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8 uppercase tracking-tight">
                        Testimonial
                    </h2>
                    <div className="space-y-6">
                        <p className="text-xl sm:text-2xl text-slate-800 font-semibold leading-relaxed">
                            We work with enterprises on AI.
                        </p>
                        <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed italic">
                            We've built AI systems for sales and operations teams at some of the largest companies.
                            We've seen the same pattern — great teams held back by disconnected tools.
                        </p>
                    </div>
                </div>

                {/* CONTINUOUS MARQUEE SECTION */}
                <div className="relative w-full overflow-hidden py-6">
                    {/* Fade Edges for Professional Look */}
                    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" />
                    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" />

                    <div className="animate-marquee flex whitespace-nowrap gap-8">
                        {/* Duplicate lists for seamless loop */}
                        {[...PARTNERS, ...PARTNERS].map((partner, index) => (
                            <div
                                key={index}
                                className={`inline-flex items-center px-8 py-5 rounded-2xl border-2 ${partner.border} ${partner.bg} shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] transition-transform hover:scale-105 hover:-translate-y-1`}
                            >
                                <span className="text-slate-800 font-bold tracking-wide whitespace-nowrap sm:text-lg">
                                    {partner.title}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RED FOOTNOTE */}
                <div className="mt-8 text-center px-6">
                    <p className="text-lg sm:text-xl font-bold text-rose-600 max-w-[90vw] lg:max-w-none mx-auto leading-relaxed whitespace-nowrap overflow-hidden text-overflow-ellipsis">
                        Salezx exists because we believe your team's potential shouldn't be limited by your systems.
                    </p>
                </div>
            </Container>
        </section>
    )
}
