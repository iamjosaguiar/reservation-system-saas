import { requireTenant } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await requireTenant();

  const [tenant, stats] = await Promise.all([
    prisma.tenant.findUnique({
      where: { id: user.tenantId! },
      include: {
        settings: true,
      },
    }),
    prisma.$transaction([
      prisma.reservation.count({
        where: {
          tenantId: user.tenantId!,
          date: {
            gte: new Date(),
          },
        },
      }),
      prisma.reservation.count({
        where: {
          tenantId: user.tenantId!,
          date: {
            gte: new Date(),
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.table.count({
        where: {
          tenantId: user.tenantId!,
          isActive: true,
        },
      }),
    ]),
  ]);

  const [upcomingReservations, thisWeekReservations, activeTables] = stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your reservations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Upcoming Reservations
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {upcomingReservations}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    This Week
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {thisWeekReservations}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Tables
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {activeTables}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/tables"
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <h3 className="font-medium text-gray-900">Manage Tables</h3>
            <p className="text-sm text-gray-500 mt-1">Add or edit your venue's tables</p>
          </Link>
          <Link
            href="/dashboard/hours"
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <h3 className="font-medium text-gray-900">Set Business Hours</h3>
            <p className="text-sm text-gray-500 mt-1">Configure your opening hours</p>
          </Link>
          <Link
            href={`/${tenant?.slug}`}
            target="_blank"
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <h3 className="font-medium text-gray-900">View Booking Page</h3>
            <p className="text-sm text-gray-500 mt-1">See your public reservation page</p>
          </Link>
        </div>
      </div>

      {/* Upgrade CTA for Free Tier */}
      {tenant?.subscriptionTier === 'FREE' && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-2">Upgrade to Premium</h2>
          <p className="mb-4">
            Remove branding, enable SMS notifications, and get access to advanced features.
          </p>
          <Link
            href="/dashboard/settings"
            className="inline-block bg-white text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
          >
            View Plans
          </Link>
        </div>
      )}
    </div>
  );
}
