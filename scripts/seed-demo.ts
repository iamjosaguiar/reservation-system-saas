import { PrismaClient, UserRole, SubscriptionTier, SubscriptionStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding demo data...');

  // Create demo tenant
  const demoTenant = await prisma.tenant.create({
    data: {
      name: 'The Corner Bar & Grill',
      slug: 'demo',
      email: 'info@cornerbar.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main Street, San Francisco, CA 94102',
      description: 'A cozy neighborhood bar and grill serving craft cocktails and comfort food. Join us for happy hour, weekend brunch, or dinner with friends.',
      website: 'https://cornerbar.com',
      primaryColor: '#6366F1',
      subscriptionTier: SubscriptionTier.FREE,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      settings: {
        create: {
          maxAdvanceBookingDays: 30,
          minAdvanceBookingHours: 2,
          defaultReservationDuration: 120,
          emailNotificationsEnabled: true,
          smsNotificationsEnabled: false,
          reminderHoursBefore: 24,
          showPoweredBy: true,
          widgetEnabled: true,
          widgetBackgroundColor: '#FFFFFF',
          widgetTextColor: '#000000',
        },
      },
      businessHours: {
        create: [
          { dayOfWeek: 0, openTime: '11:00', closeTime: '22:00', isClosed: false }, // Sunday
          { dayOfWeek: 1, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Monday
          { dayOfWeek: 2, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Tuesday
          { dayOfWeek: 3, openTime: '11:00', closeTime: '23:00', isClosed: false }, // Wednesday
          { dayOfWeek: 4, openTime: '11:00', closeTime: '00:00', isClosed: false }, // Thursday
          { dayOfWeek: 5, openTime: '11:00', closeTime: '01:00', isClosed: false }, // Friday
          { dayOfWeek: 6, openTime: '10:00', closeTime: '01:00', isClosed: false }, // Saturday
        ],
      },
    },
  });

  console.log('✅ Created demo tenant:', demoTenant.name);

  // Create demo owner account
  const hashedPassword = await bcrypt.hash('demo123', 10);
  const demoOwner = await prisma.user.create({
    data: {
      email: 'owner@cornerbar.com',
      name: 'John Smith',
      password: hashedPassword,
      role: UserRole.OWNER,
      tenantId: demoTenant.id,
      phone: '+1 (555) 987-6543',
    },
  });

  console.log('✅ Created demo owner account:', demoOwner.email, '(password: demo123)');

  // Create demo tables
  const tables = await prisma.table.createMany({
    data: [
      { tenantId: demoTenant.id, name: 'Table 1', capacity: 2, location: 'Window', isActive: true },
      { tenantId: demoTenant.id, name: 'Table 2', capacity: 4, location: 'Main Floor', isActive: true },
      { tenantId: demoTenant.id, name: 'Table 3', capacity: 4, location: 'Main Floor', isActive: true },
      { tenantId: demoTenant.id, name: 'Table 4', capacity: 6, location: 'Main Floor', isActive: true },
      { tenantId: demoTenant.id, name: 'Table 5', capacity: 8, location: 'Private Room', isActive: true },
      { tenantId: demoTenant.id, name: 'Bar Counter', capacity: 10, location: 'Bar', isActive: true },
      { tenantId: demoTenant.id, name: 'Patio Table 1', capacity: 4, location: 'Patio', isActive: true },
      { tenantId: demoTenant.id, name: 'Patio Table 2', capacity: 4, location: 'Patio', isActive: true },
    ],
  });

  console.log('✅ Created', tables.count, 'demo tables');

  // Create some demo customers
  const customers = await prisma.user.createMany({
    data: [
      {
        email: 'alice@example.com',
        name: 'Alice Johnson',
        role: UserRole.CUSTOMER,
        phone: '+1 (555) 111-2222',
      },
      {
        email: 'bob@example.com',
        name: 'Bob Williams',
        role: UserRole.CUSTOMER,
        phone: '+1 (555) 333-4444',
      },
    ],
  });

  console.log('✅ Created', customers.count, 'demo customers');

  console.log('\n🎉 Demo data seeded successfully!');
  console.log('\n📋 Login credentials:');
  console.log('   Email: owner@cornerbar.com');
  console.log('   Password: demo123');
  console.log('\n🌐 URLs:');
  console.log('   Dashboard: http://localhost:3001/login');
  console.log('   Public Page: http://localhost:3001/demo');
  console.log('   Booking Page: http://localhost:3001/demo/book');
  console.log('   Widget: http://localhost:3001/widget/demo');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
