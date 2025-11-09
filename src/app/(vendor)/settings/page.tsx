import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle/db';
import { vendors } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import { VendorSettingsForm } from '@/components/vendor/settings-form';

export const metadata = {
  title: 'Settings | Vendor Dashboard',
};

export default async function VendorSettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get vendor
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.userId, user.id),
  });

  if (!vendor) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your vendor account settings
        </p>
      </div>

      {/* Account Information */}
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
        <div className="mt-6">
          <VendorSettingsForm vendor={vendor} />
        </div>
      </div>

      {/* Account Status */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Account Status</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="mt-1 font-medium capitalize text-gray-900">
              {vendor.status}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Member Since</p>
            <p className="mt-1 font-medium text-gray-900">
              {vendor.createdAt
                ? new Date(vendor.createdAt).toLocaleDateString()
                : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Commission Rate</p>
            <p className="mt-1 font-medium text-gray-900">
              {vendor.commissionRate}%
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Insurance Verified</p>
            <p className="mt-1 font-medium text-gray-900">
              {vendor.insuranceVerified ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border-2 border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
        <p className="mt-2 text-sm text-red-700">
          Once you delete your vendor account, there is no going back. Please be certain.
        </p>
        <button className="mt-4 rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
          Delete Vendor Account
        </button>
      </div>
    </div>
  );
}
