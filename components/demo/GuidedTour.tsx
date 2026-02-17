'use client'

import { useState } from 'react'
import { BookOpen, Database, MessageSquare, Zap, ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react'

interface GuidedTourProps {
    onClose: () => void
}

const tourSteps = [
    {
        icon: Sparkles,
        iconBg: 'bg-gradient-to-br from-violet-500 to-purple-600',
        title: 'Welcome to Live Agent',
        description: 'Your AI-powered sales assistant is ready to help. SalesBuddy AI can answer product questions, provide pricing details, competitive analysis, and CRM insights — all in real-time conversation.',
        highlights: [
            'Ask questions in natural language',
            'Get instant, accurate responses',
            'Available 24/7 during your trial'
        ]
    },
    {
        icon: BookOpen,
        iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-600',
        title: 'Knowledge Base',
        description: 'Our AI agent is trained on your product documentation stored in SharePoint. It uses these documents as its primary knowledge source to provide accurate, up-to-date answers.',
        highlights: [
            'Product brochures & specifications',
            'Pricing sheets & comparison guides',
            'Technical documentation & FAQs'
        ]
    },
    {
        icon: Database,
        iconBg: 'bg-gradient-to-br from-orange-500 to-amber-600',
        title: 'CRM Integration',
        description: 'Live Agent connects to Salesforce to pull real-time sales data. This means it can provide insights based on your actual pipeline, opportunities, and customer information.',
        highlights: [
            'Salesforce opportunity data',
            'Account & contact details',
            'Pipeline stage information'
        ]
    },
    {
        icon: MessageSquare,
        iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        title: 'What You Can Ask',
        description: 'Try these types of questions to see the agent in action. The more specific your questions, the better the responses!',
        highlights: [
            '"What are the key features of our product?"',
            '"Compare our pricing with competitors"',
            '"Show me details for opportunity XYZ"',
            '"What documents do we have about product ABC?"'
        ]
    },
    {
        icon: Zap,
        iconBg: 'bg-gradient-to-br from-pink-500 to-rose-600',
        title: "Let's Get Started!",
        description: "You're all set! Start chatting with the Live Agent and experience the power of AI-driven sales assistance. You can revisit this guide anytime using the Guided Tour button in the chat header.",
        highlights: [
            'Your chat history is saved automatically',
            'You have 7 days of full access',
            'Click the tour button anytime to review'
        ]
    }
]

export function GuidedTour({ onClose }: GuidedTourProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const step = tourSteps[currentStep]
    const StepIcon = step.icon
    const isLast = currentStep === tourSteps.length - 1

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors shadow-sm"
                >
                    <X className="w-4 h-4" />
                </button>

                {/* Step indicator */}
                <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-b border-slate-100">
                    <span className="text-xs font-medium text-slate-400 tracking-wide">
                        STEP {currentStep + 1} OF {tourSteps.length}
                    </span>
                    <div className="flex gap-1.5">
                        {tourSteps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentStep
                                        ? 'w-6 bg-primary-500'
                                        : i < currentStep
                                            ? 'w-1.5 bg-primary-300'
                                            : 'w-1.5 bg-slate-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="px-6 py-8">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-2xl ${step.iconBg} flex items-center justify-center mb-6 shadow-lg`}>
                        <StepIcon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                        {step.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed mb-5">
                        {step.description}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-2.5">
                        {step.highlights.map((highlight, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 bg-slate-50 rounded-lg px-4 py-2.5"
                            >
                                <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-primary-600 text-xs font-bold">{i + 1}</span>
                                </div>
                                <span className="text-sm text-slate-700">{highlight}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Navigation */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${currentStep === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    <button
                        onClick={() => {
                            if (isLast) {
                                onClose()
                            } else {
                                setCurrentStep(currentStep + 1)
                            }
                        }}
                        className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isLast
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30'
                                : 'bg-primary-500 text-white hover:bg-primary-600'
                            }`}
                    >
                        {isLast ? 'Start Chatting!' : 'Next'}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Animations */}
            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>
        </div>
    )
}
