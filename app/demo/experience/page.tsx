'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { FileText, ExternalLink, Bot, ChevronRight } from 'lucide-react'
import { Container, Card, Button } from '@/components/ui'

interface Document {
    id: string
    name: string
    description: string
    previewUrl: string
    downloadUrl: string
    type: string
    size: string
    mimeType: string
    lastModified: string
}

export default function DemoExperiencePage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const email = searchParams.get('email') || ''
    const [documents, setDocuments] = useState<Document[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [previewDoc, setPreviewDoc] = useState<Document | null>(null)

    useEffect(() => {
        if (!email) {
            router.push('/signup/demo')
            return
        }

        async function fetchDocuments() {
            try {
                const res = await fetch(`/api/demo/documents?email=${encodeURIComponent(email)}`)
                const data = await res.json()
                if (data.success) {
                    setDocuments(data.documents)
                }
            } catch (err) {
                console.error('Failed to fetch documents:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchDocuments()
    }, [email, router])

    return (
        <section className="min-h-[calc(100vh-5rem)] bg-slate-50">
            {/* Video Section */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
                <Container>
                    <div className="py-8 lg:py-12">
                        <div className="text-center mb-6">
                            <p className="text-primary-400 font-medium text-sm tracking-wide mb-2">
                                DEMO EXPERIENCE
                            </p>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                See SalesBuddy AI in Action
                            </h1>
                            <p className="text-slate-400">
                                Watch the demo video and explore our documentation below
                            </p>
                        </div>

                        {/* Video Player */}
                        <div className="max-w-4xl mx-auto">
                            <div
                                className="relative bg-black rounded-xl overflow-hidden shadow-2xl"
                                style={{ aspectRatio: '16/9' }}
                            >
                                <video
                                    className="w-full h-full object-cover"
                                    controls
                                    playsInline
                                >
                                    <source src="/demo-video.mp4" type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Document Notes Section */}
            <div className="py-10 lg:py-14">
                <Container>
                    <div className="max-w-4xl mx-auto">
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-1">
                                    Documentation & Notes
                                </h2>
                                <p className="text-slate-600">
                                    Preview and explore our product documentation
                                </p>
                            </div>
                            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
                                <FileText className="w-4 h-4" />
                                <span>{documents.length} documents</span>
                            </div>
                        </div>

                        {/* Documents Grid */}
                        {isLoading ? (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map((i) => (
                                    <div
                                        key={i}
                                        className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse"
                                    >
                                        <div className="h-4 w-2/3 bg-slate-200 rounded mb-3" />
                                        <div className="h-3 w-full bg-slate-100 rounded mb-2" />
                                        <div className="h-3 w-1/2 bg-slate-100 rounded" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-4">
                                {documents.map((doc) => (
                                    <Card
                                        key={doc.id}
                                        className="group flex flex-col transition-all duration-200 hover:shadow-md hover:border-primary-500 cursor-pointer"
                                        padding="md"
                                    >
                                        <div className="flex items-start gap-4">
                                            {/* File Icon */}
                                            <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                                                <FileText className="w-6 h-6 text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-slate-900 text-sm mb-1 truncate">
                                                    {doc.name}
                                                </h3>
                                                <p className="text-xs text-slate-500 mb-2 line-clamp-2">
                                                    {doc.description}
                                                </p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-slate-400 uppercase font-medium">
                                                        {doc.type}
                                                    </span>
                                                    <span className="text-xs text-slate-400">
                                                        {doc.size}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Preview Button */}
                                        <div className="mt-4 pt-4 border-t border-slate-100">
                                            <button
                                                onClick={() => setPreviewDoc(doc)}
                                                className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                Preview Document
                                            </button>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}

                        {/* Agent Demo CTA */}
                        <div className="mt-12 text-center">
                            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-8 border border-primary-100">
                                <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                                    <Bot className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    Try Our AI Sales Agent
                                </h3>
                                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                                    Chat with our AI-powered sales assistant and experience real-time
                                    product intelligence.
                                </p>
                                <Button
                                    size="lg"
                                    onClick={() =>
                                        router.push(
                                            '/demo/agent?email=' + encodeURIComponent(email)
                                        )
                                    }
                                    className="inline-flex items-center gap-2"
                                >
                                    <Bot className="w-5 h-5" />
                                    Agent Demo
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Document Preview Modal */}
            {previewDoc && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewDoc(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-red-500" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-sm">
                                        {previewDoc.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {previewDoc.type.toUpperCase()} • {previewDoc.size}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPreviewDoc(null)}
                                    className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Embedded PDF Viewer */}
                        <div className="flex-1 bg-slate-100">
                            <iframe
                                src={`/api/demo/documents/preview?id=${encodeURIComponent(previewDoc.id)}&email=${encodeURIComponent(email)}`}
                                className="w-full h-full border-0"
                                title={previewDoc.name}
                            />
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}
