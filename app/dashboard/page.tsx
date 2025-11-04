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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden gradient-primary rounded-2xl shadow-2xl p-8 md:p-10 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
        <div className="relative">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Welcome Back!</h1>
          <p className="text-white/90 text-lg md:text-xl">Here's what's happening with your reservations today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="stat-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Upcoming Reservations
            </p>
            <p className="text-4xl font-bold text-foreground mb-1">
              {upcomingReservations}
            </p>
            <p className="text-sm text-muted-foreground">From today onwards</p>
          </div>
        </div>

        <div className="stat-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              This Week
            </p>
            <p className="text-4xl font-bold text-foreground mb-1">
              {thisWeekReservations}
            </p>
            <p className="text-sm text-muted-foreground">Next 7 days</p>
          </div>
        </div>

        <div className="stat-card group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Active Tables
            </p>
            <p className="text-4xl font-bold text-foreground mb-1">
              {activeTables}
            </p>
            <p className="text-sm text-muted-foreground">Available for booking</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-elevated p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">Quick Actions</h2>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/dashboard/tables"
            className="card-interactive group p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <svg className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Manage Tables</h3>
            <p className="text-sm text-muted-foreground">Add or edit your venue's tables</p>
          </Link>
          <Link
            href="/dashboard/hours"
            className="card-interactive group p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <svg className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Set Business Hours</h3>
            <p className="text-sm text-muted-foreground">Configure your opening hours</p>
          </Link>
          <Link
            href={`/${tenant?.slug}`}
            target="_blank"
            className="card-interactive group p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <svg className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">View Booking Page</h3>
            <p className="text-sm text-muted-foreground">See your public reservation page</p>
          </Link>
        </div>
      </div>

      {/* Upgrade CTA for Free Tier */}
      {tenant?.subscriptionTier === 'FREE' && (
        <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white bg-opacity-20 text-white text-sm font-medium mb-4">
                  <svg className="h-4 w-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Premium Features
                </div>
                <h2 className="text-3xl font-bold mb-3 text-white">Upgrade to Premium</h2>
                <p className="text-white text-opacity-90 mb-6 text-lg max-w-2xl">
                  Remove branding, enable SMS notifications, and get access to advanced analytics and features to grow your business.
                </p>
                <ul className="space-y-2 mb-6 text-white text-opacity-90">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Remove "Powered by" branding
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    SMS notifications for guests
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Advanced analytics and insights
                  </li>
                </ul>
                <Link
                  href="/dashboard/settings"
                  className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-indigo-600 font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl"
                >
                  View Plans
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <div className="hidden lg:block">
                <svg className="w-32 h-32 text-white opacity-20" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
