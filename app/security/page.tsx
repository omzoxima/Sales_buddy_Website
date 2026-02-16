import type { Metadata } from 'next'
import { Shield, Lock, Server, Eye, FileCheck, Users } from 'lucide-react'
import { Container, Card } from '@/components/ui'

export const metadata: Metadata = {
    title: 'Security',
    description: 'Learn about how Zoxima SalesBuddy AI keeps your data safe and secure.',
}

const securityFeatures = [
    {
        icon: Lock,
        title: 'Encryption at Rest & In Transit',
        description: 'All data is encrypted using AES-256 at rest and TLS 1.3 in transit. Your information is protected at every step.',
    },
    {
        icon: Server,
        title: 'SOC 2 Compliant Infrastructure',
        description: 'We host on SOC 2 compliant cloud infrastructure with regular third-party security audits.',
    },
    {
        icon: Eye,
        title: 'Role-Based Access Control',
        description: 'Granular access controls ensure team members only see the data they need. Admin controls for full visibility.',
    },
    {
        icon: FileCheck,
        title: 'Data Isolation',
        description: 'Each customer\'s data is logically isolated. Your product knowledge and CRM data are never shared or mixed.',
    },
    {
        icon: Users,
        title: 'SSO & MFA Support',
        description: 'Enterprise-grade authentication with Single Sign-On (SAML 2.0) and Multi-Factor Authentication support.',
    },
    {
        icon: Shield,
        title: 'Regular Security Audits',
        description: 'We conduct regular penetration testing and vulnerability assessments to stay ahead of threats.',
    },
]

const certifications = [
    { name: 'SOC 2 Type II', status: 'Compliant' },
    { name: 'GDPR', status: 'Compliant' },
    { name: 'ISO 27001', status: 'In Progress' },
    { name: 'HIPAA', status: 'Available for Enterprise' },
]

export default function SecurityPage() {
    return (
        <>
            {/* Header */}
            <section className="bg-gradient-hero py-16 lg:py-20">
                <Container>
                    <div className="text-center max-w-3xl mx-auto">
                        <Shield className="w-16 h-16 text-primary-600 mx-auto mb-6" />
                        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
                            Security & Compliance
                        </h1>
                        <p className="text-lg text-slate-600">
                            Your data security is our top priority. Learn about the measures we take to
                            keep your information safe.
                        </p>
                    </div>
                </Container>
            </section>

            {/* Security Features */}
            <section className="section-padding">
                <Container>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {securityFeatures.map((feature) => (
                            <Card key={feature.title} padding="lg">
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-600">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Certifications */}
            <section className="py-16 bg-slate-50">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Certifications & Compliance</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {certifications.map((cert) => (
                            <Card key={cert.name} padding="lg" className="text-center">
                                <Shield className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                                <h3 className="font-semibold text-slate-900 mb-1">{cert.name}</h3>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${cert.status === 'Compliant'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {cert.status}
                                </span>
                            </Card>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Data Handling */}
            <section className="section-padding">
                <Container>
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 text-center">How We Handle Your Data</h2>
                        <div className="space-y-6">
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <h3 className="font-semibold text-slate-900 mb-2">Document Storage</h3>
                                <p className="text-slate-600 text-sm">
                                    Your uploaded documents are processed, encrypted, and stored securely. We extract
                                    knowledge from them but never share raw documents with other customers.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <h3 className="font-semibold text-slate-900 mb-2">CRM Data</h3>
                                <p className="text-slate-600 text-sm">
                                    CRM data is accessed via secure API connections with minimal required permissions.
                                    We cache only what&apos;s needed for fast responses and never store sensitive CRM data longer than necessary.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <h3 className="font-semibold text-slate-900 mb-2">AI Processing</h3>
                                <p className="text-slate-600 text-sm">
                                    Your data is never used to train our AI models. Queries and responses are processed
                                    in isolated environments. We use enterprise-grade AI providers with strict data handling agreements.
                                </p>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-xl">
                                <h3 className="font-semibold text-slate-900 mb-2">Data Retention & Deletion</h3>
                                <p className="text-slate-600 text-sm">
                                    You own your data. When you delete documents or cancel your account, all associated
                                    data is permanently removed from our systems within 30 days.
                                </p>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>
        </>
    )
}
