'use client'

import { useSearchParams } from 'next/navigation'

export function ContactForm() {
    const searchParams = useSearchParams()
    const email = searchParams.get('email') || ''

    return (
        <form className="space-y-4">
            <div>
                <label htmlFor="contact-name" className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input
                    id="contact-name"
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Your name"
                />
            </div>
            <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input
                    id="contact-email"
                    type="email"
                    defaultValue={email}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="you@company.com"
                />
            </div>
            <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input
                    id="contact-subject"
                    type="text"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="How can we help?"
                />
            </div>
            <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea
                    id="contact-message"
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    placeholder="Tell us more..."
                />
            </div>
            <button
                type="submit"
                className="w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
                Send Message
            </button>
        </form>
    )
}
