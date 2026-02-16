'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Play, Pause, X } from 'lucide-react'
import { Button, Container } from '@/components/ui'
import { HERO } from '@/lib/constants'

export function Hero() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Link href="/signup/demo">
                <Button size="lg" className="w-full sm:w-auto">
                  {HERO.primaryCta} →
                </Button>
              </Link>
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

            {/* Trust Text */}
            <p className="text-sm text-slate-500">
              {HERO.trustText}
            </p>
          </div>

          {/* Hero Video */}
          <div className="mt-12 lg:mt-16 max-w-5xl mx-auto">
            <div
              className="relative rounded-xl overflow-hidden border border-slate-200 shadow-lg cursor-pointer group"
              onClick={handlePlayInline}
            >
              <video
                ref={videoRef}
                src="/Enterprise AI Demo 1.mp4"
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
            <video
              ref={modalVideoRef}
              src="/Enterprise AI Demo 1.mp4"
              className="w-full rounded-xl"
              controls
              autoPlay
              playsInline
            />
          </div>
        </div>
      )}
    </>
  )
}
