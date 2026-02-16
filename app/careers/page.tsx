import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Users, Zap, Heart } from 'lucide-react'
import { Container, Button, Card } from '@/components/ui'

export const metadata: Metadata = {
    title: 'Careers',
    description: 'Join the Zoxima team and help us build the future of AI-powered sales enablement.',
}

const perks = [
    { icon: Zap, title: 'Cutting-Edge Tech', description: 'Work with the latest AI/ML technologies and build products that matter.' },
    { icon: Users, title: 'Great Team', description: 'Collaborate with passionate, talented people who love what they do.' },
    { icon: Heart, title: 'Work-Life Balance', description: 'Flexible hours, remote options, and a culture that values your well-being.' },
    { icon: MapPin, title: 'Prime Location', description: 'Modern office in Noida with remote-friendly policies.' },
]

const openings = [
    {
        title: 'Senior Full Stack Engineer',
        department: 'Engineering',
        location: 'Noida / Remote',
        type: 'Full-time',
    },
    {
        title: 'AI/ML Engineer',
        department: 'Engineering',
        location: 'Noida / Remote',
        type: 'Full-time',
    },
    {
        title: 'Product Manager',
        department: 'Product',
        location: 'Noida',
        type: 'Full-time',
    },
    {
        title: 'Sales Development Representative',
        department: 'Sales',
        location: 'Noida / Remote',
        type: 'Full-time',
    },
    {
        title: 'Customer Success Manager',
        department: 'Customer Success',
        location: 'Noida',
        type: 'Full-time',
    },
]

export default function CareersPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-hero py-16 lg:py-24">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">
                            Join Our Team
                        </h1>
                        <p className="text-lg text-slate-600 mb-8">
                            Help us build the AI assistant that sales teams love. We&apos;re growing fast and
                            looking for talented people who want to make an impact.
                        </p>
                        <a href="#openings">
                            <Button size="lg">View Open Positions</Button>
                        </a>
                    </div>
                </Container>
            </section>

            {/* Perks */}
            <section className="section-padding">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Zoxima?</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                        {perks.map((perk) => (
                            <Card key={perk.title} padding="lg" className="text-center">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <perk.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900 mb-2">{perk.title}</h3>
                                <p className="text-sm text-slate-600">{perk.description}</p>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Open Positions */}
            <section id="openings" className="py-16 bg-slate-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Open Positions</h2>
                        <p className="text-slate-600">Find your next role at Zoxima</p>
                    </div>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {openings.map((job) => (
                            <Card key={job.title} padding="lg" className="hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full font-medium">
                                                {job.department}
                                            </span>
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                                {job.location}
                                            </span>
                                            <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                                                {job.type}
                                            </span>
                                        </div>
                                    </div>
                                    <Link href="/contact">
                                        <Button variant="outline" className="w-full sm:w-auto">Apply</Button>
                                    </Link>
                                </div>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA */}
            <section className="section-padding">
                <Container>
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Don&apos;t See Your Role?
                        </h2>
                        <p className="text-slate-600 mb-6">
                            We&apos;re always looking for talented people. Send us your resume and
                            we&apos;ll reach out when a matching role opens up.
                        </p>
                        <Link href="/contact">
                            <Button>Send Your Resume</Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    )
}
