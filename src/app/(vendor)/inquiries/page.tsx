import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle/db';
import { vendors, inquiries } from '@/lib/drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { EnvelopeIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Inquiries | Vendor Dashboard',
};

export default async function VendorInquiriesPage() {
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

  // Get all inquiries (this is simplified - in production you'd filter by vendor's products)
  const allInquiries = await db.query.inquiries.findMany({
    orderBy: (inquiries, { desc }) => [desc(inquiries.createdAt)],
    limit: 50,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inquiries</h1>
        <p className="mt-2 text-gray-600">
          Manage quote requests from potential customers
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Inquiries</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {allInquiries.length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-yellow-600">
            {allInquiries.filter(i => i.status === 'pending').length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Quoted</p>
          <p className="mt-1 text-2xl font-semibold text-blue-600">
            {allInquiries.filter(i => i.status === 'quoted').length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Booked</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            {allInquiries.filter(i => i.status === 'booked').length}
          </p>
        </div>
      </div>

      {/* Inquiries List */}
      <div className="rounded-lg bg-white shadow-sm">
        {allInquiries.length === 0 ? (
          <div className="p-12 text-center">
            <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No inquiries yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Inquiries will appear here when customers request quotes
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {allInquiries.map((inquiry) => (
              <div key={inquiry.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">
                        {inquiry.fullName}
                      </h3>
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          inquiry.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : inquiry.status === 'quoted'
                              ? 'bg-blue-100 text-blue-800'
                              : inquiry.status === 'booked'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {inquiry.status}
                      </span>
                    </div>

                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <EnvelopeIcon className="mr-2 h-4 w-4" />
                        {inquiry.email}
                      </div>
                      {inquiry.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <PhoneIcon className="mr-2 h-4 w-4" />
                          {inquiry.phone}
                        </div>
                      )}
                      {inquiry.eventDate && (
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {new Date(inquiry.eventDate).toLocaleDateString()}
                        </div>
                      )}
                      {inquiry.venueName && (
                        <div className="text-sm text-gray-600">
                          Venue: {inquiry.venueName}
                        </div>
                      )}
                    </div>

                    {inquiry.customerNotes && (
                      <div className="mt-3 rounded-lg bg-gray-50 p-3">
                        <p className="text-sm text-gray-700">{inquiry.customerNotes}</p>
                      </div>
                    )}

                    <div className="mt-3 text-sm text-gray-500">
                      Submitted {new Date(inquiry.createdAt!).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col space-y-2">
                    <button className="rounded-md bg-purple-600 px-4 py-2 text-sm text-white hover:bg-purple-700">
                      Respond
                    </button>
                    <button className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
