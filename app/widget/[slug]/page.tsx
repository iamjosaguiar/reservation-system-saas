import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import BookingForm from '@/components/booking/BookingForm';

export default async function WidgetPage({ params }: { params: { slug: string } }) {
  const tenant = await prisma.tenant.findUnique({
    where: { slug: params.slug },
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

  if (!tenant || !tenant.settings?.widgetEnabled) {
    notFound();
  }

  const backgroundColor = tenant.settings.widgetBackgroundColor || '#FFFFFF';
  const textColor = tenant.settings.widgetTextColor || '#000000';

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Book a Table - {tenant.name}</title>
        <style>{`
          body {
            margin: 0;
            padding: 1rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: ${backgroundColor};
            color: ${textColor};
          }
        `}</style>
      </head>
      <body>
        <div className="widget-container">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold mb-2">{tenant.name}</h2>
            <p className="text-gray-600">Book Your Table</p>
          </div>

          <BookingForm tenant={tenant} />

          {tenant.settings.showPoweredBy && (
            <div className="mt-6 text-center text-sm text-gray-500">
              <a
                href="https://yourapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-700"
              >
                Powered by Reservation System
              </a>
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
