'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Play, Pause, X, CheckCircle, Lock } from 'lucide-react'
import { Button, Container } from '@/components/ui'
import { HERO } from '@/lib/constants'

export function Hero() {
  const rawVideoUrl = process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || '/demo-video.mp4';
  const isEmbed = rawVideoUrl.includes('sharepoint.com') || rawVideoUrl.includes('youtube.com') || rawVideoUrl.includes('onedrive');
  // Auto-convert YouTube watch URLs → embed URLs, and SharePoint stream → embed
  let videoSrc = rawVideoUrl.replace('stream.aspx', 'embed.aspx').replace('&download=1', '&action=embedview');
  const ytMatch = videoSrc.match(/youtube\.com\/watch\?v=([^&]+)/);
  if (ytMatch) videoSrc = `https://www.youtube.com/embed/${ytMatch[1]}`;

  const [isPlaying, setIsPlaying] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [demoActive, setDemoActive] = useState(false)
  const [trialActive, setTrialActive] = useState(false)
  const [demoExpired, setDemoExpired] = useState(false)
  const [showDemoMsg, setShowDemoMsg] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)

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
          if (data.trial.active) setTrialActive(true)
        } else if (data.demo?.active) {
          setDemoActive(true)
        } else if (data.demo?.expired) {
          setDemoActive(false)
          setDemoExpired(true)
        } else {
          setDemoActive(false)
        }
      })
      .catch(() => { })
  }, [])

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
      <section className="bg-gradient-hero py-16 lg:py-24">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            {/* Overline */}
            <p className="text-primary-600 font-medium text-sm tracking-wide mb-4">
              {HERO.overline}
            </p>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 text-balance">
              {HERO.headline}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              {HERO.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <div className="relative">
                <Link
                  href={trialActive ? "/dashboard" : "/signup/demo"}
                  onClick={handleDemoClick}
                >
                  <Button
                    size="lg"
                    className={`w-full sm:w-auto transition-all duration-300 ${demoActive || trialActive
                      ? 'opacity-50 cursor-not-allowed !bg-slate-400 !shadow-none'
                      : ''
                      }`}
                  >
                    {demoActive && <CheckCircle className="w-4 h-4 mr-2" />}
                    {trialActive && <Lock className="w-4 h-4 mr-2" />}
                    {trialActive ? 'View Dashboard' : HERO.primaryCta} →
                  </Button>
                </Link>
              </div>
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto"
                onClick={handleWatchDemo}
              >
                <Play className="w-5 h-5 mr-2" />
                {HERO.secondaryCta}
              </Button>
            </div>

            {/* Demo already active message */}
            {showDemoMsg && (
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-5 py-2 text-sm font-medium mb-4 animate-fadeIn">
                {trialActive ? (
                  <><CheckCircle className="w-4 h-4" /> Your Trial is active! Demo access is restricted.</>
                ) : (
                  <><CheckCircle className="w-4 h-4" /> Your demo is already active! Use the <strong className="text-emerald-800">Live Agent</strong> button in the header.</>
                )}
              </div>
            )}

            {/* Trust Text */}
            <p className="text-sm text-slate-500">
              {HERO.trustText}
            </p>
          </div>

          {/* Hero Video */}
          <div className="mt-12 lg:mt-16 max-w-5xl mx-auto">
            {isEmbed ? (
              <div
                className="relative rounded-xl overflow-hidden shadow-2xl bg-black"
                style={{ aspectRatio: '16/9' }}
              >
                <iframe
                  src={videoSrc}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : (
              <div
                className="relative rounded-xl overflow-hidden border border-slate-200 shadow-lg cursor-pointer group"
                onClick={handlePlayInline}
              >
                <video
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full aspect-video object-cover"
                  playsInline
                  onEnded={() => setIsPlaying(false)}
                  preload="metadata"
                />
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity group-hover:bg-black/30">
                    <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-8 h-8 text-primary-600 ml-1" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Video Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>
            {isEmbed ? (
              <div className="w-full rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={videoSrc}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              </div>
            ) : (
              <video
                ref={modalVideoRef}
                src={videoSrc}
                className="w-full rounded-xl"
                controls
                autoPlay
                playsInline
              />
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </>
  )
}
