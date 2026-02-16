# Deployment Guide

## Deploy to Vercel (Recommended)

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/zoxima-salesbuddy-website.git
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel auto-detects Next.js

### Step 3: Configure Environment Variables

In Vercel dashboard, add these environment variables:

**Required:**
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

**Email (choose one):**
```
SENDGRID_API_KEY=SG.xxxx
SENDGRID_FROM_EMAIL=hello@zoxima.com
```
or
```
RESEND_API_KEY=re_xxxx
```

**CRM (optional):**
```
HUBSPOT_API_KEY=pat-na1-xxxx
```

**Analytics (optional):**
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-xxxx
NEXT_PUBLIC_MIXPANEL_TOKEN=xxxx
```

**Notifications (optional):**
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/xxx
```

### Step 4: Deploy

Click "Deploy" - Vercel handles the rest!

### Step 5: Configure Domain

1. In Vercel, go to Settings > Domains
2. Add your domain (e.g., zoxima.com)
3. Update DNS records as instructed

---

## Alternative: Deploy to Other Platforms

### Netlify

```bash
npm run build
# Deploy .next folder
```

### AWS Amplify

```bash
amplify init
amplify add hosting
amplify publish
```

### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## Post-Deployment Checklist

- [ ] Verify all pages load
- [ ] Test all forms submit correctly
- [ ] Confirm emails are sent
- [ ] Check CRM leads are created
- [ ] Verify Slack notifications
- [ ] Test mobile responsiveness
- [ ] Check SEO meta tags
- [ ] Submit sitemap to Google Search Console
- [ ] Set up uptime monitoring
