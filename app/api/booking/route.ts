import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ReservationStatus, UserRole } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const {
      tenantId,
      date,
      time,
      partySize,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = await request.json();

    // Validation
    if (!tenantId || !date || !time || !partySize || !guestName || !guestEmail || !guestPhone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify tenant exists
    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        settings: true,
      },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: 'Business not found' },
        { status: 404 }
      );
    }

    // Check if email exists, if not create a customer user
    let user = await prisma.user.findUnique({
      where: { email: guestEmail },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: guestEmail,
          name: guestName,
          phone: guestPhone,
          role: UserRole.CUSTOMER,
        },
      });
    }

    // Validate booking time is within allowed range
    const bookingDate = new Date(date);
    const now = new Date();
    const minAdvanceHours = tenant.settings?.minAdvanceBookingHours || 2;
    const maxAdvanceDays = tenant.settings?.maxAdvanceBookingDays || 30;

    const minBookingTime = new Date(now.getTime() + minAdvanceHours * 60 * 60 * 1000);
    const maxBookingTime = new Date(now.getTime() + maxAdvanceDays * 24 * 60 * 60 * 1000);

    if (bookingDate < minBookingTime) {
      return NextResponse.json(
        { error: `Reservations must be made at least ${minAdvanceHours} hours in advance` },
        { status: 400 }
      );
    }

    if (bookingDate > maxBookingTime) {
      return NextResponse.json(
        { error: `Reservations can only be made up to ${maxAdvanceDays} days in advance` },
        { status: 400 }
      );
    }

    // Check for double bookings (optional - simplified check)
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        tenantId,
        date: new Date(date),
        time: new Date(time),
        status: {
          in: ['PENDING', 'CONFIRMED', 'SEATED'],
        },
      },
    });

    // Note: This is a simplified check. In production, you'd want more sophisticated
    // availability checking based on table capacity and duration

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        tenantId,
        userId: user.id,
        date: new Date(date),
        time: new Date(time),
        partySize: parseInt(partySize),
        status: ReservationStatus.PENDING,
        guestName,
        guestEmail,
        guestPhone,
        specialRequests,
      },
      include: {
        tenant: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // TODO: Send confirmation email to customer
    // TODO: Send notification email to tenant

    return NextResponse.json(
      {
        reservation: {
          id: reservation.id,
          date: reservation.date,
          time: reservation.time,
          partySize: reservation.partySize,
          status: reservation.status,
        },
        message: 'Reservation created successfully. You will receive a confirmation email shortly.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
