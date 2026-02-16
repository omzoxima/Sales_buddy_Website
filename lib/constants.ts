// =============================================================================
// ZOXIMA SALESBUDDY AI - SITE CONTENT & CONSTANTS
// =============================================================================
// All website copy in one place for easy editing

export const SITE_CONFIG = {
  name: 'Zoxima SalesBuddy AI',
  shortName: 'SalesBuddy',
  description: 'AI-powered sales assistant for equipment sales teams. Get instant product answers, pipeline intelligence, and voice CRM updates.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://zoxima.com',
  ogImage: '/og-image.png',
  twitter: '@zloximaai',
  calendlyUrl: process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/zoxima/pilot-call',
}

// -----------------------------------------------------------------------------
// NAVIGATION
// -----------------------------------------------------------------------------
export const NAV_LINKS = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'How It Works', href: '/how-it-works' },
]

export const NAV_RESOURCES = [
  { label: 'Help Center', href: '/help' },
  { label: 'Blog', href: '/blog' },
  { label: 'Customer Stories', href: '/customers' },
]

// -----------------------------------------------------------------------------
// HOMEPAGE CONTENT
// -----------------------------------------------------------------------------
export const HERO = {
  overline: 'AI FOR EQUIPMENT SALES TEAMS',
  headline: 'Answer Any Product Question in Seconds',
  subheadline: 'Give your sales team instant access to product specs, pricing, and competitive intel. Stop searching. Start selling.',
  primaryCta: 'Try Instant Demo',
  secondaryCta: 'Watch 2-min Demo',
  trustText: 'No credit card required • See results in 60 seconds',
}

export const TRIAL_OPTIONS = [
  {
    id: 'demo',
    icon: '🚀',
    badge: 'FASTEST START',
    title: 'Instant Demo',
    description: 'See it working in 60 seconds with sample equipment data. No signup hassle.',
    features: [
      'Pre-loaded product catalog & pricing',
      'Try product Q&A instantly',
      'Preview CRM features',
    ],
    details: '7 days • 1 user • 100 queries',
    cta: 'Try Instant Demo',
    href: '/signup/demo',
    color: 'demo' as const,
  },
  {
    id: 'trial',
    icon: '📄',
    badge: 'MOST POPULAR',
    title: 'Document Trial',
    description: 'Upload your own product docs and test with your real data. Full self-service.',
    features: [
      'Your catalogs, price lists, battlecards',
      'AI learns your products in minutes',
      'Invite up to 5 team members',
    ],
    details: '15 days • 5 users • 500 queries',
    cta: 'Start Free Trial',
    href: '/signup/trial',
    color: 'trial' as const,
    featured: true,
  },
  {
    id: 'pilot',
    icon: '🔧',
    badge: 'WHITE GLOVE',
    title: 'Guided Pilot',
    description: 'We set up everything: your docs, your CRM, your team. Full experience, zero effort.',
    features: [
      'We upload and configure your documents',
      'We connect your Salesforce',
      'Dedicated support throughout',
    ],
    details: '14 days • 10 users • Full CRM',
    cta: 'Request Pilot',
    href: '/signup/pilot',
    color: 'pilot' as const,
  },
]

export const PAIN_POINTS = [
  {
    icon: 'Clock',
    title: 'Hours Lost Searching',
    description: 'Your reps spend 2+ hours a day hunting for product specs, pricing, and availability across scattered documents.',
  },
  {
    icon: 'UserMinus',
    title: 'New Reps Struggle',
    description: "It takes months for new salespeople to learn your product catalog. They call the office constantly or give wrong answers.",
  },
  {
    icon: 'Target',
    title: 'Competitive Blindspots',
    description: 'When customers ask how you compare to competitors, your reps fumble or give inconsistent answers.',
  },
  {
    icon: 'Database',
    title: 'CRM Gets Ignored',
    description: "Reps hate updating CRM. Data goes stale. You fly blind on pipeline. Forecasts are guesswork.",
  },
]

export const FEATURES = [
  {
    id: 'ask',
    label: 'ASK',
    icon: 'MessageSquare',
    title: 'Instant Product Answers',
    description: 'Ask any question about your products and get accurate answers instantly from your catalogs, specs, and price lists.',
    examples: [
      "What's the spindle speed on the VM-50?",
      'Do we have a model for high-volume aerospace work?',
      "What's our price vs Haas?",
    ],
    color: 'bg-blue-500',
  },
  {
    id: 'know',
    label: 'KNOW',
    icon: 'Lightbulb',
    title: 'Pipeline Intelligence',
    description: 'Daily briefings on your pipeline. Account 360 views. Alerts when deals need attention. Know everything, miss nothing.',
    examples: [
      "What's happening with Acme Manufacturing?",
      'Which deals are closing this month?',
      'Alert me when deals go dark',
    ],
    color: 'bg-purple-500',
    requiresCrm: true,
  },
  {
    id: 'act',
    label: 'ACT',
    icon: 'Mic',
    title: 'Voice CRM Updates',
    description: 'Update your CRM by voice. Log meetings, update deal stages, create tasks—all without typing. Your CRM stays fresh.',
    examples: [
      'Log my meeting with John at Acme, we discussed pricing',
      'Update the VM-50 deal to proposal stage',
      'Create a follow-up task for Friday',
    ],
    color: 'bg-green-500',
    requiresCrm: true,
  },
  {
    id: 'respond',
    label: 'RESPOND',
    icon: 'Mail',
    title: 'Smart Enquiry Handling',
    description: 'AI analyzes inbound enquiries and drafts responses using your product knowledge. Reply faster, reply better.',
    examples: [
      'Analyze this RFQ',
      'Draft a response to this technical question',
      'What should I quote for this configuration?',
    ],
    color: 'bg-orange-500',
  },
]

