# Zoxima SalesBuddy AI - Marketing Website

A modern, responsive marketing website for SalesBuddy AI built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout
│   ├── (marketing)/              # Marketing pages
│   │   ├── features/
│   │   ├── pricing/
│   │   └── demo/
│   ├── (auth)/                   # Auth pages
│   │   ├── login/
│   │   ├── signup/
│   │   │   ├── demo/             # Instant Demo signup
│   │   │   ├── trial/            # Document Trial signup
│   │   │   └── pilot/            # Guided Pilot request
│   │   └── verify/
│   ├── (legal)/                  # Legal pages
│   │   ├── privacy/
│   │   └── terms/
│   └── api/                      # API routes
│       └── signup/
│           ├── demo/
│           ├── trial/
│           └── pilot/
├── components/
│   ├── ui/                       # Base UI components
│   ├── layout/                   # Header, Footer
│   ├── sections/                 # Page sections
│   └── forms/                    # Form components
├── lib/
│   ├── constants.ts              # All site content
│   └── utils.ts                  # Utility functions
├── styles/
│   └── globals.css               # Global styles
└── public/                       # Static assets
```

## 🎨 Customization

### 1. Update Content

All website copy is centralized in `lib/constants.ts`:
- Headlines and CTAs
- Feature descriptions
- Pricing plans
- FAQ items
- Navigation links

### 2. Add Your Logo

Replace `public/logo.png` with your Zoxima/SalesBuddy logo.

### 3. Update Colors

Edit `tailwind.config.ts` to match your brand:
```ts
colors: {
  primary: {
    600: '#2563eb',  // Change this
  },
  accent: {
    red: '#CC2229',    // Zoxima logo colors
    blue: '#1B3F91',
    green: '#2D6A3F',
  },
}
```

### 4. Add Screenshots

Replace placeholder images in the sections with actual product screenshots.

## 🔌 Integrations

The API routes have commented integration code for:

### Email Services
- SendGrid
- Resend

### CRM
- HubSpot
- Salesforce

### Database
- Supabase

### Notifications
- Slack webhooks

### Analytics
- Google Analytics 4
- Mixpanel

See the API route files for detailed implementation instructions.

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Required for production
NEXT_PUBLIC_SITE_URL=https://your-domain.com
SENDGRID_API_KEY=SG.xxx
HUBSPOT_API_KEY=pat-xxx

# Optional
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-xxx
SLACK_WEBHOOK_URL=https://hooks.slack.com/xxx
```

## 📋 Checklist Before Launch

- [ ] Replace logo in `/public/logo.png`
- [ ] Update site URL in constants
- [ ] Add real customer logos
- [ ] Add product screenshots
- [ ] Record demo video
- [ ] Connect email service
- [ ] Connect CRM
- [ ] Add analytics
- [ ] Review legal pages with counsel
- [ ] Test all forms
- [ ] Test mobile responsiveness
- [ ] Submit sitemap to Google

## 📱 Pages Included

| Page | URL | Description |
|------|-----|-------------|
| Homepage | `/` | Main landing page with all sections |
| Features | `/features` | Detailed feature breakdown |
| Pricing | `/pricing` | Trial options + paid plans |
| Demo Landing | `/demo` | Dedicated ad landing page |
| Demo Signup | `/signup/demo` | 1-field instant demo form |
| Trial Signup | `/signup/trial` | 2-step trial registration |
| Pilot Request | `/signup/pilot` | Full pilot request form |
| Login | `/login` | User login (stub) |
| Verify | `/verify` | Email verification page |
| Privacy | `/privacy` | Privacy policy (placeholder) |
| Terms | `/terms` | Terms of service (placeholder) |

## 🛠 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **Deployment:** Vercel-ready

## 📞 Support

For questions about implementation, contact your development team.

---

Built with ❤️ for Zoxima SalesBuddy AI
