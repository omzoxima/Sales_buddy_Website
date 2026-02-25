'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Zap, LayoutDashboard } from 'lucide-react'
import { Button, Container } from '@/components/ui'
import { NAV_LINKS, NAV_RESOURCES, SITE_CONFIG } from '@/lib/constants'
import { getUserEmail } from '@/lib/user-email'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [demoEmail, setDemoEmail] = useState<string | null>(null)
  const [demoExpired, setDemoExpired] = useState(false)
  const [hasAnySession, setHasAnySession] = useState(false)
  const [trialActive, setTrialActive] = useState(false)

  // All status from DATABASE — localStorage only stores email for identification
  useEffect(() => {
    const userEmail = getUserEmail()
    if (!userEmail) return

    fetch(`/api/user/dashboard?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.trial?.registered) {
          setHasAnySession(true)
          setDemoEmail(null)
          if (data.trial.active) {
            setTrialActive(true)
          }
        } else if (data.demo?.active) {
          setHasAnySession(true)
          setDemoEmail(data.demo.email)
        } else if (data.demo?.expired) {
          setHasAnySession(true)
          setDemoEmail(null)
          setDemoExpired(true)
        }
      })
      .catch(() => { })
  }, [])

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
        <Container>
          <nav className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo — original site logo */}
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

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Resources Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setResourcesOpen(!resourcesOpen)}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 text-sm font-medium transition-colors"
                >
                  Resources
                  <ChevronDown className={`w-4 h-4 transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
                </button>
                {resourcesOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2">
                    {NAV_RESOURCES.map(link => (
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
              {trialActive ? (
                <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
              ) : demoEmail && !demoExpired ? (
                <>
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link href={`/demo/agent?email=${encodeURIComponent(demoEmail)}`}>
                    <button className="live-agent-btn group relative inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 text-white font-semibold rounded-full shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 hover:scale-105 active:scale-95">
                      <span className="absolute inset-0 rounded-full animate-ping-slow bg-emerald-400/30" />
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
                      </span>
                      <Zap className="w-4 h-4" />
                      <span>Live Agent</span>
                    </button>
                  </Link>
                </>
              ) : hasAnySession ? (
                <>
                  <Link href="/dashboard" className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1.5">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link href="/signup/demo">
                    <Button>Try Instant Demo</Button>
                  </Link>
                </>
              ) : (
                <Link href="/signup/demo">
                  <Button>Try Instant Demo</Button>
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 -mr-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </Container>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/20" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-16 right-0 w-72 max-h-[calc(100vh-4rem)] bg-white shadow-xl border-l border-slate-200 overflow-y-auto">
            <div className="p-4">
              <div className="space-y-1">
                {NAV_LINKS.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                {NAV_RESOURCES.map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 mt-2 flex flex-col gap-3">
                {trialActive ? (
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Dashboard
                    </Button>
                  </Link>
                ) : demoEmail && !demoExpired ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
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
                  </>
                ) : hasAnySession ? (
                  <>
                    <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link href="/signup/demo" onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full">Try Instant Demo</Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/signup/demo" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Try Instant Demo</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
