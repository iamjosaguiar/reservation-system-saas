import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { UserRole } from '@prisma/client';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }
  return user;
}

export async function requireRole(roles: UserRole[]) {
  const user = await requireAuth();
  if (!roles.includes(user.role as UserRole)) {
    redirect('/unauthorized');
  }
  return user;
}

export async function requireTenant() {
  const user = await requireAuth();
  if (!user.tenantId) {
    redirect('/onboarding');
  }
  return user;
}

export async function getTenantFromUser() {
  const user = await requireTenant();
  return user.tenantId;
}
