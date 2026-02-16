import type { Metadata } from 'next'
import { Upload, Brain, MessageSquare, BarChart } from 'lucide-react'
import { Container } from '@/components/ui'
import { CTASection } from '@/components/sections'

export const metadata: Metadata = {
  title: 'How It Works',
  description: 'See how SalesBuddy AI works in 4 simple steps.',
}

const steps = [
  {
    number: '01',
    icon: Upload,
    title: 'Upload Your Documents',
    description: 'Upload your product catalogs, price lists, spec sheets, and competitive battlecards. We support PDF, Excel, Word, and more.',
    details: ['Drag and drop or bulk upload', 'AI extracts and indexes content', 'Usually ready in minutes'],
    gradient: 'from-blue-500 to-indigo-600',
    lightGradient: 'from-blue-50 to-indigo-50',
    illustrationEmojis: ['📄', '📊', '📑'],
    illustrationLabel: 'Drag & drop your files',
  },
  {
    number: '02',
    icon: Brain,
    title: 'AI Learns Your Products',
    description: 'Our AI reads and understands your entire product knowledge base, creating a searchable brain for your sales team.',
    details: ['Understands technical specs', 'Learns pricing and configurations', 'Connects related information'],
    gradient: 'from-purple-500 to-pink-600',
    lightGradient: 'from-purple-50 to-pink-50',
    illustrationEmojis: ['🧠', '⚡', '🔗'],
    illustrationLabel: 'AI Processing',
  },
  {
    number: '03',
    icon: MessageSquare,
    title: 'Your Team Asks Questions',
    description: 'Sales reps ask questions in natural language—just like texting a colleague. They get instant, accurate answers.',
    details: ['Works on mobile and desktop', 'Voice input supported', 'Answers in seconds'],
    gradient: 'from-emerald-500 to-teal-600',
    lightGradient: 'from-emerald-50 to-teal-50',
    illustrationEmojis: ['💬', '🎤', '✅'],
    illustrationLabel: 'Natural Language Q&A',
  },
  {
    number: '04',
    icon: BarChart,
    title: 'Connect Your CRM (Optional)',
    description: 'Link your Salesforce or CRM to unlock pipeline intelligence, voice updates, and account 360 views.',
    details: ['Daily pipeline briefings', 'Update CRM by voice', 'Never miss a follow-up'],
    gradient: 'from-orange-500 to-red-600',
    lightGradient: 'from-orange-50 to-red-50',
    illustrationEmojis: ['📈', '🔄', '🎯'],
    illustrationLabel: 'Pipeline Intelligence',
  },
]

export default function HowItWorksPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-hero py-16 lg:py-20">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              How SalesBuddy AI Works
            </h1>
            <p className="text-lg text-slate-600">
              From upload to answers in minutes. Here&apos;s how it works.
            </p>
          </div>
        </Container>
      </section>

      {/* Steps */}
      <section className="section-padding">
        <Container>
          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, index) => (
              <div
                key={step.number}
                className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
              >
                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-5xl font-bold text-primary-100">{step.number}</span>
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-xl flex items-center justify-center`}>
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-4">
                    {step.title}
                  </h2>

                  <p className="text-lg text-slate-600 mb-6">
                    {step.description}
                  </p>

                  <ul className="space-y-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Illustration */}
                <div className="flex-1 w-full">
                  <div className={`bg-gradient-to-br ${step.lightGradient} rounded-2xl aspect-[4/3] flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden relative`}>
                    {/* Decorative circles */}
                    <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${step.gradient} rounded-full opacity-10`} />
                    <div className={`absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br ${step.gradient} rounded-full opacity-10`} />

                    <div className="relative text-center p-8">
                      <div className="flex items-center justify-center gap-4 mb-6">
                        {step.illustrationEmojis.map((emoji, i) => (
                          <div
                            key={i}
                            className={`w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center text-3xl ${i === 1 ? 'scale-110 shadow-lg' : ''
                              }`}
                          >
                            {emoji}
                          </div>
                        ))}
                      </div>
                      <div className={`inline-block bg-gradient-to-r ${step.gradient} text-white text-sm font-medium px-4 py-2 rounded-full`}>
                        {step.illustrationLabel}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline Summary */}
      <section className="py-16 bg-slate-50">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Typical Timeline
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">5 min</p>
              <p className="text-slate-600">To upload documents</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">15 min</p>
              <p className="text-slate-600">For AI to learn</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">Day 1</p>
              <p className="text-slate-600">Team gets answers</p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <CTASection
        title="Ready to See It in Action?"
        subtitle="Try our instant demo with sample data, or upload your own documents."
      />
    </>
  )
}
