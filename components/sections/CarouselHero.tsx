'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Play, X, CheckCircle, ChevronLeft, ChevronRight, Sparkles, Bot } from 'lucide-react'
import { Button, Container } from '@/components/ui'

const CAROUSEL_LINES = [
    "Your customers expect your team to know everything.",
    "Your management expects CRM to always be right.",
    "Your reps expect to actually sell — not search, copy, and update.",
]

export function CarouselHero() {
    const rawVideoUrl = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || '/demo-video.mp4';
    const isEmbed = rawVideoUrl.includes('sharepoint.com') || rawVideoUrl.includes('youtube.com') || rawVideoUrl.includes('onedrive');
    let videoSrc = rawVideoUrl.replace('stream.aspx', 'embed.aspx').replace('&download=1', '&action=embedview');
    const ytMatch = videoSrc.match(/youtube\.com\/watch\?v=([^&]+)/);
    if (ytMatch) videoSrc = `https://www.youtube.com/embed/${ytMatch[1]}`;

    const [currentSlide, setCurrentSlide] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [demoActive, setDemoActive] = useState(false)
    const [trialActive, setTrialActive] = useState(false)
    const [showDemoMsg, setShowDemoMsg] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)

    const videoRef = useRef<HTMLVideoElement>(null)
    const modalVideoRef = useRef<HTMLVideoElement>(null)

    // Fetch user status
    useEffect(() => {
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null
        if (!userEmail) return

        fetch(`/api/user/dashboard?email=${encodeURIComponent(userEmail)}`)
            .then(res => res.json())
            .then(data => {
                if (data.trial?.registered) {
                    if (data.trial.active) setTrialActive(true)
                } else if (data.demo?.active) {
                    setDemoActive(true)
                }
            })
            .catch(() => { })
    }, [])

    const nextSlide = useCallback(() => {
        if (isAnimating) return
        setIsAnimating(true)
        setTimeout(() => {
            setCurrentSlide((prev) => (prev + 1) % CAROUSEL_LINES.length)
            setIsAnimating(false)
        }, 600)
    }, [isAnimating])

    const prevSlide = useCallback(() => {
        if (isAnimating) return
        setIsAnimating(true)
        setTimeout(() => {
            setCurrentSlide((prev) => (prev - 1 + CAROUSEL_LINES.length) % CAROUSEL_LINES.length)
            setIsAnimating(false)
        }, 600)
    }, [isAnimating])

    useEffect(() => {
        const timer = setInterval(nextSlide, 6000)
        return () => clearInterval(timer)
    }, [nextSlide])

    const handlePlayInline = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const handleWatchDemo = () => {
        setShowModal(true)
        setTimeout(() => {
            if (modalVideoRef.current) {
                modalVideoRef.current.play()
            }
        }, 100)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        if (modalVideoRef.current) {
            modalVideoRef.current.pause()
        }
    }

    const handleDemoClick = (e: React.MouseEvent) => {
        if (demoActive || trialActive) {
            e.preventDefault()
            setShowDemoMsg(true)
            setTimeout(() => setShowDemoMsg(false), 4000)
        }
    }

    return (
        <>
            <section className="relative w-full overflow-hidden bg-white">
                {/* SOOTHING BLUE CAROUSEL BANNER - 3D DEPTH ENHANCED */}
                <div className="relative h-[360px] sm:h-[440px] w-full flex items-center justify-center bg-slate-800 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] z-20">
                    {/* 3D Inner Bottom Depth */}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/40 to-transparent z-[5]" />

                    {/* 3D Top Edge Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-white/10 z-[5]" />
                    {/* Background Image - More visible with subtle blur */}
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-60 blur-[2px]"
                        style={{ backgroundImage: 'url("/carousel-hero-bg.webp")' }}
                    />
                    {/* Dark overlay for contrast */}
                    <div className="absolute inset-0 bg-slate-900/50" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/20" />

                    <Container className="relative z-10">
                        <div className="w-full flex items-center justify-between">
                            {/* Left Arrow */}
                            <button
                                onClick={prevSlide}
                                className="group p-3 rounded-full bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hidden sm:flex items-center justify-center backdrop-blur-sm"
                                aria-label="Previous slide"
                            >
                                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                            </button>

                            {/* Animated Text Section */}
                            <div className="flex-1 text-center py-10 px-6 sm:px-12">
                                <div className={`transition-all duration-700 ease-in-out transform ${isAnimating ? 'opacity-0 translate-y-4 filter blur-md scale-95' : 'opacity-100 translate-y-0 filter blur-0 scale-100'}`}>
                                    <div className="flex justify-center mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg transition-transform duration-500">
                                            <Sparkles className="w-7 h-7 text-blue-100 animate-pulse" />
                                        </div>
                                    </div>
                                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-[1.2] tracking-tight text-balance drop-shadow-sm">
                                        {CAROUSEL_LINES[currentSlide]}
                                    </h2>
                                </div>
                            </div>

                            {/* Right Arrow */}
                            <button
                                onClick={nextSlide}
                                className="group p-3 rounded-full bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 hover:border-white/30 transition-all duration-300 hidden sm:flex items-center justify-center backdrop-blur-sm"
                                aria-label="Next slide"
                            >
                                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {/* Pagination Dots */}
                        <div className="flex justify-center gap-3 mt-8">
                            {CAROUSEL_LINES.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        if (isAnimating) return;
                                        setIsAnimating(true);
                                        setTimeout(() => {
                                            setCurrentSlide(i);
                                            setIsAnimating(false);
                                        }, 400);
                                    }}
                                    className={`h-1.5 transition-all duration-500 rounded-full ${currentSlide === i ? 'w-8 bg-white' : 'w-2 bg-white/30 hover:bg-white/50'}`}
                                />
                            ))}
                        </div>

                        {/* Mobile Controls */}
                        <div className="flex justify-center gap-6 mt-10 sm:hidden">
                            <button onClick={prevSlide} className="p-3 rounded-full bg-slate-100 border border-slate-200 text-slate-600 active:scale-95 transition-transform"><ChevronLeft /></button>
                            <button onClick={nextSlide} className="p-3 rounded-full bg-slate-100 border border-slate-200 text-slate-600 active:scale-95 transition-transform"><ChevronRight /></button>
                        </div>
                    </Container>
                </div>

                {/* LIGHT CONTENT AREA (OUTSIDE CAROUSEL) - EXTREME WIDTH */}
                <div className="relative bg-white pt-12 pb-12 z-10">
                    {/* 3D "Lip" Divider - Adds physical separation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-slate-200 to-transparent opacity-50" />
                    {/* Visible Section Divider */}
                    <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />
                    <Container size="full" className="px-1 sm:px-4">
                        <div className="w-full text-center px-4">
                            {/* Product Subline - Dark Text on Light BG - EXTREME SPAN */}
                            <div className="w-full">
                                <p className="text-lg sm:text-xl lg:text-2xl text-slate-700 font-medium leading-relaxed mb-6 px-2 text-center">
                                    <span className="text-slate-900 font-bold inline-flex items-center gap-2">
                                        <Bot className="w-6 h-6 text-blue-600" /> Salezx
                                    </span> connects your CRM, ERP, and product knowledge into one <span className="text-blue-600 border-b-2 border-blue-500/20 pb-1">AI conversation</span>. Your reps just talk to it. <strong className="text-slate-900 font-semibold">Live in 1 week</strong> on top of your existing systems.
                                </p>
                            </div>
                            {/* Inline Video CTA Section - Extreme Wide Heading */}
                            <div className="w-full text-center mt-12 mb-8">
                                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 uppercase tracking-tighter w-full">
                                    See it with your <span className="text-blue-600">data</span> — in 48 hours
                                </h3>
                            </div>

                            {/* Video Player Section - Simple Layout */}
                            <div className="mt-12 max-w-5xl mx-auto">
                                <div className="relative rounded-[2rem] overflow-hidden bg-white aspect-video border border-slate-200 shadow-2xl">
                                    {isEmbed ? (
                                        <iframe src={videoSrc} title="Salezx in Action" className="w-full h-full border-0" allow="autoplay; fullscreen" allowFullScreen />
                                    ) : (
                                        <div className="relative w-full h-full cursor-pointer" onClick={handlePlayInline}>
                                            <video ref={videoRef} src={videoSrc} className="w-full h-full object-cover" playsInline onEnded={() => setIsPlaying(false)} preload="metadata" />
                                            {!isPlaying && (
                                                <div className="absolute inset-0 bg-slate-900/10 flex items-center justify-center transition-opacity group-hover:bg-slate-900/20">
                                                    <div className="w-28 h-28 bg-white/90 backdrop-blur-xl rounded-full border border-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:border-blue-600 transition-all duration-500">
                                                        <Play className="w-12 h-12 text-blue-600 fill-blue-600 translate-x-1" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Container>
                </div>
            </section>

            {/* Video Modal - Light Theme Adaptation */}
            {showModal && (
                <div className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-4" onClick={handleCloseModal}>
                    <div className="relative w-full max-w-5xl animate-modal-pop" onClick={(e) => e.stopPropagation()}>
                        <button onClick={handleCloseModal} className="absolute -top-16 right-0 text-white/50 hover:text-white transition-all hover:rotate-90 p-2" aria-label="Close video">
                            <X className="w-10 h-10" />
                        </button>
                        <div className="w-full rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/10" style={{ aspectRatio: '16/9' }}>
                            {isEmbed ? (
                                <iframe src={videoSrc} className="w-full h-full border-0" allow="autoplay; fullscreen" allowFullScreen />
                            ) : (
                                <video ref={modalVideoRef} src={videoSrc} className="w-full h-full" controls autoPlay playsInline />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
        @keyframes slow-zoom {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, -20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes modal-pop {
          from { opacity: 0; scale: 0.95; }
          to { opacity: 1; scale: 1; }
        }
        .animate-slow-zoom { animation: slow-zoom 20s infinite ease-in-out; }
        .animate-bounce-slow { animation: bounce-slow 6s infinite ease-in-out; }
        .animate-modal-pop { animation: modal-pop 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
        </>
    )
}
