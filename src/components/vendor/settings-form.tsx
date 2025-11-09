'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateVendorSettings } from '@/lib/actions/vendor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Vendor {
  id: string;
  companyName: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  serviceAreas: string[] | null;
}

interface VendorSettingsFormProps {
  vendor: Vendor;
}

export function VendorSettingsForm({ vendor }: VendorSettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateVendorSettings(formData);

      if (result.success) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(result.error || 'Failed to update settings');
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

      {success && (
        <div className="rounded-lg bg-green-50 p-4">
          <p className="text-sm text-green-800">Settings updated successfully!</p>
        </div>
      )}

      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          name="companyName"
          required
          defaultValue={vendor.companyName}
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={vendor.description || ''}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={vendor.phone || ''}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            defaultValue={vendor.email || ''}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          type="url"
          defaultValue={vendor.website || ''}
          placeholder="https://yourcompany.com"
          className="mt-1"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={loading}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
