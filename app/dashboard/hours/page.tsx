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
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Business Hours</h1>
        <p className="text-muted-foreground mt-2">Set your venue's opening hours for each day of the week</p>
      </div>

      <div className="card-elevated p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground">Configure Hours</h2>
        </div>
        <BusinessHoursForm businessHours={businessHours} tenantId={user.tenantId!} />
      </div>
    </div>
  );
}
