'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { MessageSquare, Star, X } from 'lucide-react'

export function FeedbackButton() {
    const searchParams = useSearchParams()
    const urlEmail = searchParams.get('email') || ''
    const [showFeedback, setShowFeedback] = useState(false)
    const [feedbackRating, setFeedbackRating] = useState(0)
    const [feedbackHover, setFeedbackHover] = useState(0)
    const [feedbackComment, setFeedbackComment] = useState('')
    const [feedbackEmail, setFeedbackEmail] = useState(urlEmail)
    const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
    const [feedbackSuccess, setFeedbackSuccess] = useState(false)

    // Sync email when navigating between pages
    useEffect(() => {
        setFeedbackEmail(urlEmail)
    }, [urlEmail])

    const resetForm = () => {
        setFeedbackRating(0)
        setFeedbackHover(0)
        setFeedbackComment('')
        setFeedbackEmail(urlEmail)
        setFeedbackSuccess(false)
    }

    const closeFeedback = () => {
        if (!feedbackSubmitting) {
            setShowFeedback(false)
            resetForm()
        }
    }

    const submitFeedback = async () => {
        if (feedbackRating === 0) return
        setFeedbackSubmitting(true)
        try {
            const res = await fetch('/api/demo/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: feedbackEmail || 'anonymous',
                    rating: feedbackRating,
                    comment: feedbackComment,
                }),
            })
            if (res.ok) {
                setFeedbackSuccess(true)
                setTimeout(() => {
                    setShowFeedback(false)
                    resetForm()
                }, 2000)
            }
        } catch {
            console.error('Failed to submit feedback')
        } finally {
            setFeedbackSubmitting(false)
        }
    }

    return (
        <>
            {/* Floating Feedback Button */}
            <button
                onClick={() => setShowFeedback(true)}
                className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all duration-300 active:scale-95 group"
                title="Give Feedback"
            >
                <MessageSquare className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                <span className="text-sm">Feedback</span>
            </button>

            {/* Feedback Modal */}
            {showFeedback && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={closeFeedback}
                    />
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
                        style={{ animation: 'feedbackFadeIn 0.25s ease-out' }}
                    >
                        <button
                            onClick={closeFeedback}
                            className="absolute top-4 right-4 w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        {feedbackSuccess ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/25">
                                    <span className="text-2xl text-white">✓</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    Thank you!
                                </h3>
                                <p className="text-slate-500 text-sm">
                                    Your feedback helps us improve SalesBuddy.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="text-center mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/25">
                                        <MessageSquare className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">
                                        How&apos;s your experience?
                                    </h3>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Rate your experience with SalesBuddy
                                    </p>
                                </div>

                                {/* Star Rating */}
                                <div className="flex justify-center gap-2 mb-5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setFeedbackRating(star)}
                                            onMouseEnter={() => setFeedbackHover(star)}
                                            onMouseLeave={() => setFeedbackHover(0)}
                                            className="transition-all duration-150 hover:scale-110 active:scale-95"
                                        >
                                            <Star
                                                className={`w-9 h-9 transition-colors ${star <= (feedbackHover || feedbackRating)
                                                    ? 'text-amber-400 fill-amber-400'
                                                    : 'text-slate-200'
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>

                                {/* Email */}
                                <input
                                    type="email"
                                    value={feedbackEmail}
                                    onChange={(e) => setFeedbackEmail(e.target.value)}
                                    placeholder="Your email (optional)"
                                    className="w-full px-4 py-2.5 mb-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 transition-all"
                                />

                                {/* Comment */}
                                <textarea
                                    value={feedbackComment}
                                    onChange={(e) => setFeedbackComment(e.target.value)}
                                    placeholder="Tell us more about your experience... (optional)"
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 resize-none transition-all"
                                />

                                {/* Actions */}
                                <div className="flex gap-3 mt-5">
                                    <button
                                        onClick={closeFeedback}
                                        className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={submitFeedback}
                                        disabled={feedbackRating === 0 || feedbackSubmitting}
                                        className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-xl text-sm shadow-md shadow-amber-500/20 transition-all active:scale-95"
                                    >
                                        {feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes feedbackFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(12px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
        </>
    )
}
