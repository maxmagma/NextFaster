'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/lib/actions/vendor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Product {
  id: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  basePrice: string;
  priceType: string;
  quantity: number | null;
  trackInventory: boolean | null;
}

interface ProductFormProps {
  product?: Product;
}

const categories = [
  'Decor',
  'Furniture',
  'Lighting',
  'Linens',
  'Tableware',
  'Floral',
  'Signage',
  'Accessories',
  'Services',
  'Other',
];

const priceTypes = [
  { value: 'rental', label: 'Rental' },
  { value: 'service', label: 'Service' },
  { value: 'package', label: 'Package' },
  { value: 'purchase', label: 'Purchase' },
];

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!product;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = isEditing
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (result.success) {
        router.push('/vendor/products');
        router.refresh();
      } else {
        setError(result.error || 'Failed to save product');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>

        <div>
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            placeholder="e.g., Elegant Crystal Chandelier"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <textarea
            id="description"
            name="description"
            required
            rows={6}
            defaultValue={product?.description || ''}
            placeholder="Describe your product in detail..."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="category">Category *</Label>
            <select
              id="category"
              name="category"
              required
              defaultValue={product?.category}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="subcategory">Subcategory (Optional)</Label>
            <Input
              id="subcategory"
              name="subcategory"
              defaultValue={product?.subcategory || ''}
              placeholder="e.g., Hanging Lights"
              className="mt-1"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Pricing</h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="basePrice">Base Price *</Label>
            <div className="relative mt-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={product?.basePrice}
                placeholder="0.00"
                className="pl-7"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="priceType">Price Type *</Label>
            <select
              id="priceType"
              name="priceType"
              required
              defaultValue={product?.priceType || 'rental'}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            >
              {priceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Inventory</h3>

        <div className="flex items-start">
          <input
            id="trackInventory"
            name="trackInventory"
            type="checkbox"
            defaultChecked={product?.trackInventory || false}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <Label htmlFor="trackInventory" className="ml-2 text-sm">
            Track inventory for this product
          </Label>
        </div>

        <div>
          <Label htmlFor="quantity">Quantity Available</Label>
          <Input
            id="quantity"
            name="quantity"
            type="number"
            min="0"
            defaultValue={product?.quantity || 1}
            placeholder="1"
            className="mt-1"
          />
          <p className="mt-1 text-sm text-gray-500">
            How many units are available for rent/sale?
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push('/vendor/products')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading
            ? 'Saving...'
            : isEditing
              ? 'Update Product'
              : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
