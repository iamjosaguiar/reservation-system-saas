import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SubscriptionTier, SubscriptionStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { userId, name, slug, email, phone, address, description } = await request.json();

    // Validate required fields
    if (!userId || !name || !slug || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug is already taken
    const existingTenant = await prisma.tenant.findUnique({
      where: { slug },
    });

    if (existingTenant) {
      return NextResponse.json(
        { error: 'This URL slug is already taken' },
        { status: 400 }
      );
    }

    // Create tenant with default settings
    const tenant = await prisma.tenant.create({
      data: {
        name,
        slug,
        email,
        phone,
        address,
        description,
        subscriptionTier: SubscriptionTier.FREE,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        settings: {
          create: {
            showPoweredBy: true, // Free tier shows branding
            emailNotificationsEnabled: true,
            smsNotificationsEnabled: false, // Premium only
          },
        },
        // Create default business hours (9 AM - 9 PM, Monday-Friday)
        businessHours: {
          create: [
            { dayOfWeek: 1, openTime: '09:00', closeTime: '21:00', isClosed: false }, // Monday
            { dayOfWeek: 2, openTime: '09:00', closeTime: '21:00', isClosed: false }, // Tuesday
            { dayOfWeek: 3, openTime: '09:00', closeTime: '21:00', isClosed: false }, // Wednesday
            { dayOfWeek: 4, openTime: '09:00', closeTime: '21:00', isClosed: false }, // Thursday
            { dayOfWeek: 5, openTime: '09:00', closeTime: '21:00', isClosed: false }, // Friday
            { dayOfWeek: 6, openTime: '09:00', closeTime: '21:00', isClosed: false }, // Saturday
            { dayOfWeek: 0, openTime: '09:00', closeTime: '21:00', isClosed: true },  // Sunday - closed
          ],
        },
      },
      include: {
        settings: true,
      },
    });

    // Update user to link with tenant
    await prisma.user.update({
      where: { id: userId },
      data: { tenantId: tenant.id },
    });

    return NextResponse.json(
      {
        tenant: {
          id: tenant.id,
          name: tenant.name,
          slug: tenant.slug,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
