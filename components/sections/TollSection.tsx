'use client'

import { useState, useEffect, useCallback } from 'react'
import { Container } from '@/components/ui'
import { cn } from '@/lib/utils'

const TOLL_SLIDES = [
    "Prep for the big meeting — skip the CRM update.",
    "Chase the hot deal — the trade show lead dies on a napkin.",
    "Send the quote — forget the follow-up.",
    "Service tech hears about expansion — tells nobody."
]

export function TollSection() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isAnimating, setIsAnimating] = useState(false)

    const nextSlide = useCallback(() => {
        if (isAnimating) return
        setIsAnimating(true)
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % TOLL_SLIDES.length)
            setIsAnimating(false)
        }, 600)
    }, [isAnimating])

    useEffect(() => {
        const timer = setInterval(nextSlide, 4500)
        return () => clearInterval(timer)
    }, [nextSlide])

    return (
        <section className="pt-16 pb-12 bg-white relative overflow-hidden">
            {/* Visible Section Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />
            <Container size="full" className="px-1 sm:px-4">
                <div className="w-full mx-auto">
                    {/* Header - Explicitly Centered with non-colliding animation */}
                    <div className="text-center mb-10 animate-sectionFade">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 uppercase tracking-tight">
                            The Toll
                        </h2>
                        <p className="text-lg sm:text-xl text-slate-600 font-medium italic">
                            Your reps make tradeoffs every day.
                        </p>
                    </div>

                    {/* Soothing Blue Carousel Area - MAXIMIZED WIDTH */}
                    <div className="relative mb-16 group">
                        {/* 3D Shadow Beneath Card */}
                        <div className="absolute -bottom-3 left-4 right-4 h-full rounded-[3rem] bg-slate-900/20 blur-xl" />
                        <div
                            className="relative h-64 sm:h-72 w-full flex items-center justify-center overflow-hidden rounded-[3rem] bg-slate-800 border border-white/10 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.5),0_4px_20px_-4px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-[1.01] group-hover:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.6)]" style={{ transform: 'perspective(1200px) rotateX(1deg)' }}>
                            {/* Background Image - less blurry, more visible */}
                            <div
                                className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 scale-110 animate-slow-zoom"
                                style={{ backgroundImage: 'url("/toll-carousel-bg.png")' }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
                            {/* 3D Top Highlight */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                            {/* 3D Inner Top Glow */}
                            <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/8 to-transparent" />
                            {/* 3D Bottom Shadow Depth */}
                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/40 to-transparent" />

                            <div className="relative z-10 w-full px-8 sm:px-16 text-center">
                                <div
                                    className={cn(
                                        "transition-all duration-[600ms] ease-out transform",
                                        isAnimating ? "opacity-0 translate-y-4 filter blur-md scale-95" : "opacity-100 translate-y-0 filter blur-0 scale-100"
                                    )}
                                >
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white leading-tight drop-shadow-sm">
                                        {TOLL_SLIDES[currentSlide]}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Results Area - MAXIMIZED SPAN */}
                    <div className="text-center space-y-8 animate-sectionFade" style={{ animationDelay: '400ms' }}>
                        <div className="w-full mx-auto">
                            <p className="text-xl sm:text-2xl lg:text-3xl font-black text-rose-600 tracking-tight leading-tight">
                                The Result - Missed targets. Limited growth. More cost for the same revenue.
                            </p>
                        </div>

                        <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-[100rem] mx-auto leading-relaxed italic">
                            "And the frustrating feeling that your team is working hard — but the system is working against them."
                        </p>
                    </div>

                    {/* Progress Indicators */}
                    <div className="flex justify-center gap-2 mt-16">
                        {TOLL_SLIDES.map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-1 px-4 rounded-full transition-all duration-500",
                                    currentSlide === i ? "bg-rose-500 w-12" : "bg-slate-100 w-4"
                                )}
                            />
                        ))}
                    </div>
                </div>
            </Container>

            <style jsx global>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes sectionFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slow-zoom { animation: slow-zoom 20s infinite ease-in-out; }
        .animate-sectionFade { animation: sectionFade 0.8s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>
        </section>
    )
}
