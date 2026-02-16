import type { Metadata } from 'next'
import Link from 'next/link'
import { Quote, ArrowRight } from 'lucide-react'
import { Container, Button, Card } from '@/components/ui'

export const metadata: Metadata = {
    title: 'Customer Stories',
    description: 'See how sales teams are using SalesBuddy AI to close more deals and save time.',
}

const stories = [
    {
        company: 'Industrial Equipment Co.',
        industry: 'Manufacturing Equipment',
        logo: '🏭',
        quote: "SalesBuddy AI has completely changed how our reps prepare for customer meetings. They used to spend hours searching through catalogs—now they get answers in seconds.",
        author: 'Sarah Chen',
        title: 'Regional Sales Manager',
        stats: [
            { value: '75%', label: 'Less time searching' },
            { value: '3x', label: 'Faster quote responses' },
            { value: '95%', label: 'CRM accuracy' },
        ],
    },
    {
        company: 'Precision Tools Group',
        industry: 'Precision Instruments',
        logo: '🔧',
        quote: "New reps used to take 6 months to get up to speed on our product catalog. With SalesBuddy, they're productive within weeks. It's like having a product expert on their shoulder.",
        author: 'Mike Rodriguez',
        title: 'VP of Sales',
        stats: [
            { value: '4x', label: 'Faster onboarding' },
            { value: '40%', label: 'More calls per day' },
            { value: '22%', label: 'Revenue increase' },
        ],
    },
    {
        company: 'Global Machinery Inc.',
        industry: 'Heavy Machinery',
        logo: '⚙️',
        quote: "The voice CRM updates are a game-changer. Our field reps do their updates during the drive back from customer visits. Our CRM data has never been this accurate.",
        author: 'Lisa Thompson',
        title: 'Sales Operations Director',
        stats: [
            { value: '2hrs', label: 'Saved per rep/day' },
            { value: '98%', label: 'Update compliance' },
            { value: '30%', label: 'Better forecasting' },
        ],
    },
]

export default function CustomersPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-hero py-16 lg:py-20">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Customer Stories
                        </h1>
                        <p className="text-lg text-slate-600">
                            See how leading sales teams are using SalesBuddy AI to transform their results.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Stories */}
            <section className="section-padding">
                <Container>
                    <div className="space-y-12 max-w-4xl mx-auto">
                        {stories.map((story) => (
                            <Card key={story.company} padding="lg" className="overflow-hidden">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="text-3xl">{story.logo}</span>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{story.company}</h3>
                                        <p className="text-sm text-slate-500">{story.industry}</p>
                                    </div>
                                </div>

                                <div className="relative mb-6 pl-6 border-l-4 border-primary-200">
                                    <Quote className="absolute -left-3 -top-1 w-6 h-6 text-primary-300 bg-white" />
                                    <p className="text-slate-700 text-lg italic">
                                        {story.quote}
                                    </p>
                                    <div className="mt-4">
                                        <p className="font-semibold text-slate-900">{story.author}</p>
                                        <p className="text-sm text-slate-500">{story.title}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-100">
                                    {story.stats.map((stat) => (
                                        <div key={stat.label} className="text-center">
                                            <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
                                            <p className="text-sm text-slate-500">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* CTA */}
            <section className="py-16 bg-slate-50">
                <Container>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">
                            Ready to Write Your Success Story?
                        </h2>
                        <p className="text-slate-600 mb-6">
                            Join leading sales teams who trust SalesBuddy AI.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/signup/demo">
                                <Button>Try Instant Demo</Button>
                            </Link>
                            <Link href="/signup/pilot">
                                <Button variant="outline">Request a Pilot</Button>
                            </Link>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    )
}
