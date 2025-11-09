'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitVendorOnboarding } from '@/lib/actions/vendor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface VendorOnboardingFormProps {
  userEmail: string;
}

export function VendorOnboardingForm({ userEmail }: VendorOnboardingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = await submitVendorOnboarding(formData);

      if (result.success) {
        router.push('/vendor/dashboard');
        router.refresh();
      } else {
        setError(result.error || 'Failed to submit application');
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

      {/* Company Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>

        <div>
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            name="companyName"
            required
            placeholder="Your Company LLC"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="description">Company Description *</Label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Tell us about your wedding business..."
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="(555) 123-4567"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Business Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={userEmail}
              placeholder="contact@company.com"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            name="website"
            type="url"
            placeholder="https://yourcompany.com"
            className="mt-1"
          />
        </div>
      </div>

      {/* Business Details */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>

        <div>
          <Label htmlFor="serviceAreas">Service Areas *</Label>
          <Input
            id="serviceAreas"
            name="serviceAreas"
            required
            placeholder="e.g., Los Angeles, Orange County, San Diego"
            className="mt-1"
          />
          <p className="mt-1 text-sm text-gray-500">
            Separate multiple areas with commas
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="yearsInBusiness">Years in Business</Label>
            <Input
              id="yearsInBusiness"
              name="yearsInBusiness"
              type="number"
              min="0"
              placeholder="5"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="businessLicense">Business License Number (Optional)</Label>
            <Input
              id="businessLicense"
              name="businessLicense"
              placeholder="License #"
              className="mt-1"
            />
          </div>
        </div>

        <div className="flex items-start">
          <input
            id="insuranceVerified"
            name="insuranceVerified"
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <Label htmlFor="insuranceVerified" className="ml-2 text-sm">
            I have business insurance
          </Label>
        </div>
      </div>

      {/* Terms */}
      <div className="space-y-4 border-t border-gray-200 pt-6">
        <div className="flex items-start">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
          <Label htmlFor="terms" className="ml-2 text-sm">
            I agree to the{' '}
            <a href="/terms" className="text-purple-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-purple-600 hover:underline">
              Privacy Policy
            </a>
          </Label>
        </div>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="text-sm text-gray-600">
            <strong>What happens next?</strong>
            <br />
            Our team will review your application within 1-2 business days. You'll receive an email once approved.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}
