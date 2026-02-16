import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar } from 'lucide-react'
import { Container, Card, Button } from '@/components/ui'

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Insights, tips, and news from the SalesBuddy AI team on AI-powered sales enablement.',
}

const blogPosts = [
    {
        title: 'How AI is Transforming Equipment Sales in 2025',
        excerpt: 'Discover the latest trends in AI-powered sales enablement and how leading equipment companies are gaining a competitive edge.',
        date: 'Feb 10, 2025',
        category: 'Industry Trends',
        readTime: '5 min read',
    },
    {
        title: '5 Ways to Reduce Product Knowledge Gaps in Your Sales Team',
        excerpt: 'Learn practical strategies to ensure your sales reps always have the right product information at their fingertips.',
        date: 'Jan 28, 2025',
        category: 'Sales Tips',
        readTime: '4 min read',
    },
    {
        title: 'Why Voice CRM Updates Are the Future of Sales Productivity',
        excerpt: 'Explore how voice-powered CRM updates are helping sales teams save hours every week and keep their data accurate.',
        date: 'Jan 15, 2025',
        category: 'Product Updates',
        readTime: '3 min read',
    },
    {
        title: 'The Complete Guide to Sales AI: From Hype to ROI',
        excerpt: 'Cut through the noise and understand which AI tools actually deliver measurable results for sales organizations.',
        date: 'Jan 5, 2025',
        category: 'Guides',
        readTime: '8 min read',
    },
    {
        title: 'How to Onboard New Sales Reps 3x Faster with AI',
        excerpt: 'New reps struggle with product knowledge. Here&apos;s how AI assistants are cutting ramp-up time dramatically.',
        date: 'Dec 20, 2024',
        category: 'Sales Tips',
        readTime: '4 min read',
    },
    {
        title: 'SalesBuddy AI: What&apos;s New in Our Latest Release',
        excerpt: 'A roundup of our newest features including smart enquiry handling, improved voice commands, and more.',
        date: 'Dec 10, 2024',
        category: 'Product Updates',
        readTime: '3 min read',
    },
]

const categories = ['All', 'Industry Trends', 'Sales Tips', 'Product Updates', 'Guides']

export default function BlogPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-hero py-16 lg:py-20">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Blog
                        </h1>
                        <p className="text-lg text-slate-600">
                            Insights and strategies to help your sales team sell smarter with AI.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Categories */}
            <section className="py-8 border-b border-slate-200">
                <Container>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === 'All'
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Blog Posts */}
            <section className="section-padding">
                <Container>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {blogPosts.map((post) => (
                            <Card key={post.title} padding="none" className="overflow-hidden hover:shadow-md transition-shadow group">
                                <div className="h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                                    <span className="text-4xl">📝</span>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-full">
                                            {post.category}
                                        </span>
                                        <span className="text-xs text-slate-400">{post.readTime}</span>
                                    </div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {post.date}
                                        </div>
                                        <span className="text-primary-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Read more <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
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
                            Ready to Transform Your Sales?
                        </h2>
                        <p className="text-slate-600 mb-6">
                            See how SalesBuddy AI can help your team sell smarter.
                        </p>
                        <Link href="/signup/demo">
                            <Button>Try Instant Demo</Button>
                        </Link>
                    </div>
                </Container>
            </section>
        </>
    )
}
