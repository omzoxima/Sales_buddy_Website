'use client'

import { useState } from 'react'
import { Users, BarChart3, User, CheckCircle2 } from 'lucide-react'
import { Container } from '@/components/ui'
import { cn } from '@/lib/utils'

const EXPECTATIONS = [
    {
        id: 'customers',
        title: 'YOUR CUSTOMERS EXPECT',
        icon: Users,
        accent: 'coral',
        colorClass: 'bg-rose-500',
        lightColorClass: 'bg-rose-50',
        darkTextColor: 'text-rose-950',
        iconColor: 'text-rose-600',
        borderColor: 'border-rose-100',
        shadowColor: 'hover:shadow-rose-100/50',
        points: [
            'Know my products — specs, pricing, lead times',
            'Remember my history — past orders, service issues, conversations',
            'Respond instantly — don’t make me wait while you “check with someone”',
            'Follow up when you say you will'
        ]
    },
    {
        id: 'management',
        title: 'YOUR MANAGEMENT EXPECTS',
        icon: BarChart3,
        accent: 'orange',
        colorClass: 'bg-orange-500',
        lightColorClass: 'bg-orange-50',
        darkTextColor: 'text-orange-950',
        iconColor: 'text-orange-600',
        borderColor: 'border-orange-100',
        shadowColor: 'hover:shadow-orange-100/50',
        points: [
            'CRM updated after every interaction',
            'Pipeline that reflects reality',
            'Accurate forecasts they can plan around',
            'Visibility into what the team is actually doing'
        ]
    },
    {
        id: 'reps',
        title: 'YOUR REPS WANT',
        icon: User,
        accent: 'blue',
        colorClass: 'bg-blue-500',
        lightColorClass: 'bg-blue-50',
        darkTextColor: 'text-blue-950',
        iconColor: 'text-blue-600',
        borderColor: 'border-blue-100',
        shadowColor: 'hover:shadow-blue-100/50',
        points: [
            'No lead left unattended — every opportunity captured',
            'Quotes out fast before the competitor',
            'Walk into every meeting prepared',
            'Not miss the cross-sell or upsell sitting right in front of them'
        ]
    }
]

export function ExpectationsSection() {
    const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({})

    const toggleFlip = (id: string) => {
        setFlippedCards(prev => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    return (
        <section id="expectations" className="pt-16 pb-8 bg-white relative overflow-hidden">
            {/* Visible Section Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />
            <Container>
                <div className="text-center mb-12 animate-sectionFade flex flex-col items-center">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 uppercase tracking-tight max-w-[100rem]">
                        The Expectations
                    </h2>
                </div>

                {/* Cards Grid - FULL SCREEN WIDTH */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-[95rem] mx-auto group/grid">
                    {EXPECTATIONS.map((item) => {
                        const Icon = item.icon
                        const isFlipped = flippedCards[item.id]

                        return (
                            <div
                                key={item.id}
                                className="group h-[480px] [perspective:2000px] cursor-pointer"
                                onClick={() => toggleFlip(item.id)}
                            >
                                <div
                                    className={cn(
                                        "relative w-full h-full transition-all duration-[800ms] [transform-style:preserve-3d]",
                                        isFlipped && "[transform:rotateY(180deg)]"
                                    )}
                                >
                                    {/* FRONT SIDE */}
                                    <div className={cn(
                                        "absolute inset-0 w-full h-full [backface-visibility:hidden] rounded-[3rem] bg-white border-[4px] p-12 flex flex-col items-center justify-center text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:border-transparent group-hover:scale-[1.03]",
                                        item.borderColor,
                                        item.shadowColor
                                    )}>
                                        {/* Floating Glow */}
                                        <div className={cn("absolute inset-0 w-full h-full rounded-[3rem] opacity-0 group-hover:opacity-10 transition-opacity duration-500", item.colorClass)} />

                                        <div className={cn(
                                            "w-28 h-28 rounded-[2rem] mb-10 flex items-center justify-center text-white shadow-2xl transition-all duration-500 group-hover:scale-110",
                                            item.colorClass
                                        )}>
                                            <Icon className="w-14 h-14" />
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tight">
                                            {item.title}
                                        </h3>

                                        <div className="mt-12 flex items-center gap-3 text-slate-400 font-black text-xs tracking-widest uppercase">
                                            <div className="w-6 h-[2px] bg-slate-200" />
                                            <span>See More</span>
                                            <div className="w-6 h-[2px] bg-slate-200" />
                                        </div>
                                    </div>

                                    {/* BACK SIDE (FLIPPED) */}
                                    <div className={cn(
                                        "absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[3rem] p-12 flex flex-col shadow-2xl border-[4px]",
                                        item.lightColorClass,
                                        item.borderColor
                                    )}>
                                        <div className="mb-10 flex items-center justify-between">
                                            <div className={cn("p-3 rounded-2xl bg-white shadow-sm", item.iconColor)}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                        </div>

                                        <div className="space-y-6 flex-1">
                                            {item.points.map((point, i) => (
                                                <div key={i} className="flex gap-4 items-start group/point animate-slideIn" style={{ animationDelay: `${i * 120}ms` }}>
                                                    <div className={cn("mt-1.5 p-1 rounded-full bg-white shadow-sm", item.iconColor)}>
                                                        <CheckCircle2 className="w-4 h-4" />
                                                    </div>
                                                    <p className={cn("text-lg font-bold leading-snug tracking-tight", item.darkTextColor)}>
                                                        {point}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-auto pt-6 border-t border-black/5 flex justify-center opacity-0">
                                            <div className="w-2 h-2 rounded-full bg-slate-200" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Container>

            <style jsx global>{`
        @keyframes sectionFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-sectionFade { animation: sectionFade 0.8s ease-out forwards; }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
        </section>
    )
}
