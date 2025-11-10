# Claude AI Integration Guide for WedStay Marketplace

This guide provides context and custom slash commands for Claude AI when working on the WedStay Marketplace project.

---

## Project Context

WedStay Marketplace is a high-performance **lead generation and affiliate marketplace** for wedding products and rentals, built on the NextFaster template.

### Business Model
- **WedStay admins curate ALL products** - No vendor self-service portal
- **Affiliate/Direct Purchase** - Products link to external vendors via affiliate links or direct URLs
- **Rental Inquiries** - Lead generation for rental products, inquiry forms sent to vendors
- **No payment processing or fulfillment** - Users redirected to vendor sites or submit inquiry forms
- **Commission-based revenue** - Earn on affiliate sales and qualified leads
- **Vendors are reference data only** - Vendor info stored but vendors don't log in

### Key Technologies
- **Next.js 16** with Partial Prerendering (PPR) and Turbopack
- **Supabase** (PostgreSQL, Auth, Storage) - replacing Vercel Postgres
- **Drizzle ORM** for type-safe database queries
- **Replicate API** for AI venue visualization
- **Upstash Redis** for caching (from NextFaster)
- **Tailwind CSS** + **shadcn/ui** for styling

### Core Features
1. **Admin-Curated Marketplace** - WedStay team manages all wedding products
2. **AI Venue Visualizer** - Transform venue photos with product overlays
3. **Admin Dashboard** - Product management, inquiry handling, and analytics
4. **Inquiry System** - Lead capture and vendor communication
5. **Affiliate Integration** - Track and manage affiliate/direct product links
6. **Vision Board/Cart** - Users collect products then checkout externally

---

## Project Structure

```
wedstay-marketplace/
├── docs/                    # Comprehensive documentation
│   ├── architecture/        # System design
│   ├── guides/             # Setup and deployment
│   └── features/           # Feature specs
├── src/
│   ├── app/                # Next.js 16 App Router
│   │   ├── (category-sidebar)/  # Public marketplace (PPR enabled)
│   │   ├── (admin)/        # Admin dashboard (WedStay team)
│   │   ├── (visualizer)/   # AI venue visualizer
│   │   └── (login)/        # Authentication
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   ├── commerce/       # Shopping components
│   │   ├── visualizer/     # AI components
│   │   └── admin/          # Admin components
│   ├── lib/
│   │   ├── supabase/       # Supabase clients
│   │   ├── drizzle/        # Database schema & ORM
│   │   ├── actions/        # Server Actions
│   │   └── api/            # External API clients (Replicate, etc)
│   └── types/              # TypeScript types
├── supabase/               # Supabase config & migrations
└── scripts/                # Build scripts
```

---

## Custom Slash Commands

### `/setup-wedstay`
Initialize the WedStay project from NextFaster template.

**Context:**
- Migrates from Vercel Postgres to Supabase
- Updates dependencies for wedding marketplace features
- Creates new directory structure for vendor/admin/visualizer
- Sets up Drizzle schema with wedding-specific tables

**Tasks:**
1. Update package.json with new dependencies
2. Create Supabase client files
3. Create Drizzle schema for wedding marketplace
4. Set up environment variables
5. Create initial migration files

**Example:**
```
/setup-wedstay
```

---

### `/create-admin-dashboard`
Build the admin dashboard for WedStay team to manage all products, inquiries, and analytics.

**Context:**
- WedStay admins curate ALL products (no vendor self-service)
- Manage product catalog with affiliate links and rental inquiry forms
- Handle customer inquiries and route to vendors
- Track performance analytics and commission revenue
- Uses React Server Components for data fetching

**Tasks:**
1. Create admin layout with role-based access
2. Build product CRUD with affiliate link management
3. Implement inquiry management and vendor routing
4. Add analytics dashboard with revenue tracking
5. Create vendor reference data management

**Example:**
```
/create-admin-dashboard
```

---

### `/create-ai-visualizer`
Implement the AI venue visualizer using Replicate API.

