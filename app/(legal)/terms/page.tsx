import type { Metadata } from 'next'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Zoxima SalesBuddy AI',
}

export default function TermsPage() {
  return (
    <section className="py-16">
      <Container size="md">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Acceptance of Terms</h2>
          <p className="text-slate-600 mb-4">
            By accessing or using SalesBuddy AI, you agree to be bound by these Terms of Service 
            and all applicable laws and regulations.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. Use of Service</h2>
          <p className="text-slate-600 mb-4">
            You may use our service only for lawful purposes and in accordance with these Terms. 
            You agree not to use the service in any way that violates any applicable laws.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Account Registration</h2>
          <p className="text-slate-600 mb-4">
            You must provide accurate and complete information when creating an account. 
            You are responsible for maintaining the security of your account credentials.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Intellectual Property</h2>
          <p className="text-slate-600 mb-4">
            The service and its original content, features, and functionality are owned by 
            Zoxima and are protected by international copyright and other intellectual property laws.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Limitation of Liability</h2>
          <p className="text-slate-600 mb-4">
            In no event shall Zoxima be liable for any indirect, incidental, special, 
            consequential, or punitive damages arising out of your use of the service.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">6. Contact</h2>
          <p className="text-slate-600 mb-4">
            If you have any questions about these Terms, please contact us at legal@zoxima.com.
          </p>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> This is a placeholder terms of service. 
              Please replace with your actual terms drafted by legal counsel.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
