import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function BusinessPage({ params }: { params: { slug: string } }) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.slug },
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header
        className="bg-white shadow"
        style={{ backgroundColor: tenant.primaryColor + '15' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {tenant.logo && (
              <img
                src={tenant.logo}
                alt={tenant.name}
                className="mx-auto h-20 w-auto mb-4"
              />
            )}
            <h1 className="text-4xl font-bold text-gray-900">{tenant.name}</h1>
            {tenant.description && (
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                {tenant.description}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Book Now CTA */}
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Reserve Your Table?
              </h2>
              <p className="text-gray-600 mb-6">
                Book your reservation online and secure your spot today!
              </p>
              <Link
                href={`/${tenant.slug}/book`}
                className="inline-block px-8 py-4 text-lg font-medium text-white rounded-lg transition"
                style={{ backgroundColor: tenant.primaryColor }}
              >
                Book a Table
              </Link>
            </div>

            {/* About */}
            {tenant.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">About Us</h3>
                <p className="text-gray-600">{tenant.description}</p>
              </div>
            )}

            {/* Business Hours */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Opening Hours</h3>
              <div className="space-y-2">
                {tenant.businessHours.map((hours) => (
                  <div key={hours.id} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="font-medium text-gray-700">
                      {dayNames[hours.dayOfWeek]}
                    </span>
                    <span className="text-gray-600">
                      {hours.isClosed ? (
                        <span className="text-red-600">Closed</span>
                      ) : (
                        `${hours.openTime} - ${hours.closeTime}`
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                {tenant.phone && (
                  <div className="flex items-start">
                    <svg
                      className="h-6 w-6 text-gray-400 mr-3 mt-0.5"
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
                    <div>
                      <div className="text-sm text-gray-500">Phone</div>
                      <a href={`tel:${tenant.phone}`} className="text-gray-900 hover:text-indigo-600">
                        {tenant.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start">
                  <svg
                    className="h-6 w-6 text-gray-400 mr-3 mt-0.5"
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
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <a href={`mailto:${tenant.email}`} className="text-gray-900 hover:text-indigo-600">
                      {tenant.email}
                    </a>
                  </div>
                </div>

                {tenant.address && (
                  <div className="flex items-start">
                    <svg
                      className="h-6 w-6 text-gray-400 mr-3 mt-0.5"
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
                    <div>
                      <div className="text-sm text-gray-500">Address</div>
                      <p className="text-gray-900">{tenant.address}</p>
                    </div>
                  </div>
                )}

                {tenant.website && (
                  <div className="flex items-start">
                    <svg
                      className="h-6 w-6 text-gray-400 mr-3 mt-0.5"
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
                    <div>
                      <div className="text-sm text-gray-500">Website</div>
                      <a
                        href={tenant.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:text-indigo-600"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Powered By (Free Tier) */}
            {tenant.settings?.showPoweredBy && (
              <div className="bg-gray-100 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                  Powered by <span className="font-medium">Reservation System</span>
                </p>
                <Link href="/signup" className="text-sm text-indigo-600 hover:underline">
                  Get your own reservation system
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
