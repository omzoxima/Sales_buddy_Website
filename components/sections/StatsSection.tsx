import { Container } from '@/components/ui'
import { STATS } from '@/lib/constants'

export function StatsSection() {
  return (
    <section className="py-12 bg-white">
      <Container>
        <div className="grid grid-cols-3 gap-8">
          {STATS.map((stat, index) => (
            <div key={index} className="text-center">
              <p className="text-4xl sm:text-5xl font-bold text-primary-600 mb-2">
                {stat.value}
              </p>
              <p className="text-slate-600 text-sm sm:text-base">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
