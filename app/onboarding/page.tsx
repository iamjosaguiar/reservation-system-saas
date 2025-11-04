import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import OnboardingForm from '@/components/onboarding/OnboardingForm';
import { prisma } from '@/lib/prisma';

export default async function OnboardingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Check if user already has a tenant
  if (user.tenantId) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Set Up Your Business
            </h1>
            <p className="text-gray-600">
              Let's get your reservation system configured. This will only take a minute.
            </p>
          </div>
          <OnboardingForm userId={user.id} />
        </div>
      </div>
    </div>
  );
}
