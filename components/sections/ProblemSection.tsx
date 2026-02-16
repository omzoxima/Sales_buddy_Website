import { Clock, UserMinus, Target, Database, LucideIcon } from 'lucide-react'
import { Container } from '@/components/ui'
import { PAIN_POINTS } from '@/lib/constants'

const iconMap: Record<string, LucideIcon> = {
  Clock,
  UserMinus,
  Target,
  Database,
}

export function ProblemSection() {
  return (
    <section className="section-padding bg-slate-50">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-red-600 font-medium text-sm tracking-wide mb-3">
            THE PROBLEM
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Sound Familiar?
          </h2>
        </div>

        {/* Pain Points Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PAIN_POINTS.map((pain, index) => {
            const Icon = iconMap[pain.icon]
            return (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {pain.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {pain.description}
                </p>
              </div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
