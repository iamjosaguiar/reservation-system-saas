# Getting Started Guide

Welcome to your Reservation System SaaS! This guide will help you get your application running locally and understand how to use all the features.

## Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

You have several options:

#### Option A: Local PostgreSQL (Recommended for Development)

```bash
# macOS (with Homebrew)
brew install postgresql
brew services start postgresql

# Create database
createdb reservation_system
```

#### Option B: Use a Hosted Database (Easiest)

Get a free database from:
- [Supabase](https://supabase.com) - Free 500MB
- [Neon](https://neon.tech) - Free tier available
- [Railway](https://railway.app) - Free trial

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and update at minimum:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/reservation_system"
NEXTAUTH_SECRET="run: openssl rand -base64 32"
```

### 4. Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## User Journey Walkthrough

### As a Business Owner

#### 1. Sign Up (http://localhost:3000/signup)
- Create your account
- Use a real email (for future email features)

#### 2. Onboarding (Automatic after signup)
- Enter your business name (e.g., "The Corner Bar")
- System auto-generates a URL slug
- Add contact information
- Submit to complete setup

#### 3. Dashboard (http://localhost:3000/dashboard)
You'll see:
- Statistics (reservations, tables)
- Quick actions
- Navigation to all features

#### 4. Set Up Tables (/dashboard/tables)
- Click "Add Table"
- Create tables: "Table 1" (4 seats), "Bar Counter" (8 seats), etc.
- Set locations (Window, Patio, etc.)
- Mark as active/inactive

#### 5. Configure Business Hours (/dashboard/hours)
- Set opening hours for each day
- Mark closed days
- Times format: 09:00 - 22:00

#### 6. Customize Settings (/dashboard/settings)
- Update business information
- Change brand color
- Copy your booking page URL
- Get widget embed code

#### 7. View Your Public Page
- Go to `http://localhost:3000/{your-slug}`
- This is what customers see
- Share this link to accept bookings

### As a Customer

#### 1. Visit Business Page
`http://localhost:3000/demo` (or your tenant's slug)

#### 2. Make a Reservation
- Click "Book a Table"
- Select date and time
- Choose party size
- Enter contact information
- Add special requests
- Submit booking

#### 3. Receive Confirmation
- See confirmation screen
- Email sent (when email service configured)

### As a Business Managing Reservations

#### 1. View Reservations (/dashboard/reservations)
- See all bookings in table format
- Filter by status (Pending, Confirmed, etc.)
- View statistics

#### 2. Manage Reservation
- Click actions on any reservation
- **Pending** → Confirm
- **Confirmed** → Seat (when they arrive)
- **Seated** → Complete (when they leave)
- Cancel or Delete as needed

## Feature Deep Dive

### Multi-Tenant System

Each business gets:
- Unique URL slug: `/{slug}`
- Isolated data (can't see other businesses)
- Own branding and colors
- Separate settings

### Embeddable Widget

Two ways to embed on your website:

#### Iframe Method
```html
<iframe
  src="http://localhost:3000/widget/your-slug"
  width="100%"
  height="700"
  frameborder="0"
></iframe>
```

#### JavaScript Method
```html
<div id="reservation-widget"></div>
<script>
  (function() {
    var iframe = document.createElement('iframe');
    iframe.src = 'http://localhost:3000/widget/your-slug';
    iframe.width = '100%';
    iframe.height = '700';
    document.getElementById('reservation-widget').appendChild(iframe);
  })();
</script>
```

### Subscription Tiers

#### FREE (Current Default)
- Unlimited bookings
- All core features
- "Powered by" branding
- Email notifications (when configured)

#### BASIC ($29/month) - To be implemented
- Remove branding
- Up to 200 bookings/month
- Priority support

#### PRO ($99/month) - To be implemented
- Unlimited bookings
- SMS notifications
- Advanced analytics
- No branding

#### ENTERPRISE (Custom) - To be implemented
- White-label
- Custom domain
- API access
- Dedicated support

## API Routes

All API routes are protected and require authentication.

### Public Routes
- `POST /api/booking` - Create reservation (public)
- `GET /api/auth/signup` - User registration

### Protected Routes (Require Authentication)

#### Tables
- `GET /api/tables` - List tables
- `POST /api/tables` - Create table
- `PUT /api/tables/{id}` - Update table
- `DELETE /api/tables/{id}` - Delete table

#### Reservations
- `GET /api/reservations` - List reservations
- `POST /api/reservations` - Create reservation (admin)
- `PUT /api/reservations/{id}` - Update reservation
- `DELETE /api/reservations/{id}` - Delete reservation

#### Settings
- `PUT /api/settings` - Update tenant settings
- `PUT /api/business-hours` - Update business hours

## Database Schema

Key models:

```
Tenant (Business)
├── Users (Staff/Owners)
├── Tables
├── Reservations
│   ├── User (Customer)
│   └── Table
├── BusinessHours (7 days)
└── TenantSettings
```

## Development Tips

### View Database

```bash
npx prisma studio
```

Opens a GUI at http://localhost:5555

### Reset Database

```bash
npx prisma migrate reset
```

WARNING: This deletes all data!

### Generate Prisma Client After Schema Changes

```bash
npx prisma generate
```

### Check Types

```bash
npx tsc --noEmit
```

## Common Tasks

### Add a New User Role

1. Update `prisma/schema.prisma`:
```prisma
enum UserRole {
  CUSTOMER
  STAFF
  OWNER
  ADMIN
  MANAGER  // New role
}
```

2. Run migration:
```bash
npx prisma migrate dev --name add_manager_role
```

### Change Brand Colors

1. Log in as business owner
2. Go to Settings
3. Click color picker
4. Save changes

### Create Test Data

Use Prisma Studio or create a seed file:

```typescript
// prisma/seed.ts
const tenant = await prisma.tenant.create({
  data: {
    name: 'Test Restaurant',
    slug: 'test-restaurant',
    // ...
  }
});
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Database Connection Error

1. Check `DATABASE_URL` in `.env`
2. Verify database is running
3. Test connection:
```bash
psql $DATABASE_URL
```

### Prisma Client Not Found

```bash
npx prisma generate
```

### Build Errors

```bash
rm -rf .next
npm run dev
```

## Next Steps

1. ✅ **Basic Setup** - You've completed this!

2. **Configure Email Notifications**
   - Sign up for [Resend](https://resend.com)
   - Add `RESEND_API_KEY` to `.env`
   - Implement email sending in `/app/api/booking/route.ts`

3. **Add Stripe Integration**
   - Sign up for [Stripe](https://stripe.com)
   - Add Stripe keys to `.env`
   - Implement subscription logic
   - Create webhook endpoint

4. **Implement SMS (Optional)**
   - Sign up for [Twilio](https://twilio.com)
   - Add credentials to `.env`
   - Add SMS sending logic

5. **Deploy to Production**
   - See [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Set up domain
   - Configure production database

6. **Add Advanced Features**
   - Calendar view
   - Availability checking
   - Table auto-assignment
   - Analytics dashboard
   - Customer management
   - Waitlist system

## Learning Resources

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Prisma
- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)

### NextAuth.js
- [NextAuth.js Docs](https://next-auth.js.org)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)

## Support & Community

- GitHub Issues: Report bugs and request features
- Documentation: Check README.md for detailed info
- Examples: See code comments for inline documentation

## Development Checklist

- [ ] Set up local database
- [ ] Configure environment variables
- [ ] Run migrations
- [ ] Create test business account
- [ ] Add sample tables
- [ ] Create test reservation
- [ ] Test booking flow
- [ ] Customize branding
- [ ] Test widget embed
- [ ] Review security settings

## Production Checklist

- [ ] Set up production database
- [ ] Configure all environment variables
- [ ] Generate secure NEXTAUTH_SECRET
- [ ] Set up email service
- [ ] Configure Stripe (if using payments)
- [ ] Set up monitoring (Sentry, etc.)
- [ ] Enable database backups
- [ ] Configure custom domain
- [ ] Test all flows in production
- [ ] Set up SSL/HTTPS
- [ ] Enable rate limiting
- [ ] Review security headers

---

Need help? Check the [README.md](./README.md) for detailed feature documentation or [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.
