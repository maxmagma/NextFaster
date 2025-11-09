import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle/db';
import { vendors, products } from '@/lib/drizzle/schema';
import { eq, sql } from 'drizzle-orm';
import { ChartBarIcon, EyeIcon, ShoppingCartIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Analytics | Vendor Dashboard',
};

export default async function VendorAnalyticsPage() {
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

  // Get all products
  const allProducts = await db.query.products.findMany({
    where: eq(products.vendorId, vendor.id),
  });

  // Calculate totals
  const totalViews = allProducts.reduce((sum, p) => sum + (p.views || 0), 0);
  const totalInquiries = allProducts.reduce((sum, p) => sum + (p.inquiries || 0), 0);
  const totalCartAdds = allProducts.reduce((sum, p) => sum + (p.cartAdds || 0), 0);

  // Get top products by views
  const topProducts = [...allProducts]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 10);

  const stats = [
    {
      name: 'Total Views',
      value: totalViews.toLocaleString(),
      icon: EyeIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Total Inquiries',
      value: totalInquiries.toLocaleString(),
      icon: ChartBarIcon,
      color: 'bg-purple-500',
    },
    {
      name: 'Cart Additions',
      value: totalCartAdds.toLocaleString(),
      icon: ShoppingCartIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Revenue',
      value: `$${vendor.totalRevenue || '0'}`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">
          Track your performance and grow your business
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-lg bg-white shadow-sm"
          >
            <div className="p-6">
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
            </div>
          </div>
        ))}
      </div>

      {/* Top Products */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Top Products by Views</h2>
        </div>

        {topProducts.length === 0 ? (
          <div className="p-12 text-center">
            <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No data yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Analytics will appear once your products start getting views
            </p>
          </div>
        ) : (
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Inquiries
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Cart Adds
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Conversion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {topProducts.map((product) => {
                  const conversionRate =
                    product.views && product.views > 0
                      ? ((product.inquiries || 0) / product.views) * 100
                      : 0;

                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ${product.basePrice}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.views || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.inquiries || 0}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.cartAdds || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">
                          {conversionRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">Performance Summary</h3>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Views per Product</span>
              <span className="font-medium text-gray-900">
                {allProducts.length > 0
                  ? Math.round(totalViews / allProducts.length)
                  : 0}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Inquiry Rate</span>
              <span className="font-medium text-gray-900">
                {totalViews > 0
                  ? ((totalInquiries / totalViews) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Published Products</span>
              <span className="font-medium text-gray-900">
                {allProducts.filter((p) => p.status === 'approved').length}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Average Rating</span>
              <span className="font-medium text-gray-900">
                {vendor.averageRating || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="font-semibold text-gray-900">Growth Tips</h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="mr-2 text-purple-600">•</span>
              <span>
                Add high-quality images to products without photos to increase views
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600">•</span>
              <span>
                Products with detailed descriptions get 3x more inquiries
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600">•</span>
              <span>
                Respond to inquiries within 24 hours to improve conversion
              </span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-purple-600">•</span>
              <span>
                Complete your vendor profile to build trust with customers
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
