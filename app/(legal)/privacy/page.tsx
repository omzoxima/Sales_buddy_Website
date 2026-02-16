import type { Metadata } from 'next'
import { Container } from '@/components/ui'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Zoxima SalesBuddy AI',
}

export default function PrivacyPage() {
  return (
    <section className="py-16">
      <Container size="md">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-slate-600 mb-4">
            We collect information you provide directly to us, such as when you create an account, 
            use our services, or contact us for support.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">2. How We Use Your Information</h2>
          <p className="text-slate-600 mb-4">
            We use the information we collect to provide, maintain, and improve our services, 
            to process transactions, and to communicate with you.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">3. Information Sharing</h2>
          <p className="text-slate-600 mb-4">
            We do not share your personal information with third parties except as described 
            in this policy or with your consent.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">4. Data Security</h2>
          <p className="text-slate-600 mb-4">
            We take reasonable measures to help protect your personal information from loss, 
            theft, misuse, and unauthorized access.
          </p>

          <h2 className="text-xl font-semibold text-slate-900 mt-8 mb-4">5. Contact Us</h2>
          <p className="text-slate-600 mb-4">
            If you have any questions about this Privacy Policy, please contact us at 
            privacy@zoxima.com.
          </p>

          <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> This is a placeholder privacy policy. 
              Please replace with your actual privacy policy drafted by legal counsel.
            </p>
          </div>
        </div>
      </Container>
    </section>
  )
}
