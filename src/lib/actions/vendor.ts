'use server';

import { createClient } from '@/lib/supabase/server';
import { db } from '@/lib/drizzle/db';
import { vendors, products } from '@/lib/drizzle/schema';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import slugify from 'slugify';

export async function submitVendorOnboarding(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if vendor already exists
    const existing = await db.query.vendors.findFirst({
      where: eq(vendors.userId, user.id),
    });

    if (existing) {
      return { success: false, error: 'Vendor account already exists' };
    }

    const companyName = formData.get('companyName') as string;
    const description = formData.get('description') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const website = formData.get('website') as string | null;
    const serviceAreasStr = formData.get('serviceAreas') as string;
    const yearsInBusiness = formData.get('yearsInBusiness') as string;
    const businessLicense = formData.get('businessLicense') as string | null;
    const insuranceVerified = formData.get('insuranceVerified') === 'on';

    // Parse service areas
    const serviceAreas = serviceAreasStr
      .split(',')
      .map(area => area.trim())
      .filter(Boolean);

    // Generate slug
    const slug = slugify(companyName, { lower: true, strict: true });

    // Create vendor
    await db.insert(vendors).values({
      userId: user.id,
      companyName,
      slug,
      description,
      phone,
      email,
      website: website || null,
      serviceAreas,
      yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : null,
      businessLicense: businessLicense || null,
      insuranceVerified,
      status: 'pending',
    });

    revalidatePath('/vendor');

    return { success: true };
  } catch (error) {
    console.error('Vendor onboarding error:', error);
    return { success: false, error: 'Failed to submit application' };
  }
}

export async function createProduct(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get vendor
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.userId, user.id),
    });

    if (!vendor || vendor.status !== 'approved') {
      return { success: false, error: 'Vendor not found or not approved' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string | null;
    const basePrice = formData.get('basePrice') as string;
    const priceType = formData.get('priceType') as string;
    const quantity = formData.get('quantity') as string;
    const trackInventory = formData.get('trackInventory') === 'on';

    // Generate slug and handle
    const slug = slugify(name, { lower: true, strict: true });
    const handle = `${slug}-${Date.now()}`;

    await db.insert(products).values({
      vendorId: vendor.id,
      name,
      slug,
      handle,
      description,
      category,
      subcategory: subcategory || null,
      basePrice,
      priceType,
      quantity: quantity ? parseInt(quantity) : 1,
      trackInventory,
      status: 'pending',
      currency: 'USD',
    });

    revalidatePath('/vendor/products');

    return { success: true };
  } catch (error) {
    console.error('Product creation error:', error);
    return { success: false, error: 'Failed to create product' };
  }
}

export async function updateProduct(productId: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get vendor
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.userId, user.id),
    });

    if (!vendor) {
      return { success: false, error: 'Vendor not found' };
    }

    // Verify product belongs to vendor
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product || product.vendorId !== vendor.id) {
      return { success: false, error: 'Product not found or access denied' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const subcategory = formData.get('subcategory') as string | null;
    const basePrice = formData.get('basePrice') as string;
    const priceType = formData.get('priceType') as string;
    const quantity = formData.get('quantity') as string;
    const trackInventory = formData.get('trackInventory') === 'on';

    await db
      .update(products)
      .set({
        name,
        description,
        category,
        subcategory: subcategory || null,
        basePrice,
        priceType,
        quantity: quantity ? parseInt(quantity) : 1,
        trackInventory,
        updatedAt: new Date(),
      })
      .where(eq(products.id, productId));

    revalidatePath('/vendor/products');

    return { success: true };
  } catch (error) {
    console.error('Product update error:', error);
    return { success: false, error: 'Failed to update product' };
  }
}

export async function deleteProduct(productId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get vendor
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.userId, user.id),
    });

    if (!vendor) {
      return { success: false, error: 'Vendor not found' };
    }

    // Verify product belongs to vendor
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId),
    });

    if (!product || product.vendorId !== vendor.id) {
      return { success: false, error: 'Product not found or access denied' };
    }

    await db.delete(products).where(eq(products.id, productId));

    revalidatePath('/vendor/products');

    return { success: true };
  } catch (error) {
    console.error('Product deletion error:', error);
    return { success: false, error: 'Failed to delete product' };
  }
}

export async function updateVendorSettings(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get vendor
    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.userId, user.id),
    });

    if (!vendor) {
      return { success: false, error: 'Vendor not found' };
    }

    const companyName = formData.get('companyName') as string;
    const description = formData.get('description') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const website = formData.get('website') as string | null;

    await db
      .update(vendors)
      .set({
        companyName,
        description,
        phone,
        email,
        website: website || null,
        updatedAt: new Date(),
      })
      .where(eq(vendors.id, vendor.id));

    revalidatePath('/vendor/settings');

    return { success: true };
  } catch (error) {
    console.error('Vendor update error:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}
