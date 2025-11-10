import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle/db';
import { vendors, products } from '@/lib/drizzle/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';

export const metadata = {
  title: 'Edit Product | Vendor Dashboard',
};

interface EditProductPageProps {
  params: {
    id: string;
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get vendor
  const vendor = await db.query.vendors.findFirst({
    where: eq(vendors.userId, user.id),
  });

  if (!vendor) {
    redirect('/admin/dashboard');
  }

  // Get product
  const product = await db.query.products.findFirst({
    where: eq(products.id, params.id),
  });

  if (!product || product.vendorId !== vendor.id) {
    redirect('/admin/products');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="mt-2 text-gray-600">
          Update your product information
        </p>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
