import { requireTenant } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import ReservationStatusBadge from '@/components/reservations/ReservationStatusBadge';
import ReservationActions from '@/components/reservations/ReservationActions';

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: { status?: string; date?: string };
}) {
  const user = await requireTenant();

  const where: any = { tenantId: user.tenantId! };

  if (searchParams.status) {
    where.status = searchParams.status;
  }

  if (searchParams.date) {
    const startDate = new Date(searchParams.date);
    const endDate = new Date(searchParams.date);
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
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  });

  // Get stats
  const stats = await prisma.$transaction([
    prisma.reservation.count({
      where: { tenantId: user.tenantId!, status: 'PENDING' },
    }),
    prisma.reservation.count({
      where: { tenantId: user.tenantId!, status: 'CONFIRMED' },
    }),
    prisma.reservation.count({
      where: {
        tenantId: user.tenantId!,
        date: {
          gte: new Date(),
          lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    }),
  ]);

  const [pendingCount, confirmedCount, todayCount] = stats;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Reservations</h1>
          <p className="text-muted-foreground mt-2">Manage all your bookings</p>
        </div>
        <Link
          href="/dashboard/reservations/new"
          className="btn-glow inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Reservation
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="stat-card group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Pending</div>
            <div className="w-10 h-10 rounded-lg bg-warning-light flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{pendingCount}</div>
        </div>
        <div className="stat-card group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Confirmed</div>
            <div className="w-10 h-10 rounded-lg bg-success-light flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{confirmedCount}</div>
        </div>
        <div className="stat-card group">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Today</div>
            <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-bold text-foreground">{todayCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card-elevated p-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-foreground mb-2">
              Filter by Status
            </label>
            <select
              className="w-full px-4 py-2.5 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              defaultValue={searchParams.status || ''}
              onChange={(e) => {
                const params = new URLSearchParams(searchParams);
                if (e.target.value) {
                  params.set('status', e.target.value);
                } else {
                  params.delete('status');
                }
                window.location.href = `?${params.toString()}`;
              }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="SEATED">Seated</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="NO_SHOW">No Show</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reservations Table */}
      {reservations.length === 0 ? (
        <div className="card-elevated p-12 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-muted flex items-center justify-center mb-4">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">No reservations found</h3>
          <p className="text-muted-foreground mb-6">
            {searchParams.status || searchParams.date
              ? 'Try adjusting your filters'
              : 'Get started by creating your first reservation'}
          </p>
          {!searchParams.status && !searchParams.date && (
            <Link
              href="/dashboard/reservations/new"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-lg"
            >
              Create First Reservation
            </Link>
          )}
        </div>
      ) : (
        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                    Guest
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                    Party
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                    Table
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {reservations.map((reservation) => (
                  <tr key={reservation.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-foreground">
                        {reservation.guestName || reservation.user.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {reservation.guestEmail || reservation.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-foreground">
                        {new Date(reservation.date).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(reservation.time).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {reservation.partySize} guests
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {reservation.table?.name || 'Not assigned'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <ReservationStatusBadge status={reservation.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <ReservationActions reservationId={reservation.id} status={reservation.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
