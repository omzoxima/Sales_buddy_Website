'use client'

import { useState, useEffect } from 'react'
import { Container } from '@/components/ui'
import {
    Database,
    Mail,
    FileText,
    Layers,
    History,
    Brain,
    Zap,
    ArrowRight,
    TrendingUp,
    AlertCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const BEFORE_SYSTEMS = [
    { name: 'CRM', desc: 'deal stages, contacts, notes', icon: Database },
    { name: 'ERP', desc: 'order history, stock, delivery', icon: Layers },
    { name: 'Email', desc: 'last conversation, promises', icon: Mail },
    { name: 'Docs', desc: 'pricing, specs, proposals', icon: FileText },
    { name: 'Intel', desc: 'win/loss data, positioning', icon: TrendingUp },
    { name: 'Memory', desc: 'relationships, context, gut', icon: Brain },
]

export function TheShiftSection() {
    const [activeTab, setActiveTab] = useState<'before' | 'after'>('before')

    // Auto toggle for visual if needed, but manual is better for reading

    return (
        <section className="pt-16 pb-12 bg-blue-50/20 relative overflow-hidden">
            {/* Visible Section Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />
            <Container>
                <div className="max-w-[90rem] mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16 animate-sectionFade">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 uppercase tracking-tight">
                            The Shift
                        </h2>
                    </div>

                    <div className="text-center mb-12 space-y-4 max-w-[100rem] mx-auto">
                        <h3 className="text-xl sm:text-2xl font-bold text-slate-800">
                            One AI layer. Sits on top of your CRM and ERP.
                        </h3>
                        <p className="text-lg text-blue-600 font-semibold tracking-tight">
                            Your reps talk to it. Every expectation gets met — automatically.
                        </p>
                    </div>

                    {/* Before/After Visualizer */}
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch mb-20 min-h-[600px]">
                        {/* BEFORE SIDE */}
                        <div className={cn(
                            "flex-1 rounded-[3rem] p-8 sm:p-12 transition-all duration-700 bg-white border border-slate-200 shadow-sm relative overflow-hidden",
                            activeTab === 'before' ? "ring-2 ring-slate-400/20 scale-100 opacity-100" : "opacity-60 grayscale hover:grayscale-0 cursor-pointer"
                        )}
                            onClick={() => setActiveTab('before')}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 rounded-2xl bg-slate-100 text-slate-500">
                                    <AlertCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900">Before (Today)</h4>
                                    <p className="text-sm text-slate-500 font-medium">6 systems. Zero connection.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                                {BEFORE_SYSTEMS.map((sys, i) => {
                                    const Icon = sys.icon
                                    return (
                                        <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-4 group hover:bg-white hover:shadow-md transition-all duration-300">
                                            <div className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 group-hover:text-slate-600">
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{sys.name}</p>
                                                <p className="text-[11px] text-slate-500 leading-tight mt-1">{sys.desc}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="mt-auto pt-8 border-t border-slate-100">
                                <p className="text-slate-600 font-medium italic leading-relaxed">
                                    Before every call, your rep manually checks all six. <span className="text-slate-900 font-bold">30 minutes. Every rep. Every day.</span>
                                </p>
                            </div>

                        </div>

                        {/* TRANSITION ARROW */}
                        <div className="hidden lg:flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl animate-pulse">
                                <ArrowRight className="w-8 h-8" />
                            </div>
                        </div>

                        {/* AFTER SIDE */}
                        <div className={cn(
                            "flex-1 rounded-[3rem] p-8 sm:p-12 transition-all duration-700 bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden",
                            activeTab === 'after' ? "ring-2 ring-blue-500/20 scale-100 opacity-100" : "opacity-60 grayscale hover:grayscale-0 cursor-pointer"
                        )}
                            onClick={() => setActiveTab('after')}
                        >
                            <div className="flex items-center gap-4 mb-10">
                                <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-white">After (Salezx)</h4>
                                    <p className="text-sm text-blue-400 font-medium">One intelligent layer. Everything connected.</p>
                                </div>
                            </div>

                            <div className="space-y-8 mb-12">
                                {/* Rep Ask */}
                                <div className="flex justify-end">
                                    <div className="bg-slate-800 border border-slate-700 rounded-2xl rounded-tr-none p-4 max-w-[80%]">
                                        <p className="text-sm font-medium text-white italic">“Brief me on Anderson Manufacturing.”</p>
                                    </div>
                                </div>

                                {/* AI Response */}
                                <div className="flex justify-start">
                                    <div className="bg-blue-600 rounded-2xl rounded-tl-none p-6 text-white shadow-lg space-y-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                                                <Brain className="w-3.5 h-3.5" />
                                            </div>
                                            <span className="text-[10px] uppercase font-black tracking-widest text-blue-100">10 seconds later</span>
                                        </div>
                                        <p className="text-sm font-bold leading-relaxed">
                                            account overview, contacts, open deals, service history, installed equipment, ERP order status, and recommended next action.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 border-t border-slate-800">
                                <p className="text-blue-100/70 font-medium italic leading-relaxed">
                                    Salezx doesn’t replace your systems. <span className="text-white font-bold">It connects them — through one AI conversation.</span>
                                </p>
                            </div>

                            {/* Hub Visual Element */}
                            <div className="absolute -bottom-10 -right-10 p-8 opacity-10">
                                <Brain className="w-48 h-48 text-blue-400 group-hover:rotate-12 transition-transform duration-700" />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
