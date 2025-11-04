# Deployment Guide

This guide will help you deploy your Reservation System SaaS application to production.

## Prerequisites

- PostgreSQL database (hosted)
- Vercel account (recommended) or any Node.js hosting
- Domain name (optional)
- Email service account (Resend or SendGrid)
- Stripe account for payments (optional, for premium features)
- Twilio account for SMS (optional, for premium features)

## Quick Deploy to Vercel (Recommended)

### 1. Set Up Database

Choose one of these PostgreSQL hosting providers:

#### Option A: Vercel Postgres
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Create Postgres database
vercel postgres create
```

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Get the connection string from Settings → Database

#### Option C: Neon
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 2. Configure Environment Variables

Create a `.env.local` file or set them in Vercel dashboard:

```env
# Database
DATABASE_URL="your-postgres-connection-string"

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-generated-secret"

# App
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Optional: Stripe (for subscriptions)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Optional: Email (Resend)
RESEND_API_KEY="re_..."

# Optional: SMS (Twilio)
TWILIO_ACCOUNT_SID="ACxxxx"
TWILIO_AUTH_TOKEN="your-auth-token"
TWILIO_PHONE_NUMBER="+1234567890"
```

### 3. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Copy the output and set it as `NEXTAUTH_SECRET`.

### 4. Deploy to Vercel

```bash
# Install dependencies
npm install

# Build locally to test
npm run build

# Deploy
vercel --prod
```

Or use the Vercel dashboard:
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your Git repository
3. Add environment variables
4. Deploy

### 5. Run Database Migrations

After deployment, run migrations:

```bash
# Using Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
npx prisma generate
```

Or set up a GitHub Action for automatic migrations (see below).

## Deploy to Other Platforms

### Railway

1. Create account at [railway.app](https://railway.app)
2. Create new project from GitHub
3. Add PostgreSQL database
4. Add environment variables
5. Deploy

### Render

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Add PostgreSQL database
5. Set environment variables
6. Deploy

### DigitalOcean App Platform

1. Create account at [digitalocean.com](https://digitalocean.com)
2. Create new App
3. Connect GitHub
4. Add Managed Database (PostgreSQL)
5. Configure environment variables
6. Deploy

## Database Setup

### Run Migrations

```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
```

### Seed Initial Data (Optional)

Create a seed file:

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create demo tenant
  const demoTenant = await prisma.tenant.create({
    data: {
      name: 'Demo Restaurant',
      slug: 'demo',
      email: 'demo@example.com',
      phone: '+1234567890',
      // ... other fields
    },
  });

  console.log('Seeded demo tenant:', demoTenant);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:
```bash
npx prisma db seed
```

## Custom Domain Setup

### On Vercel

1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` environment variables

## Email Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain
3. Get API key
4. Set `RESEND_API_KEY` environment variable

## SMS Setup (Twilio)

1. Sign up at [twilio.com](https://twilio.com)
2. Get a phone number
3. Get Account SID and Auth Token
4. Set Twilio environment variables

## Stripe Setup

1. Sign up at [stripe.com](https://stripe.com)
2. Get API keys (publishable and secret)
3. Set up products and prices
4. Configure webhook endpoint: `https://your-domain.com/api/webhooks/stripe`
5. Set environment variables

## Security Checklist

- [ ] Generate strong `NEXTAUTH_SECRET`
- [ ] Use environment variables for all secrets
- [ ] Enable CORS protection
- [ ] Set up rate limiting
- [ ] Enable HTTPS only
- [ ] Configure CSP headers
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure database backups
- [ ] Set up error tracking
- [ ] Enable 2FA for admin accounts

## Monitoring & Logging

### Vercel Analytics

Built-in analytics are automatically enabled.

### Sentry (Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### LogRocket (Session Replay)

```bash
npm install logrocket
```

## Performance Optimization

### Enable Caching

```typescript
// next.config.ts
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=3600',
        },
      ],
    },
  ],
};
```

### Enable Image Optimization

Images are automatically optimized with Next.js Image component.

## CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run Prisma migrations
        run: npx prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        run: vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

## Backup Strategy

### Database Backups

```bash
# Automated daily backups (example with pg_dump)
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
```

### File Backups

If you allow file uploads (logos, etc.), set up automated backups:
- Vercel Blob Storage
- AWS S3
- Cloudflare R2

## Troubleshooting

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues

- Check `DATABASE_URL` format
- Verify database is accessible from deployment region
- Check connection pooling settings
- Enable SSL for production databases

### Authentication Issues

- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Ensure cookies are enabled

## Post-Deployment

1. Test all user flows
2. Verify email sending works
3. Test payment processing (Stripe)
4. Check mobile responsiveness
5. Run security audit
6. Set up monitoring alerts
7. Document admin procedures

## Scaling Considerations

### Database
- Enable connection pooling (Prisma Accelerate or PgBouncer)
- Add read replicas for high traffic
- Optimize queries with indexes

### Application
- Enable edge caching
- Use CDN for static assets
- Implement Redis for session storage
- Consider serverless functions for background jobs

## Support

For issues:
1. Check logs in Vercel dashboard
2. Review Prisma logs
3. Check error tracking (Sentry)
4. Contact support channels

## Updates

To update the application:

```bash
git pull origin main
npm install
npx prisma migrate deploy
npm run build
vercel --prod
```

## Cost Estimates

### Minimum (Free Tier)
- Vercel: Free (Hobby plan)
- Supabase: Free (500MB database)
- Resend: Free (100 emails/day)
- Total: $0/month

### Production (Low Traffic)
- Vercel: $20/month (Pro plan)
- Neon: $19/month (Launch plan)
- Resend: $20/month (up to 50k emails)
- Total: ~$60/month

### Production (High Traffic)
- Vercel: $20/month (Pro plan)
- Database: $50-200/month
- Email: $50-100/month
- Stripe: 2.9% + $0.30 per transaction
- Total: ~$120-320/month + transaction fees
