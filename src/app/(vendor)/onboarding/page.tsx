import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle/db';
import { vendors } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import { VendorOnboardingForm } from '@/components/vendor/onboarding-form';

export const metadata = {
  title: 'Become a Vendor | WedStay',
  description: 'Join WedStay as a wedding vendor',
};

export default async function VendorOnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirect=/vendor/onboarding');
  }

  // Check if vendor already exists
  const existingVendor = await db.query.vendors.findFirst({
    where: eq(vendors.userId, user.id),
  });

  // If vendor exists and is approved, redirect to dashboard
  if (existingVendor?.status === 'approved') {
    redirect('/vendor/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Become a Vendor</h1>
          <p className="mt-4 text-lg text-gray-600">
            Join WedStay and showcase your wedding products to thousands of couples
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Reach More Couples</h3>
            <p className="mt-2 text-sm text-gray-600">
              Connect with engaged couples actively planning their weddings
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Grow Your Business</h3>
            <p className="mt-2 text-sm text-gray-600">
              Get analytics and insights to optimize your listings
            </p>
          </div>

          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">Easy Management</h3>
            <p className="mt-2 text-sm text-gray-600">
              Simple tools to manage products, inquiries, and orders
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="mt-12 rounded-lg bg-white p-8 shadow-sm">
          <VendorOnboardingForm userEmail={user.email || ''} />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <a href="/vendor/dashboard" className="text-purple-600 hover:underline">
            Go to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
