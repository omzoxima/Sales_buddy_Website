"use client"

import { Container } from '@/components/ui'
import { ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

export const TheForkSection = () => {
    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            {/* Visible Section Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />

            <Container size="full" className="px-4">
                <div className="max-w-4xl mx-auto text-center mb-16 px-4">
                    <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 uppercase tracking-tight">
                        THE FORK
                    </h2>
                    <p className="text-xl sm:text-2xl text-slate-700 font-medium italic">
                        Two kinds of sales teams in 2026.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                    {/* Path A - Friction */}
                    <div className="relative group p-8 rounded-[2.5rem] bg-white border border-rose-100 shadow-[0_10px_40px_-15px_rgba(225,29,72,0.1)] transition-all hover:shadow-[0_20px_50px_-15px_rgba(225,29,72,0.15)] hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center">
                                <AlertCircle className="w-7 h-7 text-rose-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">Path A</h3>
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Teams where reps search, copy, and update across 6 systems before every call.
                            Where CRM is <span className="text-rose-600 font-bold">30% stale</span>.
                            Where quotes take days. Where the best leads die because nobody captured them.
                        </p>
                    </div>

                    {/* Path B - Efficiency */}
                    <div className="relative group p-8 rounded-[2.5rem] bg-white border border-blue-100 shadow-[0_10px_40px_-15px_rgba(37,99,235,0.1)] transition-all hover:shadow-[0_20px_50px_-15px_rgba(37,99,235,0.15)] hover:-translate-y-1">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                <CheckCircle2 className="w-7 h-7 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 font-sparkles">Path B</h3>
                        </div>
                        <p className="text-lg text-slate-600 leading-relaxed font-medium">
                            Teams where reps just ask. Where every meeting starts with <span className="text-blue-600 font-bold">full context</span>.
                            Where CRM updates itself. Where quotes go out in minutes and pipeline shows the truth.
                        </p>
                    </div>
                </div>

                {/* Footer Copy */}
                <div className="mt-16 text-center space-y-6 px-6">
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight">
                        <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            Which one is yours?
                        </span>
                    </p>
                    <p className="text-lg sm:text-xl text-slate-900 font-semibold max-w-4xl mx-auto leading-relaxed">
                        The expectations aren't going down. The company that meets them wins.
                    </p>
                </div>
            </Container>
        </section>
    )
}
