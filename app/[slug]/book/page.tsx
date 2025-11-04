import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BookingForm from '@/components/booking/BookingForm';

export default async function BookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      settings: true,
      businessHours: {
        orderBy: { dayOfWeek: 'asc' },
      },
      tables: {
        where: { isActive: true },
        orderBy: { capacity: 'asc' },
      },
    },
  });

  if (!tenant) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{tenant.name}</h1>
              <p className="text-gray-600 mt-1 flex items-center">
                <svg className="h-5 w-5 mr-1.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Make a Reservation
              </p>
            </div>
            <a
              href={`/${tenant.slug}`}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to venue
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Book Your Table
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Fill out the form below to reserve your table. We'll confirm your reservation shortly and send you all the details.
            </p>
          </div>

          <BookingForm tenant={tenant} />
        </div>

        {/* Powered By (Free Tier) */}
        {tenant.settings?.showPoweredBy && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-100">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full mb-3">
              <svg className="h-5 w-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-sm text-gray-700 font-medium mb-2">
              Powered by <span className="font-bold text-indigo-600">Reservation System</span>
            </p>
            <a href="/signup" className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold hover:underline transition-colors">
              Get your own reservation system →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
