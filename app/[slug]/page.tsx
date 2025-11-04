import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function BusinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      settings: true,
      businessHours: {
        orderBy: { dayOfWeek: 'asc' },
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header
        className="relative bg-white shadow-lg overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${tenant.primaryColor}15 0%, ${tenant.primaryColor}05 100%)`,
        }}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {tenant.logo && (
              <div className="mb-6">
                <img
                  src={tenant.logo}
                  alt={tenant.name}
                  className="mx-auto h-24 w-auto drop-shadow-lg"
                />
              </div>
            )}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
              {tenant.name}
            </h1>
            {tenant.description && (
              <p className="mt-4 text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                {tenant.description}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Book Now CTA */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-10 text-center overflow-hidden border border-gray-100">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ backgroundColor: tenant.primaryColor, transform: 'translate(50%, -50%)' }}></div>
              <div className="relative">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Reserve Your Table?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Book your reservation online and secure your spot today! Quick, easy, and instant confirmation.
                </p>
                <Link
                  href={`/${tenant.slug}/book`}
                  className="inline-flex items-center px-10 py-5 text-lg font-semibold text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                  style={{ backgroundColor: tenant.primaryColor }}
                >
                  <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book a Table Now
                  <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* About */}
            {tenant.description && (
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">About Us</h3>
                </div>
                <p className="text-gray-700 leading-relaxed text-lg">{tenant.description}</p>
              </div>
            )}

            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Opening Hours</h3>
              </div>
              <div className="space-y-1">
                {tenant.businessHours.map((hours: { id: string; dayOfWeek: number; openTime: string; closeTime: string; isClosed: boolean }) => (
                  <div key={hours.id} className="flex justify-between py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-800">
                      {dayNames[hours.dayOfWeek]}
                    </span>
                    <span className="text-gray-700">
                      {hours.isClosed ? (
                        <span className="text-red-600 font-medium">Closed</span>
                      ) : (
                        <span className="font-medium">{`${hours.openTime} - ${hours.closeTime}`}</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 sticky top-8">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Contact Us</h3>
              </div>
              <div className="space-y-5">
                {tenant.phone && (
                  <div className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 bg-green-100 p-2.5 rounded-lg mr-4">
                      <svg
                        className="h-5 w-5 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Phone</div>
                      <a href={`tel:${tenant.phone}`} className="text-gray-900 font-medium hover:text-indigo-600 transition-colors text-lg">
                        {tenant.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex-shrink-0 bg-blue-100 p-2.5 rounded-lg mr-4">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email</div>
                    <a href={`mailto:${tenant.email}`} className="text-gray-900 font-medium hover:text-indigo-600 transition-colors break-all">
                      {tenant.email}
                    </a>
                  </div>
                </div>

                {tenant.address && (
                  <div className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 bg-red-100 p-2.5 rounded-lg mr-4">
                      <svg
                        className="h-5 w-5 text-red-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Address</div>
                      <p className="text-gray-900 font-medium">{tenant.address}</p>
                    </div>
                  </div>
                )}

                {tenant.website && (
                  <div className="flex items-start p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 bg-purple-100 p-2.5 rounded-lg mr-4">
                      <svg
                        className="h-5 w-5 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Website</div>
                      <a
                        href={tenant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 font-medium hover:text-indigo-600 transition-colors inline-flex items-center"
                      >
                        Visit Website
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Powered By (Free Tier) */}
            {tenant.settings?.showPoweredBy && (
              <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-2xl p-6 text-center border border-gray-200">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mb-3">
                  <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-2">
                  Powered by <span className="font-bold text-indigo-600">Reservation System</span>
                </p>
                <Link href="/signup" className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors">
                  Get your own reservation system →
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
