import { requireTenant } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import BusinessHoursForm from '@/components/hours/BusinessHoursForm';

export default async function BusinessHoursPage() {
  const user = await requireTenant();

  const businessHours = await prisma.businessHours.findMany({
    where: { tenantId: user.tenantId! },
    orderBy: { dayOfWeek: 'asc' },
  });

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Business Hours</h1>
        <p className="text-gray-600 mt-2">Set your venue's opening hours for each day of the week</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <BusinessHoursForm businessHours={businessHours} tenantId={user.tenantId!} />
      </div>
    </div>
  );
}
