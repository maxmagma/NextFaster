import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle/db';
import { vendors, products, inquiries, orders } from '@/lib/drizzle/schema';
import { eq, and, gte, sql } from 'drizzle-orm';
import Link from 'next/link';
import {
  CubeIcon,
  EnvelopeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Vendor Dashboard | WedStay',
};

export default async function VendorDashboard() {
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

  // Get statistics
  const [productCount, pendingInquiries, totalProducts, recentProducts] = await Promise.all([
    // Total products
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(eq(products.vendorId, vendor.id))
      .then(r => r[0]?.count || 0),

    // Pending inquiries (mock - need to implement inquiry filtering)
    Promise.resolve(0),

    // Get all products for vendor
    db.query.products.findMany({
      where: eq(products.vendorId, vendor.id),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: 10,
    }),

    // Recent products
    db.query.products.findMany({
      where: eq(products.vendorId, vendor.id),
      orderBy: (products, { desc }) => [desc(products.createdAt)],
      limit: 5,
    }),
  ]);

  const stats = [
    {
      name: 'Total Products',
      value: productCount.toString(),
      icon: CubeIcon,
      href: '/admin/products',
      color: 'bg-blue-500',
    },
    {
      name: 'Pending Inquiries',
      value: pendingInquiries.toString(),
      icon: EnvelopeIcon,
      href: '/admin/inquiries',
      color: 'bg-purple-500',
    },
    {
      name: 'Total Revenue',
      value: `$${vendor.totalRevenue || '0'}`,
      icon: CurrencyDollarIcon,
      href: '/admin/analytics',
      color: 'bg-green-500',
    },
    {
      name: 'Product Views',
      value: totalProducts.reduce((sum, p) => sum + (p.views || 0), 0).toString(),
      icon: ChartBarIcon,
      href: '/admin/analytics',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back, {vendor.companyName}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.name}
            href={stat.href}
            className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center">
              <div className={`rounded-lg ${stat.color} p-3`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-1 text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/products/new"
            className="flex items-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-purple-500 hover:bg-purple-50"
          >
            <div className="w-full">
              <CubeIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">Add Product</p>
            </div>
          </Link>

          <Link
            href="/admin/inquiries"
            className="flex items-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-purple-500 hover:bg-purple-50"
          >
            <div className="w-full">
              <EnvelopeIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">View Inquiries</p>
            </div>
          </Link>

          <Link
            href="/admin/analytics"
            className="flex items-center rounded-lg border-2 border-dashed border-gray-300 p-4 text-center transition-colors hover:border-purple-500 hover:bg-purple-50"
          >
            <div className="w-full">
              <ChartBarIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">View Analytics</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Products */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Products</h2>
            <Link
              href="/admin/products"
              className="text-sm text-purple-600 hover:underline"
            >
              View all
            </Link>
          </div>
        </div>

        {recentProducts.length === 0 ? (
          <div className="p-12 text-center">
            <CubeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first product.
            </p>
            <div className="mt-6">
              <Link
                href="/admin/products/new"
                className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
              >
                <CubeIcon className="-ml-1 mr-2 h-5 w-5" />
                Add Product
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {recentProducts.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}`}
                className="block px-6 py-4 transition-colors hover:bg-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span className="capitalize">{product.status}</span>
                      <span>${product.basePrice}</span>
                      <span>{product.category}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {product.views || 0} views
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.inquiries || 0} inquiries
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Account Status */}
      {vendor.status === 'pending' && (
        <div className="rounded-lg bg-yellow-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Account Pending Approval
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Your vendor account is under review. You'll be notified once approved.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
