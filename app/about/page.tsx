import type { Metadata } from 'next'
import Link from 'next/link'
import { Target, Users, Lightbulb, Globe } from 'lucide-react'
import { Container, Button, Card } from '@/components/ui'
import { CTASection } from '@/components/sections'

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about Zoxima and our mission to empower sales teams with AI.',
}

const values = [
    {
        icon: Target,
        title: 'Customer Obsessed',
        description: 'Everything we build starts with a real sales team problem. We listen, we observe, we solve.',
    },
    {
        icon: Lightbulb,
        title: 'Innovation First',
        description: 'We push the boundaries of what AI can do for sales teams, constantly experimenting and improving.',
    },
    {
        icon: Users,
        title: 'Team Empowerment',
        description: 'We believe great tools should make people better at what they do, not replace them.',
    },
    {
        icon: Globe,
        title: 'Global Impact',
        description: 'We serve sales teams across industries and geographies, helping them sell smarter everywhere.',
    },
]

const team = [
    { name: 'Rajesh Kumar', role: 'CEO & Co-founder', emoji: '👨‍💼' },
    { name: 'Priya Sharma', role: 'CTO & Co-founder', emoji: '👩‍💻' },
    { name: 'Amit Patel', role: 'VP of Product', emoji: '👨‍🔬' },
    { name: 'Sunita Reddy', role: 'VP of Engineering', emoji: '👩‍🔧' },
]

export default function AboutPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-hero py-16 lg:py-24">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                            Empowering Sales Teams with AI
                        </h1>
                        <p className="text-lg text-slate-600">
                            At Zoxima, we&apos;re building the AI assistant that every sales rep deserves—one that
                            knows your products, understands your pipeline, and helps you sell smarter.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Mission */}
            <section className="section-padding">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Mission</h2>
                                <p className="text-slate-600 mb-4">
                                    Sales teams in equipment and industrial companies face a unique challenge: they sell
                                    complex, technical products with thousands of SKUs, configurations, and competitive nuances.
                                </p>
                                <p className="text-slate-600 mb-4">
                                    We started Zoxima because we saw reps spending hours searching for product answers,
                                    new hires struggling for months to learn the catalog, and CRMs going stale because
                                    nobody had time to update them.
                                </p>
                                <p className="text-slate-600">
                                    SalesBuddy AI is our answer: an intelligent assistant that gives every rep instant
                                    access to product knowledge, pipeline insights, and voice-powered CRM updates.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 flex items-center justify-center min-h-[300px]">
                                <div className="text-center">
                                    <p className="text-6xl mb-4">🚀</p>
                                    <p className="text-primary-800 font-semibold text-lg">
                                        Making every sales rep <br /> the best sales rep
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Values */}
            <section className="py-16 bg-slate-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Values</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {values.map((value) => (
                            <Card key={value.title} padding="lg" className="text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">{value.title}</h3>
                                <p className="text-sm text-slate-600">{value.description}</p>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Team */}
            <section className="section-padding">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Leadership Team</h2>
                        <p className="text-slate-600">The people behind SalesBuddy AI</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {team.map((member) => (
                            <div key={member.name} className="text-center">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <span className="text-4xl">{member.emoji}</span>
                                </div>
                                <h3 className="font-semibold text-slate-900">{member.name}</h3>
                                <p className="text-sm text-slate-500">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA */}
            <CTASection
                title="Join Our Mission"
                subtitle="Help us empower sales teams around the world."
            />
        </>
    )
}
