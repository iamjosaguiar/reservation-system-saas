import { redirect } from 'next/navigation';
import { requireTenant } from '@/lib/auth-utils';
import DashboardNav from '@/components/dashboard/DashboardNav';
import { prisma } from '@/lib/prisma';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireTenant();

  const tenant = await prisma.tenant.findUnique({
    where: { id: user.tenantId! },
    select: {
      name: true,
      slug: true,
      subscriptionTier: true,
    },
  });

  if (!tenant) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <DashboardNav tenant={tenant} user={user} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
