import type { Metadata } from 'next'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'
import { Container, Card } from '@/components/ui'

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with the Zoxima SalesBuddy AI team. We\'d love to hear from you.',
}

const contactInfo = [
    {
        icon: Mail,
        title: 'Email Us',
        details: ['hello@zoxima.com', 'support@zoxima.com'],
    },
    {
        icon: MapPin,
        title: 'Visit Us',
        details: ['Zoxima Technologies', 'Sector 62, Noida', 'Uttar Pradesh, India 201309'],
    },
    {
        icon: Phone,
        title: 'Call Us',
        details: ['+91-120-XXX-XXXX'],
    },
    {
        icon: Clock,
        title: 'Business Hours',
        details: ['Monday – Friday', '9:00 AM – 6:00 PM IST'],
    },
]

export default function ContactPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-hero py-16 lg:py-20">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Contact Us
                        </h1>
                        <p className="text-lg text-slate-600">
                            Have a question or want to learn more? We&apos;d love to hear from you.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Contact Info + Form */}
            <section className="section-padding">
                <Container>
                    <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                {contactInfo.map((item) => (
                                    <div key={item.title} className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <item.icon className="w-5 h-5 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 mb-1">{item.title}</h3>
                                            {item.details.map((detail, i) => (
                                                <p key={i} className="text-slate-600 text-sm">{detail}</p>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Form */}
                        <Card padding="lg" variant="elevated">
                            <h2 className="text-xl font-bold text-slate-900 mb-6">Send Us a Message</h2>
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
                        </Card>
                    </div>
                </Container>
            </section>
        </>
    )
}
