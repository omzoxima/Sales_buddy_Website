'use client'

import Image from 'next/image'
import { Container } from '@/components/ui'
import { cn } from '@/lib/utils'

const VALUE_PROPS = [
    {
        id: 'prep',
        stage: 'PREP',
        title: 'Walk in ready. Every time.',
        expectation: 'Your customers expect you to know them. Now you do.',
        highlight: 'From 20 minutes of prep to 10 seconds. Every rep. Every call.',
        image: '/value-prop-prep.png',
        color: 'text-[#4A7BF7]',
        accent: 'bg-[#4A7BF7]',
        border: 'border-[#4A7BF7]/20',
        highlightClass: 'text-[#4A7BF7] font-bold'
    },
    {
        id: 'sell',
        stage: 'SELL',
        title: 'Smartest person in every room.',
        expectation: 'Your customers expect instant answers. Now every rep has them.',
        highlight: 'Every rep sells with your best rep’s knowledge. No more “let me check with engineering.”',
        image: '/value-prop-sell.png',
        color: 'text-[#10B981]',
        accent: 'bg-[#10B981]',
        border: 'border-[#10B981]/20',
        highlightClass: 'text-[#4A7BF7] font-bold' // User explicitly asked for blue font here
    },
    {
        id: 'close',
        stage: 'CLOSE',
        title: 'Deals move. Nothing stalls.',
        expectation: 'Your reps want quotes out fast. Now they go out in minutes.',
        highlight: 'Fewer errors. Faster quotes. Zero deals lost to slow follow-up.',
        image: '/value-prop-close.png',
        color: 'text-[#F59E0B]',
        accent: 'bg-[#F59E0B]',
        border: 'border-[#F59E0B]/20',
        highlightClass: 'text-[#F59E0B] font-bold'
    },
    {
        id: 'flow',
        stage: 'FLOW',
        title: 'The system stays alive.',
        expectation: 'Your management expects accurate pipeline. Now it updates itself.',
        highlight: 'CRM stays current. Pipeline stays real. Leads stop disappearing.',
        image: '/value-prop-flow.png',
        color: 'text-[#8B5CF6]',
        accent: 'bg-[#8B5CF6]',
        border: 'border-[#8B5CF6]/20',
        highlightClass: 'text-[#8B5CF6] font-bold'
    }
]

export function ValuePropSection() {
    return (
        <section className="pt-16 pb-12 bg-white relative overflow-hidden">
            {/* Visible Section Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-slate-200" />
            <Container size="xl">
                <div className="space-y-20">
                    {VALUE_PROPS.map((prop, index) => {
                        const isReversed = index % 2 === 1
                        return (
                            <div
                                key={prop.id}
                                className={cn(
                                    "flex flex-col lg:flex-row gap-12 lg:gap-20 items-center",
                                    isReversed && "lg:flex-row-reverse"
                                )}
                            >
                                {/* Content Side */}
                                <div className="flex-1 space-y-6 animate-sectionFade">
                                    <div className="space-y-1">
                                        <h2 className={cn("text-3xl lg:text-5xl font-black tracking-tight uppercase", prop.color)}>
                                            {prop.stage}
                                        </h2>
                                        <div className={cn("h-1 w-20 mb-4", prop.accent)} />
                                        <h3 className="text-xl lg:text-3xl font-bold text-slate-800 leading-tight">
                                            {prop.title}
                                        </h3>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <p className="text-base lg:text-lg text-slate-600 font-medium leading-relaxed max-w-[100rem]">
                                                {prop.expectation}
                                            </p>
                                        </div>

                                        <p className={cn("text-base lg:text-lg max-w-[100rem]", prop.highlightClass)}>
                                            {prop.highlight}
                                        </p>
                                    </div>
                                </div>

                                {/* Image Side */}
                                <div className="flex-1 w-full lg:max-w-[600px] group">
                                    <div className={cn(
                                        "relative rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]",
                                        prop.border,
                                        "border-4"
                                    )}>
                                        <Image
                                            src={prop.image}
                                            alt={`${prop.stage} - ${prop.title}`}
                                            width={1200}
                                            height={900}
                                            className="w-full h-auto object-cover"
                                        />

                                        {/* Glossy Overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                                    </div>

                                    {/* Subtle accent glow behind image */}
                                    <div className={cn(
                                        "absolute -inset-4 blur-3xl opacity-10 -z-10 transition-opacity duration-700 group-hover:opacity-20",
                                        prop.accent
                                    )} />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
