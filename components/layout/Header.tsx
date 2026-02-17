'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronDown, Bot } from 'lucide-react'
import { Button, Container } from '@/components/ui'
import { NAV_LINKS, NAV_RESOURCES, SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [demoEmail, setDemoEmail] = useState<string | null>(null)
  const [demoExpired, setDemoExpired] = useState(false)

  // Check demo user in database via session API
  useEffect(() => {
    // Read email from cookie
    const cookieEmail = document.cookie
      .split(';')
      .map(c => c.trim().split('='))
      .find(([key]) => key === 'demo_session')?.[1]

    if (!cookieEmail) return
    const email = decodeURIComponent(cookieEmail)

    // Validate against demo_users table in DB
    fetch(`/api/demo/session?email=${encodeURIComponent(email)}`)
      .then(res => res.json())
      .then(data => {
        if (data.active) {
          setDemoEmail(email)
        } else if (data.expired && data.expiresAt) {
          setDemoEmail(email)
          setDemoExpired(true)
        }
      })
      .catch(() => { })
  }, [])

  return (
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
            {demoEmail ? (
              <Link href={`/demo/agent?email=${encodeURIComponent(demoEmail)}`}>
                <Button className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Agent Demo
                </Button>
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
                {demoEmail ? (
                  <Link href={`/demo/agent?email=${encodeURIComponent(demoEmail)}`} onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full flex items-center justify-center gap-2">
                      <Bot className="w-4 h-4" />
                      Agent Demo
                    </Button>
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
  )
}
