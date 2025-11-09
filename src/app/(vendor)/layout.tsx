import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle/db';
import { vendors } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import {
  HomeIcon,
  CubeIcon,
  EnvelopeIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

export default async function VendorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/vendor/dashboard');
  }

  // Check if user has a vendor account
  const vendorAccount = await db.query.vendors.findFirst({
    where: eq(vendors.userId, user.id),
  });

  // If no vendor account exists, redirect to onboarding
  if (!vendorAccount) {
    redirect('/vendor/onboarding');
  }

  // If vendor is not approved, show pending status
  if (vendorAccount.status === 'pending') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-yellow-100 p-3">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Pending Approval</h2>
            <p className="mt-2 text-gray-600">
              Your vendor account is currently under review. We'll notify you once it's approved.
            </p>
            <div className="mt-6">
              <Link href="/" className="text-sm text-blue-600 hover:underline">
                Return to marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (vendorAccount.status === 'rejected') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-red-100 p-3">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Application Rejected</h2>
            <p className="mt-2 text-gray-600">
              {vendorAccount.rejectionReason || 'Your vendor application was not approved.'}
            </p>
            <div className="mt-6 space-y-2">
              <Link href="/vendor/onboarding" className="block text-sm text-blue-600 hover:underline">
                Reapply
              </Link>
              <Link href="/" className="block text-sm text-gray-600 hover:underline">
                Return to marketplace
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/vendor/dashboard', icon: HomeIcon },
    { name: 'Products', href: '/vendor/products', icon: CubeIcon },
    { name: 'Inquiries', href: '/vendor/inquiries', icon: EnvelopeIcon },
    { name: 'Analytics', href: '/vendor/analytics', icon: ChartBarIcon },
    { name: 'Settings', href: '/vendor/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden w-64 border-r border-gray-200 bg-white md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <Link href="/vendor/dashboard" className="text-xl font-bold text-gray-900">
              WedStay
            </Link>
            <span className="ml-2 rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">
              Vendor
            </span>
          </div>

          {/* Vendor Info */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              {vendorAccount.logoUrl ? (
                <img
                  src={vendorAccount.logoUrl}
                  alt={vendorAccount.companyName}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white">
                  {vendorAccount.companyName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 truncate">
                <p className="truncate text-sm font-medium text-gray-900">
                  {vendorAccount.companyName}
                </p>
                <p className="truncate text-xs text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <item.icon className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <form action="/api/auth/signout" method="POST">
              <button
                type="submit"
                className="w-full rounded-md bg-gray-100 px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
