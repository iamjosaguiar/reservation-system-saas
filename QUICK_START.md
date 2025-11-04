# 🚀 Quick Start - Your System is Ready!

## ✅ Setup Complete

Your reservation system is fully configured and running with demo data!

## 🔑 Demo Login Credentials

**Business Owner Account:**
- Email: `owner@cornerbar.com`
- Password: `demo123`

## 🌐 Important URLs

### For Business Owners:
- **Login**: http://localhost:3001/login
- **Dashboard**: http://localhost:3001/dashboard
- **Tables Management**: http://localhost:3001/dashboard/tables
- **Reservations**: http://localhost:3001/dashboard/reservations
- **Business Hours**: http://localhost:3001/dashboard/hours
- **Settings**: http://localhost:3001/dashboard/settings

### For Customers:
- **Public Page**: http://localhost:3001/demo
- **Book a Table**: http://localhost:3001/demo/book

### Widget:
- **Embeddable Widget**: http://localhost:3001/widget/demo

### New User Signup:
- **Create Account**: http://localhost:3001/signup

## 📊 Demo Data Included

- **Business**: The Corner Bar & Grill
- **Tables**: 8 tables with various capacities (2-10 seats)
- **Business Hours**: Set for all days
- **Owner Account**: Ready to use

## 🎯 Quick Test Flow

### 1. Test as Business Owner
```
1. Go to http://localhost:3001/login
2. Login with owner@cornerbar.com / demo123
3. Explore the dashboard
4. Add/edit tables
5. View reservations
6. Update business hours
7. Get embed code from Settings
```

### 2. Test as Customer
```
1. Open http://localhost:3001/demo in new tab
2. Click "Book a Table"
3. Fill out booking form
4. Submit reservation
5. See confirmation
```

### 3. Test Widget
```
1. Open http://localhost:3001/widget/demo
2. See embeddable version
3. Try making a booking
```

### 4. Manage Reservations
```
1. Back to dashboard at http://localhost:3001/dashboard/reservations
2. See the reservation you just made
3. Click "Confirm" to confirm it
4. Try other status changes
```

## 🛠 Development Commands

```bash
# Start dev server
npm run dev

# Run database migrations
npx prisma migrate dev

# View database in GUI
npx prisma studio

# Reset database (WARNING: Deletes all data!)
npx prisma migrate reset

# Re-seed demo data
npx tsx scripts/seed-demo.ts

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Features to Test

### Business Owner Dashboard
- [x] View statistics
- [x] Manage tables (add, edit, delete)
- [x] View all reservations
- [x] Update reservation status
- [x] Set business hours
- [x] Customize brand colors
- [x] Get embed code
- [x] Copy booking links

### Customer Booking
- [x] View business information
- [x] See business hours
- [x] Select date and time
- [x] Choose party size
- [x] Enter contact info
- [x] Add special requests
- [x] Receive confirmation

### Embeddable Widget
- [x] Works in iframe
- [x] Branded with business colors
- [x] Fully functional booking form
- [x] Responsive design

## 🎨 Customization

1. **Brand Color**: Dashboard → Settings → Brand Color
2. **Business Info**: Dashboard → Settings
3. **Operating Hours**: Dashboard → Hours

## 📝 Create Your Own Business

1. Sign up at http://localhost:3001/signup
2. Complete onboarding
3. Add your tables
4. Set your hours
5. Share your unique URL!

## 🔧 Database Access

View and edit database directly:
```bash
npx prisma studio
```

Opens at http://localhost:5555

## 📚 Documentation

- **README.md** - Full feature documentation
- **DEPLOYMENT.md** - How to deploy to production
- **GETTING_STARTED.md** - Detailed guide

## 💡 Tips

1. **Testing Email**: Currently email features are not configured. Add `RESEND_API_KEY` to `.env` to enable.

2. **Multiple Businesses**: Sign up with different emails to create multiple businesses.

3. **Widget Testing**: Copy embed code from Settings and test in a local HTML file.

4. **Database Viewer**: Use Prisma Studio to see all data in real-time.

5. **Ports**: App runs on port 3001 (port 3000 was in use).

## 🚨 Troubleshooting

### Server Not Running?
```bash
npm run dev
```

### Database Connection Error?
```bash
# Check PostgreSQL is running
brew services list

# Restart if needed
brew services restart postgresql
```

### Clear Cache
```bash
rm -rf .next
npm run dev
```

## 🎉 You're All Set!

Start exploring your multi-tenant reservation system!

**First Steps:**
1. Login to dashboard
2. Create some reservations
3. Test the customer booking flow
4. Try the widget embed

---

Need help? Check the documentation files or review the code comments!
