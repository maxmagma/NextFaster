import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle/db';
import { vendors, products } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ProductsList } from '@/components/vendor/products-list';

export const metadata = {
  title: 'Products | Vendor Dashboard',
};

export default async function VendorProductsPage() {
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
    orderBy: (products, { desc }) => [desc(products.createdAt)],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-2 text-gray-600">
            Manage your wedding products and services
          </p>
        </div>
        <Link
          href="/vendor/products/new"
          className="inline-flex items-center rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {allProducts.length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Published</p>
          <p className="mt-1 text-2xl font-semibold text-green-600">
            {allProducts.filter(p => p.status === 'approved').length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="mt-1 text-2xl font-semibold text-yellow-600">
            {allProducts.filter(p => p.status === 'pending').length}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-600">Draft</p>
          <p className="mt-1 text-2xl font-semibold text-gray-600">
            {allProducts.filter(p => p.status === 'draft').length}
          </p>
        </div>
      </div>

      {/* Products List */}
      <ProductsList products={allProducts} />
    </div>
  );
}
