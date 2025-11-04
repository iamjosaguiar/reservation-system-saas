import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { hours } = await request.json();

    if (!Array.isArray(hours)) {
      return NextResponse.json(
        { error: 'Invalid data format' },
        { status: 400 }
      );
    }

    // Update each day's hours
    await Promise.all(
      hours.map((hour: any) =>
        prisma.businessHours.updateMany({
          where: {
            tenantId: user.tenantId!,
            dayOfWeek: hour.dayOfWeek,
          },
          data: {
            openTime: hour.openTime,
            closeTime: hour.closeTime,
            isClosed: hour.isClosed,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Business hours update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
