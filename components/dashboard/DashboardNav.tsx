'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LogOut, ExternalLink, LayoutDashboard, Calendar, Table, Clock, Settings } from 'lucide-react';

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
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard, current: pathname === '/dashboard' },
    { name: 'Reservations', href: '/dashboard/reservations', icon: Calendar, current: pathname === '/dashboard/reservations' },
    { name: 'Tables', href: '/dashboard/tables', icon: Table, current: pathname === '/dashboard/tables' },
    { name: 'Hours', href: '/dashboard/hours', icon: Clock, current: pathname === '/dashboard/hours' },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, current: pathname === '/dashboard/settings' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-xl shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center gap-3">
              <Link href="/dashboard" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                  <LayoutDashboard className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {tenant.name}
                </span>
              </Link>
              {tenant.subscriptionTier === 'FREE' && (
                <Badge variant="secondary" className="text-xs font-semibold">
                  Free
                </Badge>
              )}
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      item.current
                        ? 'border-primary text-primary bg-primary-light'
                        : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                    } inline-flex items-center gap-2 px-4 py-1 border-b-2 text-sm font-medium transition-all rounded-t-lg`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-muted"
            >
              <Link href={`/${tenant.slug}`} target="_blank">
                <ExternalLink className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">View Page</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Sign Out</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
