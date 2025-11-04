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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{tenant.name}</h1>
              <p className="text-gray-600">Make a Reservation</p>
            </div>
            <a
              href={`/${tenant.slug}`}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to venue
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Book Your Table
            </h2>
            <p className="text-gray-600">
              Fill out the form below to reserve your table. We'll confirm your reservation shortly.
            </p>
          </div>

          <BookingForm tenant={tenant} />
        </div>

        {/* Powered By (Free Tier) */}
        {tenant.settings?.showPoweredBy && (
          <div className="mt-8 bg-white rounded-lg shadow p-6 text-center">
            <p className="text-sm text-gray-600">
              Powered by <span className="font-medium">Reservation System</span>
            </p>
            <a href="/signup" className="text-sm text-indigo-600 hover:underline">
              Get your own reservation system
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
