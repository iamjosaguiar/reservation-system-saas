import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-utils';

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tables = await prisma.table.findMany({
      where: { tenantId: user.tenantId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ tables });
  } catch (error) {
    console.error('Tables GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user.tenantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, capacity, location, isActive } = await request.json();

    if (!name || !capacity) {
      return NextResponse.json(
        { error: 'Name and capacity are required' },
        { status: 400 }
      );
    }

    const table = await prisma.table.create({
      data: {
        name,
        capacity: parseInt(capacity),
        location,
        isActive: isActive ?? true,
        tenantId: user.tenantId,
      },
    });

    return NextResponse.json({ table }, { status: 201 });
  } catch (error) {
    console.error('Tables POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
