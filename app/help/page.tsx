import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, BookOpen, MessageCircle, FileText, Video, Mail } from 'lucide-react'
import { Container, Button, Card } from '@/components/ui'

export const metadata: Metadata = {
    title: 'Help Center',
    description: 'Get help with SalesBuddy AI. Find guides, tutorials, and support resources.',
}

const helpCategories = [
    {
        icon: BookOpen,
        title: 'Getting Started',
        description: 'Learn the basics of SalesBuddy AI and set up your account.',
        articles: ['Quick Start Guide', 'Uploading Your First Documents', 'Inviting Team Members'],
    },
    {
        icon: FileText,
        title: 'Product Q&A',
        description: 'Learn how to get the most out of product question answering.',
        articles: ['Asking Effective Questions', 'Understanding AI Responses', 'Managing Your Knowledge Base'],
    },
    {
        icon: MessageCircle,
        title: 'CRM Integration',
        description: 'Connect and configure your Salesforce or CRM.',
        articles: ['Connecting Salesforce', 'Voice CRM Updates', 'Pipeline Intelligence Setup'],
    },
    {
        icon: Video,
        title: 'Video Tutorials',
        description: 'Watch step-by-step video guides for common tasks.',
        articles: ['Demo Walkthrough', 'Admin Configuration', 'Advanced Features'],
    },
]

export default function HelpCenterPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-hero py-16 lg:py-20">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Help Center
                        </h1>
                        <p className="text-lg text-slate-600 mb-8">
                            Find answers, guides, and resources to help you get the most out of SalesBuddy AI.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Categories */}
            <section className="section-padding">
                <Container>
                    <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
                        {helpCategories.map((category) => (
                            <Card key={category.title} padding="lg" className="hover:shadow-md transition-shadow">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <category.icon className="w-6 h-6 text-primary-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{category.title}</h3>
                                        <p className="text-slate-600 text-sm mb-3">{category.description}</p>
                                        <ul className="space-y-1.5">
                                            {category.articles.map((article) => (
                                                <li key={article} className="text-sm text-primary-600 hover:underline cursor-pointer">
                                                    {article}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Contact Support */}
            <section className="py-16 bg-slate-50">
                <Container>
                    <div className="text-center max-w-2xl mx-auto">
                        <Mail className="w-12 h-12 text-primary-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Can&apos;t Find What You Need?
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Our support team is here to help. Reach out and we&apos;ll get back to you within 24 hours.
                        </p>
                        <Link href="/contact">
                            <Button>Contact Support</Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    )
}