export const TESTIMONIAL = {
  quote: "I used to call product management 10 times a day. Now I just ask SalesBuddy. It's like having an expert in my pocket.",
  author: 'Sarah Chen',
  title: 'Regional Sales Manager',
  company: 'Industrial Equipment Co.',
}

export const STATS = [
  { value: '10x', label: 'Faster product answers' },
  { value: '2+', label: 'Hours saved per rep per day' },
  { value: '95%', label: 'CRM data accuracy' },
]

// -----------------------------------------------------------------------------
// PRICING
// -----------------------------------------------------------------------------
export const PRICING_PLANS = [
  {
    name: 'Starter',
    price: { monthly: 500, annual: 5000 },
    perUser: 50,
    description: 'For small sales teams getting started',
    userLimit: 'Up to 10 users',
    features: [
      'Unlimited documents',
      '5,000 queries/month',
      'ASK features (full)',
      'KNOW features (basic)',
      '1 CRM integration',
      'Email support',
      'Guided onboarding',
    ],
    cta: 'Start with Trial',
    href: '/signup/trial',
  },
  {
    name: 'Pro',
    price: { monthly: 2000, annual: 20000 },
    perUser: 40,
    description: 'For growing sales organizations',
    userLimit: 'Up to 50 users',
    features: [
      'Everything in Starter, plus:',
      '25,000 queries/month',
      'KNOW features (full)',
      'ACT features (full)',
      'Voice CRM updates',
      'Teams & SMS access',
      'SSO',
      'Priority support',
      'Assisted onboarding',
    ],
    cta: 'Contact Sales',
    href: '/signup/pilot',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: null, annual: null },
    perUser: null,
    description: 'For large sales organizations',
    userLimit: 'Unlimited users',
    features: [
      'Everything in Pro, plus:',
      'Unlimited queries',
      'Multiple CRM integrations',
      'API access',
      'Custom integrations',
      'Dedicated CSM',
      'White-glove onboarding',
      'SLA guarantee',
      'On-premise option',
    ],
    cta: 'Contact Sales',
    href: '/signup/pilot',
  },
]

export const PRICING_FAQ = [
  {
    question: 'Can I switch plans later?',
    answer: 'Yes! You can upgrade or downgrade at any time. Changes take effect on your next billing cycle.',
  },
  {
    question: 'What CRMs do you integrate with?',
    answer: 'We currently support Salesforce, Microsoft Dynamics 365, and HubSpot. More coming soon.',
  },
  {
    question: 'Is there a setup fee?',
    answer: 'No setup fees. Starter plans are self-service. Pro and Enterprise include assisted onboarding at no extra cost.',
  },
  {
    question: "What counts as a 'query'?",
    answer: 'Each question you ask SalesBuddy counts as one query. This includes product questions, CRM lookups, and voice commands.',
  },
  {
    question: 'Can I cancel anytime?',
    answer: 'Yes. Monthly plans can be cancelled anytime. Annual plans can be cancelled with 30 days notice.',
  },
  {
    question: 'Do you offer discounts for nonprofits or startups?',
    answer: 'Yes! Contact us for special pricing for qualified nonprofits and early-stage startups.',
  },
]

// -----------------------------------------------------------------------------
// FORM OPTIONS
// -----------------------------------------------------------------------------
export const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' },
]

export const ROLES = [
  { value: 'sales-rep', label: 'Sales Rep' },
  { value: 'sales-manager', label: 'Sales Manager' },
  { value: 'sales-ops', label: 'Sales Operations' },
  { value: 'vp-director', label: 'VP/Director of Sales' },
  { value: 'owner-executive', label: 'Owner/Executive' },
  { value: 'other', label: 'Other' },
]

export const INDUSTRIES = [
  { value: 'manufacturing-equipment', label: 'Manufacturing Equipment' },
  { value: 'industrial-distribution', label: 'Industrial Distribution' },
  { value: 'medical-devices', label: 'Medical Devices' },
  { value: 'technology', label: 'Technology/Software' },
  { value: 'other', label: 'Other' },
]

export const CRMS = [
  { value: 'salesforce', label: 'Salesforce' },
  { value: 'dynamics', label: 'Microsoft Dynamics' },
  { value: 'hubspot', label: 'HubSpot' },
  { value: 'zoho', label: 'Zoho CRM' },
  { value: 'other', label: 'Other' },
  { value: 'none', label: 'No CRM' },
]

export const SALES_TEAM_SIZES = [
  { value: '5-10', label: '5-10 reps' },
  { value: '11-25', label: '11-25 reps' },
  { value: '26-50', label: '26-50 reps' },
  { value: '51-100', label: '51-100 reps' },
  { value: '100+', label: '100+ reps' },
]

export const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: '1-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: 'exploring', label: 'Just exploring' },
]

// -----------------------------------------------------------------------------
// FOOTER
// -----------------------------------------------------------------------------
export const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '/features' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Demo', href: '/demo' },
  ],
  resources: [
    { label: 'Help Center', href: '/help' },
    { label: 'Blog', href: '/blog' },
    { label: 'Customer Stories', href: '/customers' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Careers', href: '/careers' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Security', href: '/security' },
  ],
}

export const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/zoxima', icon: 'Linkedin' },
  { label: 'Twitter', href: 'https://twitter.com/zoximaai', icon: 'Twitter' },
  { label: 'YouTube', href: 'https://youtube.com/@zoxima', icon: 'Youtube' },
]
