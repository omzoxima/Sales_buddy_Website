"use client"

import { Container } from '@/components/ui'
import { Link2, Sparkles, Zap, Check } from 'lucide-react'

const STAGES = [
    {
        day: "Day 1",
        title: "Connect",
        icon: Link2,
        color: "blue",
        description: "We plug into your CRM and ERP. IT approves in a day. All systems connected — Prep, Sell, Close & Flow work seamless."
    },
    {
        day: "Day 2–3",
        title: "Enhance",
        icon: Sparkles,
        color: "emerald",
        description: "Your product catalogs, pricing, playbooks, and docs loaded into the AI layer. Salezx learns your products, your processes, your language."
    },
    {
        day: "Day 4–5",
        title: "Enrich",
        icon: Zap,
        color: "orange",
        description: "Your team starts talking to Salezx. Refinement and optimization based on real usage. If they can text, they can use it."
    }
]

export const SpeedSection = () => {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Visible Section Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />
            <Container size="full" className="px-4">
                <div className="max-w-4xl mx-auto text-center mb-20 px-4">
                    <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight uppercase">
                        SPEED
                    </h2>
                    <p className="text-2xl sm:text-3xl text-blue-600 font-bold mb-8">
                        Day 1: Connected. Day 5: Live.
                    </p>
                    <p className="text-xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
                        MVP working with your data in 1–2 days. Not 6 months. Not a rip-and-replace.
                        Sits on top of what you already have.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative">
                    {/* TIMELINE LINE */}
                    <div className="absolute top-[4.5rem] left-[10%] right-[10%] h-1 bg-slate-100 hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-emerald-500 to-orange-500 rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                        {STAGES.map((stage, idx) => (
                            <div key={idx} className="relative flex flex-col items-center group">
                                {/* ICON & DAY CIRCLE */}
                                <div className="mb-8 relative z-10">
                                    <div className={`w-36 h-36 rounded-full bg-white border-8 ${stage.color === 'blue' ? 'border-blue-50' :
                                        stage.color === 'emerald' ? 'border-emerald-50' : 'border-orange-50'
                                        } shadow-xl flex flex-col items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
                                        <stage.icon className={`w-10 h-10 mb-2 ${stage.color === 'blue' ? 'text-blue-500' :
                                            stage.color === 'emerald' ? 'text-emerald-500' : 'text-orange-500'
                                            }`} />
                                        <span className={`text-sm font-bold uppercase tracking-wider ${stage.color === 'blue' ? 'text-blue-600' :
                                            stage.color === 'emerald' ? 'text-emerald-600' : 'text-orange-600'
                                            }`}>
                                            {stage.day}
                                        </span>
                                    </div>

                                    {/* SEPARATOR DOT ON LINE */}
                                    <div className={`absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-sm hidden md:block ${stage.color === 'blue' ? 'bg-blue-500' :
                                        stage.color === 'emerald' ? 'bg-emerald-500' : 'bg-orange-500'
                                        }`} />
                                </div>

                                {/* CONTENT */}
                                <div className="text-center md:px-4">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">
                                        {stage.title}
                                    </h3>
                                    <p className="text-lg text-slate-600 leading-relaxed font-medium">
                                        {stage.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </section>
    )
}