**Context:**
- Users upload venue photos and select a style preset
- System generates new image with products overlaid
- Uses Replicate's Stable Diffusion models
- Streams generation progress to client

**Tasks:**
1. Create image upload component with Supabase Storage
2. Build style preset selector
3. Implement Replicate API integration
4. Add progress streaming with Server-Sent Events
5. Create result gallery with sharing

**Example:**
```
/create-ai-visualizer
```

---

### `/add-product-with-links`
Add a new product with affiliate link or direct purchase URL, or mark as rental inquiry.

**Context:**
- WedStay admins manually curate all products
- Products can be "purchase" (affiliate/direct link) or "rental" (inquiry form)
- Track product type, vendor reference, and commission structure
- Support both external checkout and lead generation

**Tasks:**
1. Extend product schema with purchaseUrl and productType fields
2. Create admin form for product entry with link management
3. Add product type selector (purchase vs rental)
4. Implement vendor reference dropdown
5. Add commission tracking fields

**Example:**
```
/add-product-with-links
```

---

### `/migrate-to-supabase`
Migrate existing Vercel Postgres code to Supabase.

**Context:**
- Replace @vercel/postgres imports with Supabase clients
- Update auth from custom implementation to Supabase Auth
- Migrate blob storage to Supabase Storage
- Keep using Drizzle ORM (just change connection)

**Tasks:**
1. Replace database client imports
2. Update auth implementation
3. Migrate file uploads to Supabase Storage
4. Update environment variables
5. Test all database queries

**Example:**
```
/migrate-to-supabase
```

---

### `/optimize-performance`
Run performance checks and optimizations following NextFaster patterns.

**Context:**
- Maintain NextFaster's proven performance architecture
- Ensure PPR is enabled on key pages
- Optimize images with blur placeholders
- Minimize client-side JavaScript

**Tasks:**
1. Check bundle size and analyze
2. Verify PPR configuration
3. Add missing image optimization
4. Review and optimize cache strategy
5. Run Lighthouse and fix issues

**Example:**
```
/optimize-performance
```

---

### `/add-marketplace-feature`
Add a new feature to the marketplace (products, categories, filters, etc.).

**Context:**
- Follow NextFaster's server-centric architecture
- Use Server Actions for all mutations
- Implement with React Server Components
- Add proper caching with unstable_cache

**Parameters:**
- `feature`: Name of feature (e.g., "product filters", "favorites")

**Example:**
```
/add-marketplace-feature feature="product favorites"
```

---

### `/create-server-action`
Create a new Server Action with proper validation and error handling.

**Context:**
- All mutations use Server Actions in Next.js 16
- Validate with Zod schemas
- Use Supabase client for database
- Revalidate caches appropriately

**Parameters:**
- `name`: Action name (e.g., "createInquiry")
- `entity`: Database table (e.g., "inquiries")

**Example:**
```
/create-server-action name="createInquiry" entity="inquiries"
```

---

### `/add-database-table`
Add a new table to the Drizzle schema with proper indexes and relations.

**Context:**
- Use Drizzle ORM schema definitions
- Follow existing naming conventions
- Add appropriate indexes for performance
- Include timestamps and common fields

**Parameters:**
- `table`: Table name (e.g., "reviews")

**Example:**
```
/add-database-table table="reviews"
```

---

### `/setup-stripe-integration`
Configure Stripe for payments and subscriptions.

**Context:**
- Use Stripe for product payments and vendor subscriptions
- Implement webhook handling for async events
- Store payment data in Supabase
- Follow PCI compliance best practices

**Tasks:**
1. Install and configure Stripe SDK
2. Create checkout flow with Server Actions
3. Implement webhook handler
4. Add payment success/cancel pages
5. Store transaction data

**Example:**
```
/setup-stripe-integration
```

---

## Common Patterns

### Server Actions Pattern
```typescript
'use server';

import { db } from '@/lib/drizzle/db';
import { products } from '@/lib/drizzle/schema';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const productSchema = z.object({
  name: z.string().min(1),
  price: z.string().regex(/^\d+(\.\d{2})?$/),
});

export async function createProduct(formData: FormData) {
  const data = productSchema.parse({
    name: formData.get('name'),
    price: formData.get('price'),
  });

  await db.insert(products).values(data);

  revalidatePath('/marketplace');
}
```

