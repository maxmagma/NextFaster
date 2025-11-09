import { ProductForm } from '@/components/vendor/product-form';

export const metadata = {
  title: 'New Product | Vendor Dashboard',
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
        <p className="mt-2 text-gray-600">
          Create a new product listing for your wedding business
        </p>
      </div>

      <div className="rounded-lg bg-white p-8 shadow-sm">
        <ProductForm />
      </div>
    </div>
  );
}
