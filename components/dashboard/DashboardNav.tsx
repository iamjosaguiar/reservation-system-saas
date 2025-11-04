'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

interface DashboardNavProps {
  tenant: {
    name: string;
    slug: string;
    subscriptionTier: string;
  };
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function DashboardNav({ tenant, user }: DashboardNavProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/dashboard', current: pathname === '/dashboard' },
    { name: 'Reservations', href: '/dashboard/reservations', current: pathname === '/dashboard/reservations' },
    { name: 'Tables', href: '/dashboard/tables', current: pathname === '/dashboard/tables' },
    { name: 'Hours', href: '/dashboard/hours', current: pathname === '/dashboard/hours' },
    { name: 'Settings', href: '/dashboard/settings', current: pathname === '/dashboard/settings' },
  ];

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
                {tenant.name}
              </Link>
              {tenant.subscriptionTier === 'FREE' && (
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  Free Plan
                </span>
              )}
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    item.current
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <Link
              href={`/${tenant.slug}`}
              target="_blank"
              className="mr-4 text-sm text-gray-600 hover:text-gray-900"
            >
              View Booking Page
            </Link>
            <div className="relative">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
