'use client'

import { X, HelpCircle, ArrowRight } from 'lucide-react'

const faqData = [
    "What is the base price and street price for FlowMaster 4000?",
    "What equipment do we recommend for a high-speed beverage line?",
    "How do we position CartonPro 3000 for heavy detergent?",
    "What is the margin percentage on standard equipment?",
    "Which machine has the shortest lead time?",
    "How much is the Serialization Module for CartonPro 6000?",
    "What’s the base price of BlisterPack 2000?",
    "What’s the annual cost of Basic Maintenance?"
]

interface FaqModalProps {
    onClose: () => void
}

export function FaqModal({ onClose }: FaqModalProps) {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-[#F8FAFC] rounded-[24px] shadow-2xl w-full max-w-lg overflow-hidden animate-slideUp relative flex flex-col max-h-[80vh] border border-white/20">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 z-10 w-9 h-9 rounded-xl bg-white hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-md group border border-slate-100"
                >
                    <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>

                {/* Header */}
                <div className="px-7 pt-9 pb-5 flex items-center justify-between">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-2xl font-black text-[#1E293B] tracking-tight">FAQ</h2>
                        <p className="text-slate-500 font-medium text-xs uppercase tracking-wider">(Frequently Asked Questions)</p>
                    </div>
                </div>

                {/* FAQ List */}
                <div className="px-7 pb-8 overflow-y-auto custom-scrollbar flex-1">
                    <div className="space-y-2.5">
                        {faqData.map((question, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-[16px] shadow-sm border border-slate-100 p-4 hover:border-red-200 hover:ring-2 hover:ring-red-500/5 transition-all duration-200 cursor-pointer group"
                            >
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-slate-700 text-[14px] font-semibold leading-snug group-hover:text-[#CC2229] transition-colors">
                                        {question}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <style jsx>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #CBD5E1;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #94A3B8;
                    }
                `}</style>
            </div>
        </div>
    )
}
