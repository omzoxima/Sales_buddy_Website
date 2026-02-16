'use client'

import { useEffect, useRef } from 'react'
import { Container } from '@/components/ui'

const companies = [
  { name: 'Siemens', emoji: '⚡' },
  { name: 'Caterpillar', emoji: '🏗️' },
  { name: 'John Deere', emoji: '🚜' },
  { name: 'Bosch', emoji: '🔧' },
  { name: 'Honeywell', emoji: '🏭' },
  { name: 'ABB', emoji: '⚙️' },
  { name: 'Schneider Electric', emoji: '💡' },
  { name: 'Rockwell', emoji: '🤖' },
  { name: 'Emerson', emoji: '🔩' },
  { name: 'Parker Hannifin', emoji: '🛠️' },
]

export function SocialProof() {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationId: number
    let scrollPosition = 0
    const speed = 0.5 // pixels per frame

    const animate = () => {
      scrollPosition += speed
      // Reset when we've scrolled halfway (since content is duplicated)
      if (scrollPosition >= scrollContainer.scrollWidth / 2) {
        scrollPosition = 0
      }
      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    // Pause on hover
    const handleMouseEnter = () => cancelAnimationFrame(animationId)
    const handleMouseLeave = () => { animationId = requestAnimationFrame(animate) }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(animationId)
      scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
      scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Duplicate array for seamless infinite scroll
  const duplicatedCompanies = [...companies, ...companies]

  return (
    <section className="py-12 bg-white border-y border-slate-100 overflow-hidden">
      <Container>
        <p className="text-center text-sm font-medium text-slate-500 mb-8 tracking-wide">
          TRUSTED BY SALES TEAMS AT
        </p>
      </Container>

      {/* Auto-scrolling logos */}
      <div className="relative">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10" />

        <div
          ref={scrollRef}
          className="flex overflow-hidden no-scrollbar"
          style={{ scrollBehavior: 'auto' }}
        >
          {duplicatedCompanies.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex-shrink-0 mx-4 lg:mx-8 flex items-center gap-2.5 px-5 py-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
            >
              <span className="text-2xl">{company.emoji}</span>
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
