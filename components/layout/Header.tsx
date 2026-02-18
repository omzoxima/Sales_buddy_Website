'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Zap } from 'lucide-react'
import { Button, Container } from '@/components/ui'
import { NAV_LINKS, NAV_RESOURCES, SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

// Read cookie synchronously to avoid flash
function getCookieEmail(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie
    .split(';')
    .map(c => c.trim().split('='))
    .find(([key]) => key === 'demo_session')
  return match?.[1] ? decodeURIComponent(match[1]) : null
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [demoEmail, setDemoEmail] = useState<string | null>(null)
  const [demoExpired, setDemoExpired] = useState(false)

  // Check session — read cookie first for instant state, then verify via API
  useEffect(() => {
    const email = getCookieEmail()
    if (!email) {
      setDemoEmail(null)
      return
    }
    // Set immediately from cookie (avoids flash)
    setDemoEmail(email)

    fetch(`/api/demo/session?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.active) {
          setDemoEmail(email)
        } else if (data.expired) {
          setDemoEmail(null)
          setDemoExpired(true)
        } else {
          setDemoEmail(null)
        }
      })
      .catch(() => { })
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <Container>
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt={SITE_CONFIG.name}
                width={140}
                height={40}
                className="h-8 lg:h-10 w-auto"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  onBlur={() => setTimeout(() => setResourcesOpen(false), 150)}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors"
                >
                  Resources
                  <ChevronDown className={cn('w-4 h-4 transition-transform', resourcesOpen && 'rotate-180')} />
                </button>

                {resourcesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 animate-slide-down">
                    {NAV_RESOURCES.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-4">
              {demoEmail && !demoExpired ? (
                <Link href={`/demo/agent?email=${encodeURIComponent(demoEmail)}`}>
                  <button className="live-agent-btn group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
                    {/* Pulsing ring */}
                    <span className="absolute inset-0 rounded-full animate-ping-slow bg-emerald-400/30" />
                    {/* Live dot */}
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                    </span>
                    <Zap className="w-4 h-4" />
                    <span>Live Agent</span>
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-slate-600 hover:text-slate-900 font-medium">
                    Login
                  </Link>
                  <Link href="/signup/demo">
                    <Button>Try Instant Demo</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </Container>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 animate-slide-down">
            <Container className="py-4">
              <div className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-slate-600 hover:text-slate-900 font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="border-t border-slate-200 pt-4 mt-2">
                  <p className="text-sm font-medium text-slate-500 mb-2">Resources</p>
                  {NAV_RESOURCES.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block text-slate-600 hover:text-slate-900 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 mt-2 flex flex-col gap-3">
                  {demoEmail && !demoExpired ? (
                    <Link href={`/demo/agent?email=${encodeURIComponent(demoEmail)}`} onClick={() => setMobileMenuOpen(false)}>
                      <button className="w-full relative inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                        </span>
                        <Zap className="w-4 h-4" />
                        <span>Live Agent</span>
                      </button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full">Login</Button>
                      </Link>
                      <Link href="/signup/demo" onClick={() => setMobileMenuOpen(false)}>
                        <Button className="w-full">Try Instant Demo</Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </Container>
          </div>
        )}
      </header>

      {/* Animated styles for Live Agent button */}
      <style jsx global>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  )
}
