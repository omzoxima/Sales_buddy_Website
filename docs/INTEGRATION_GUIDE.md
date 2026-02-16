# Integration Guide

This document explains how to connect your website to backend services.

## Table of Contents

1. [Email Service](#email-service)
2. [CRM Integration](#crm-integration)
3. [Database](#database)
4. [Authentication](#authentication)
5. [Analytics](#analytics)
6. [Notifications](#notifications)

---

## Email Service

### Option A: SendGrid

1. Create SendGrid account: https://sendgrid.com
2. Get API key from Settings > API Keys
3. Add to `.env.local`:
   ```
   SENDGRID_API_KEY=SG.xxxx
   SENDGRID_FROM_EMAIL=hello@zoxima.com
   ```
4. Install: `npm install @sendgrid/mail`
5. Uncomment SendGrid code in API routes

### Option B: Resend

1. Create Resend account: https://resend.com
2. Get API key
3. Add to `.env.local`:
   ```
   RESEND_API_KEY=re_xxxx
   ```
4. Install: `npm install resend`
5. Uncomment Resend code in API routes

---

## CRM Integration

### Option A: HubSpot

1. Create HubSpot account: https://hubspot.com
2. Get API key from Settings > Integrations > API key
3. Add to `.env.local`:
   ```
   HUBSPOT_API_KEY=pat-na1-xxxx
   HUBSPOT_PORTAL_ID=12345678
   ```
4. Install: `npm install @hubspot/api-client`
5. Uncomment HubSpot code in API routes

**Properties to create in HubSpot:**
- `trial_type` (single-line text)
- `trial_start_date` (date)
- `sales_team_size` (single-line text)
- `current_crm` (single-line text)

### Option B: Salesforce

1. Create Salesforce connected app
2. Get OAuth credentials
3. Add to `.env.local`:
   ```
   SALESFORCE_CLIENT_ID=xxxx
   SALESFORCE_CLIENT_SECRET=xxxx
   SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
   ```
4. Install: `npm install jsforce`
5. Implement Salesforce Lead creation

---

## Database

### Supabase (Recommended)

1. Create project: https://supabase.com
2. Get credentials from Settings > API
3. Add to `.env.local`:
   ```
   SUPABASE_URL=https://xxxx.supabase.co
   SUPABASE_ANON_KEY=xxxx
   SUPABASE_SERVICE_ROLE_KEY=xxxx
   ```
4. Install: `npm install @supabase/supabase-js`

**SQL to create tables:**

```sql
-- Signups table
create table signups (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  type text not null,
  created_at timestamptz default now()
);

-- Users table (for trials)
create table users (
  id uuid default gen_random_uuid() primary key,
  email text unique not null,
  name text,
  password_hash text,
  company text,
  company_size text,
  role text,
  industry text,
  crm text,
  trial_type text,
  trial_expires_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz default now()
);

-- Pilot requests table
create table pilot_requests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null,
  company text not null,
  company_size text,
  role text,
  sales_team_size text,
  crm text,
  challenge text,
  timeline text,
  status text default 'new',
  created_at timestamptz default now()
);
```

---

## Authentication

For full user authentication, consider:

### Option A: NextAuth.js
- Supports OAuth + email
- Free, self-hosted
- Install: `npm install next-auth`

### Option B: Clerk
- Fully managed
- Pre-built components
- Install: `npm install @clerk/nextjs`

### Option C: Auth0
- Enterprise-grade
- Many integrations

---

## Analytics

### Google Analytics 4

1. Create GA4 property
2. Get Measurement ID (G-XXXXXXX)
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-xxxx
   ```
4. Add tracking script to `app/layout.tsx`:
   ```tsx
   <Script
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
     strategy="afterInteractive"
   />
   ```

### Mixpanel

1. Create Mixpanel project
2. Get Project Token
3. Add to `.env.local`:
   ```
   NEXT_PUBLIC_MIXPANEL_TOKEN=xxxx
   ```
4. Install: `npm install mixpanel-browser`

---

## Notifications

### Slack Webhooks

1. Create Slack app: https://api.slack.com/apps
2. Enable Incoming Webhooks
3. Add webhook to channel
4. Add to `.env.local`:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
   ```

Example usage in API routes:
```ts
await fetch(process.env.SLACK_WEBHOOK_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: '🚀 New signup: user@company.com',
  }),
})
```

---

## Quick Setup Order

1. **Day 1: Basic**
   - Deploy to Vercel
   - Add SendGrid/Resend for emails
   - Add Slack webhook for notifications

2. **Week 1: CRM**
   - Set up HubSpot
   - Connect form submissions
   - Create sales follow-up workflow

3. **Week 2: Analytics**
   - Add GA4
   - Add Mixpanel
   - Create conversion tracking

4. **Month 1: Database**
   - Set up Supabase
   - Migrate from email-only to full storage
   - Build admin dashboard

---

## Testing Integration

Before going live:

1. Test Demo signup → Check email received, Slack notification, CRM lead
2. Test Trial signup → Check email, Slack, CRM with full details
3. Test Pilot request → Check URGENT Slack, CRM task created
4. Verify analytics events firing

---

Built for Zoxima SalesBuddy AI