### Supabase Client Pattern (Server)
```typescript
import { createClient } from '@/lib/supabase/server';

export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```

### Supabase Client Pattern (Client)
```typescript
'use client';

import { createClient } from '@/lib/supabase/client';

export function useSupabase() {
  const supabase = createClient();
  return supabase;
}
```

### Cached Query Pattern
```typescript
import { unstable_cache } from 'next/cache';
import { db } from '@/lib/drizzle/db';

export const getProducts = unstable_cache(
  async (category?: string) => {
    return await db.query.products.findMany({
      where: (products, { eq }) =>
        category ? eq(products.category, category) : undefined,
    });
  },
  ['products'],
  { revalidate: 3600, tags: ['products'] }
);
```

---

## Performance Requirements

### Core Web Vitals Targets
- **LCP**: < 1.0s
- **FID**: < 50ms
- **CLS**: < 0.05
- **INP**: < 100ms

### Bundle Targets
- **First Load JS**: < 85kB
- **Per-route JS**: < 30kB

### Rendering Strategy
- Use **PPR** for marketing and product pages
- Use **Streaming SSR** for dashboards
- Use **Static** for truly static pages
- Minimize client components

---

## Database Schema Overview

### Core Tables
- `profiles` - User profiles (extends auth.users) - admins and customers only
- `vendors` - Vendor reference data (company names, websites, contact info) - NO LOGIN
- `products` - Wedding products curated by WedStay admins
- `inquiries` - Quote requests from customers for rental products
- `cart_items` - Shopping cart / vision board (server-side)
- `style_presets` - AI visualizer presets
- `visualizations` - Generated AI images

### Product Types
- **Purchase Products**: Have purchaseUrl (affiliate or direct link), no inquiry form
- **Rental Products**: Have inquiry form, routed to vendor contact

### Key Relationships
- Vendors → Products (one-to-many, reference only)
- Products have purchaseUrl for external checkout OR inquiry form enabled
- Users → Inquiries (one-to-many)
- Products → Cart Items (one-to-many)

---

## Authentication & Authorization

### User Roles
- **customer**: Browse products, create vision boards, submit inquiries
- **admin**: WedStay team - full product management, inquiry handling, analytics

### Row Level Security
All tables have RLS policies enforcing:
- Customers can only see approved/published products
- Customers can only edit their own cart items and inquiries
- Admins have full CRUD access to all tables
- Vendors table is read-only reference data (no vendor logins)

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_DB_URL=

# Stripe
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Replicate (AI)
REPLICATE_API_TOKEN=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Site
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SITE_NAME=
```

---

## Testing Strategy

### Unit Tests
- Test utility functions
- Test validation schemas
- Test business logic

### Integration Tests
- Test Server Actions
- Test database queries
- Test API integrations

### E2E Tests
- Test critical user flows
- Test checkout process
- Test vendor dashboard

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Supabase Storage buckets created
- [ ] Stripe webhooks configured
- [ ] RLS policies enabled
- [ ] Images optimized
- [ ] Performance tested (Lighthouse > 95)
- [ ] Security audit completed

---

## Resources

- [NextFaster GitHub](https://github.com/ethanniser/NextFaster)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Drizzle ORM Docs](https://orm.drizzle.team)
- [Stripe Docs](https://stripe.com/docs)
- [Replicate Docs](https://replicate.com/docs)

---

## Quick Tips for Claude

1. **Always use Server Components** unless interactivity is required
2. **Follow NextFaster patterns** - they're proven to work
3. **Use Server Actions** for all mutations, not API routes
4. **Validate with Zod** before database operations
5. **Cache aggressively** with unstable_cache and Redis
6. **Optimize images** with Next.js Image component
7. **Stream with Suspense** for dynamic content
8. **Test performance** frequently with Lighthouse

---

Last updated: November 2024
