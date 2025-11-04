import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const where: any = { id };

    // Tenant owners/staff can see all their tenant's reservations
    if (user.tenantId) {
      where.tenantId = user.tenantId;
    } else {
      // Customers can only see their own
      where.userId = user.id;
    }

    const reservation = await prisma.reservation.findFirst({
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
            location: true,
          },
        },
        tenant: {
          select: {
            name: true,
            email: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ reservation });
  } catch (error) {
    console.error('Reservation GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { status, tableId, date, time, partySize, specialRequests } = await request.json();

    const updateData: any = {};
    if (status) updateData.status = status;
    if (tableId !== undefined) updateData.tableId = tableId;
    if (date) updateData.date = new Date(date);
    if (time) updateData.time = new Date(time);
    if (partySize) updateData.partySize = parseInt(partySize);
    if (specialRequests !== undefined) updateData.specialRequests = specialRequests;

    const reservation = await prisma.reservation.updateMany({
      where: {
        id,
        tenantId: user.tenantId,
      },
      data: updateData,
    });

    if (reservation.count === 0) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reservation PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const where: any = { id };

    // Allow tenant owners to delete any reservation, customers only their own
    if (user.tenantId) {
      where.tenantId = user.tenantId;
    } else {
      where.userId = user.id;
    }

    const reservation = await prisma.reservation.deleteMany({
      where,
    });

    if (reservation.count === 0) {
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reservation DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
