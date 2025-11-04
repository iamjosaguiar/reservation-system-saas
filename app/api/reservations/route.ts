import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';
import { ReservationStatus } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const date = searchParams.get('date');

    const where: any = {};

    // If user has tenantId, they can see all reservations for their tenant
    if (user.tenantId) {
      where.tenantId = user.tenantId;
    } else {
      // Regular customers can only see their own reservations
      where.userId = user.id;
    }

    if (status) {
      where.status = status;
    }

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      where.date = {
        gte: startDate,
        lt: endDate,
      };
    }

    const reservations = await prisma.reservation.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
        table: {
          select: {
            name: true,
            capacity: true,
          },
        },
      },
      orderBy: [{ date: 'desc' }, { time: 'desc' }],
    });

    return NextResponse.json({ reservations });
  } catch (error) {
    console.error('Reservations GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      tenantId,
      userId,
      tableId,
      date,
      time,
      partySize,
      guestName,
      guestEmail,
      guestPhone,
      specialRequests,
    } = await request.json();

    // Validation
    if (!date || !time || !partySize) {
      return NextResponse.json(
        { error: 'Date, time, and party size are required' },
        { status: 400 }
      );
    }

    // Determine the actual tenantId and userId
    let actualTenantId = tenantId;
    let actualUserId = userId || user.id;

    // If user is making a reservation for their own tenant
    if (user.tenantId) {
      actualTenantId = user.tenantId;
    }

    if (!actualTenantId) {
      return NextResponse.json(
        { error: 'Tenant ID is required' },
        { status: 400 }
      );
    }

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        tenantId: actualTenantId,
        userId: actualUserId,
        tableId,
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
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        table: {
          select: {
            name: true,
          },
        },
      },
    });

    // TODO: Send confirmation email

    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) {
    console.error('Reservations POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
