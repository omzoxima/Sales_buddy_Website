import Link from 'next/link'
import { Quote } from 'lucide-react'
import { Container } from '@/components/ui'
import { TESTIMONIAL } from '@/lib/constants'

export function TestimonialSection() {
  return (
    <section className="section-padding bg-slate-50">
      <Container size="md">
        <div className="text-center">
          <p className="text-primary-600 font-medium text-sm tracking-wide mb-8">
            CUSTOMER STORIES
          </p>

          <Quote className="w-12 h-12 text-primary-200 mx-auto mb-6" />

          <blockquote className="text-2xl sm:text-3xl font-medium text-slate-900 mb-8">
            &ldquo;{TESTIMONIAL.quote}&rdquo;
          </blockquote>

          <div className="flex items-center justify-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sarah-chen.png"
              alt={TESTIMONIAL.author}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="text-left">
              <p className="font-semibold text-slate-900">{TESTIMONIAL.author}</p>
              <p className="text-sm text-slate-600">{TESTIMONIAL.title}, {TESTIMONIAL.company}</p>
            </div>
          </div>

          <Link
            href="/customers"
            className="inline-block mt-8 text-primary-600 hover:text-primary-700 font-medium"
          >
            Read more customer stories →
          </Link>
        </div>
      </Container>
    </section>
  )
}
