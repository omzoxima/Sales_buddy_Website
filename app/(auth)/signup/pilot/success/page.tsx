import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Container, Card, Button } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Pilot Requested',
  description: 'Thanks for requesting a pilot. We will be in touch soon.',
}

export default function PilotSuccessPage() {
  return (
    <section className="min-h-[calc(100vh-5rem)] bg-gradient-hero py-16 flex items-center">
      <Container size="sm">
        <Card padding="lg" variant="elevated" className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Thanks! We&apos;ll Be In Touch Soon
          </h1>
          <p className="text-slate-600 mb-6">
            A member of our team will call you within 24 hours to discuss your pilot.
          </p>

          <div className="text-left p-4 bg-slate-50 rounded-lg mb-6">
            <p className="font-medium text-slate-900 mb-2">In the meantime:</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Check your email for confirmation</li>
              <li>• Gather your product documents</li>
              <li>• Identify who from your team should join</li>
            </ul>
          </div>

          <Link href="/signup/demo">
            <Button variant="outline">
              Try the Instant Demo while you wait →
            </Button>
          </Link>
        </Card>
      </Container>
    </section>
  )
}
