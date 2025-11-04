# Restaurant & Bar Reservation System (SaaS)

A modern, multi-tenant reservation system built with Next.js 14+, featuring a freemium model with embeddable widgets.

## Features

### Completed ✅

1. **Multi-Tenant Architecture**
   - Single database with tenant isolation
   - Unique slug-based URLs for each business
   - Row-level data separation

2. **Authentication System**
   - NextAuth.js v5 with credentials provider
   - Password hashing with bcryptjs
   - Role-based access control (CUSTOMER, STAFF, OWNER, ADMIN)
   - Session management with JWT

3. **Database Schema (Prisma + PostgreSQL)**
   - Tenants/Businesses
   - Users (multi-role)
   - Reservations
   - Tables
   - Business Hours
   - Tenant Settings
   - Payments (for Stripe integration)
   - Subscription tiers (FREE, BASIC, PRO, ENTERPRISE)

4. **Business Onboarding**
   - User signup flow
   - Business profile creation
   - Automatic slug generation
   - Default business hours setup
   - Default tenant settings

5. **Admin Dashboard**
   - Dashboard layout with navigation
   - Overview page with stats
   - Quick actions
   - Upgrade prompts for free tier

6. **Tables Management** ✅
   - Full CRUD operations for tables
   - Table capacity and location tracking
   - Active/inactive status management
   - Table assignment to reservations

7. **Reservation Management** ✅
   - Complete reservation dashboard
   - Create, view, edit, and delete reservations
   - Status workflow (pending → confirmed → seated → completed)
   - Cancel reservations
   - Filter by status and date
   - Real-time statistics (pending, confirmed, today's bookings)
   - Guest information tracking

8. **Business Hours Management** ✅
   - Edit opening hours for each day of the week
   - Mark specific days as closed
   - Time range selection (open/close times)
   - Visual interface for quick updates

9. **Customer Booking Interface** ✅
   - Beautiful public booking page (/{slug})
   - Date and time picker with validation
   - Party size selection
   - Guest information form
   - Special requests field
   - Booking confirmation screen
   - Contact information display
   - Business hours display
   - Branded with tenant colors

10. **Embeddable Widget** ✅
    - Standalone widget page (/widget/{slug})
    - Both iframe and JavaScript embed options
    - Copy-to-clipboard embed code generator
    - Customizable colors (background, text)
    - Fully responsive design
    - "Powered by" branding (free tier)
    - Widget preview

11. **Settings & Configuration** ✅
    - Venue information management
    - Brand color customization
    - Booking links (direct copy)
    - Widget embed code generator
    - Subscription tier display
    - Advance booking settings

### To Be Completed 🚧

1. **Stripe Integration**
   - Subscription payment processing
   - Webhook handling
   - Plan upgrades/downgrades
   - Customer portal
   - Usage-based billing
   - Free tier limitations enforcement

2. **Email Notifications**
   - Booking confirmations
   - Reminder emails (24 hours before)
   - Cancellation notices
   - Integration with Resend or SendGrid
   - Email templates

3. **SMS Notifications (Premium)**
   - Twilio integration
   - SMS reminders
   - Confirmation messages
   - Status updates

4. **Advanced Features**
   - Calendar view for reservations
   - Availability checking (prevent double bookings)
   - Table auto-assignment based on party size
   - Custom domain support (premium)
   - Logo upload
   - Advanced analytics and reporting
   - Customer database
   - Waitlist management
   - QR code check-in

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js v5
- **Payment**: Stripe (to be integrated)
- **SMS**: Twilio (to be integrated)
- **Email**: Resend (to be integrated)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd reservation-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and other credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/reservation_system"
NEXTAUTH_SECRET="your-secret-key"
# Add other API keys as needed
```

4. Set up the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

### Option 1: Local PostgreSQL

1. Install PostgreSQL
2. Create a database:
```sql
CREATE DATABASE reservation_system;
```
3. Update `DATABASE_URL` in `.env`

### Option 2: Hosted PostgreSQL

Use one of these providers:
- **Vercel Postgres**: Integrated with Vercel deployments
- **Supabase**: Free tier with 500MB database
- **Neon**: Serverless PostgreSQL
- **Railway**: Simple deployment

Get the connection string from your provider and update `DATABASE_URL`.

### Running Migrations

```bash
npx prisma migrate dev
```

## Project Structure

```
├── app/
│   ├── (auth)/          # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── api/             # API routes
│   │   ├── auth/        # NextAuth & signup
│   │   └── onboarding/  # Business setup
│   ├── dashboard/       # Admin dashboard
│   ├── onboarding/      # Business onboarding
│   └── [slug]/          # Public booking pages (to be built)
├── components/
│   ├── auth/            # Auth forms
│   ├── dashboard/       # Dashboard components
│   └── onboarding/      # Onboarding forms
├── lib/
│   ├── prisma.ts        # Prisma client
│   └── auth-utils.ts    # Auth helpers
├── prisma/
│   └── schema.prisma    # Database schema
├── types/
│   └── next-auth.d.ts   # NextAuth type extensions
├── auth.ts              # NextAuth configuration
├── auth.config.ts       # Auth config
└── middleware.ts        # Route protection
```

## User Flow

### Business Owner Flow

1. Sign up at `/signup`
2. Complete onboarding at `/onboarding`
3. Access dashboard at `/dashboard`
4. Configure tables, hours, and settings
5. Share booking page: `yourapp.com/{slug}`

### Customer Flow

1. Visit booking page: `yourapp.com/{slug}`
2. Select date, time, and party size
3. Enter contact information
4. Receive confirmation (email/SMS for premium)

## Multi-Tenancy

The system uses a single database with tenant isolation:

- Each business (tenant) has a unique `tenantId`
- All queries filter by `tenantId`
- Users can be associated with a tenant (staff/owners) or independent (customers)
- Middleware ensures users only access their tenant's data

## Subscription Tiers

### FREE
- Basic reservation system
- Branded interface ("Powered by")
- Email notifications
- Up to 50 reservations/month (can be configured)

### BASIC ($29/month)
- Remove branding
- Up to 200 reservations/month
- Email notifications
- Basic analytics

### PRO ($99/month)
- Unbranded
- Unlimited reservations
- SMS notifications
- Email notifications
- Priority support
- Advanced analytics

### ENTERPRISE (Custom)
- Custom pricing
- White-label
- Custom domain
- API access
- Dedicated support

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
npm start
```

### Database Commands
```bash
# Create a migration
npx prisma migrate dev --name your_migration_name

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project to Vercel
3. Add environment variables
4. Deploy

### Other Platforms

The app can be deployed to any platform supporting Node.js:
- Netlify
- Railway
- Render
- AWS
- DigitalOcean

## Next Steps

1. **Complete Reservation System**: Build the core booking functionality
2. **Public Booking Pages**: Create customer-facing interfaces
3. **Stripe Integration**: Add payment processing
4. **Email/SMS**: Set up notification systems
5. **Embeddable Widget**: Create iframe/script embed
6. **Analytics**: Add booking analytics and reports
7. **Testing**: Add unit and integration tests
8. **Documentation**: API documentation

## Security Considerations

- ✅ Passwords hashed with bcryptjs
- ✅ JWT sessions
- ✅ Environment variables for secrets
- ✅ SQL injection prevention (Prisma ORM)
- ⚠️ Add rate limiting for API routes
- ⚠️ Add CSRF protection
- ⚠️ Implement API key authentication for embeds

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[Your License Here]

## Support

For support, email support@yourapp.com or join our Slack channel.
