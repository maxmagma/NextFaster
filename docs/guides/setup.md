# Setup Guide

## Development Environment Setup

This guide will walk you through setting up the WedStay Marketplace development environment based on the NextFaster template.

---

## Prerequisites

### Required Software
- **Node.js** 20.0.0 or higher
- **pnpm** 9.0.0 or higher
- **Git** 2.0 or higher
- **Supabase CLI** latest version
- **PostgreSQL** 14+ (via Supabase)

### Recommended Tools
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - Prisma/Drizzle (for schema)
  - Thunder Client (API testing)

---

## Step 1: Clone and Initialize

### Clone NextFaster Template
```bash
# Clone the NextFaster repository
git clone https://github.com/ethanniser/NextFaster.git wedding-marketplace
cd wedding-marketplace

# Remove existing git history
rm -rf .git

# Initialize new repository
git init
git add .
git commit -m "Initial commit from NextFaster template"
```

### Install Dependencies
```bash
# Install with pnpm
pnpm install

# Install additional WedStay packages
pnpm add @supabase/supabase-js @supabase/ssr stripe resend replicate react-hook-form @hookform/resolvers
pnpm add -D supabase drizzle-kit @types/node
```

---

## Step 2: Supabase Setup

### Initialize Supabase
```bash
# Install Supabase CLI if not installed
npm install -g supabase

# Initialize Supabase project
supabase init

# Start local Supabase
supabase start
```

### Create Supabase Project
1. Go to [app.supabase.com](https://app.supabase.com)
2. Create new project
3. Save your project URL and keys

### Configure Storage Buckets
```bash
# Create storage buckets via Supabase Studio
# Or use SQL:
supabase db reset --local
```

```sql
-- In supabase/migrations/001_storage.sql
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('products', 'products', true),
  ('venues', 'venues', true),
  ('visualizations', 'visualizations', true),
  ('vendor-assets', 'vendor-assets', true);
```

---

## Step 3: Database Setup

### Configure Drizzle for Supabase
```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/drizzle/schema.ts',
  out: './supabase/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.SUPABASE_DB_URL!,
  },
} satisfies Config;
```

### Generate and Apply Schema
```bash
# Generate migration files
pnpm db:generate

# Push to database
pnpm db:push

# Open Drizzle Studio
pnpm db:studio
```

### Create Database Schema
```bash
# Copy the schema file from build spec
cp /path/to/schema.ts src/lib/drizzle/schema.ts

# Generate types
pnpm supabase gen types typescript --local > src/types/database.ts
```

---

## Step 4: Environment Configuration

### Create Environment Files
```bash
# Copy example file
cp .env.example .env.local
```

### Configure Environment Variables
```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
SUPABASE_DB_URL=postgresql://postgres:postgres@localhost:54322/postgres

# Upstash Redis (optional for development)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Stripe (test keys)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend (for emails)
RESEND_API_KEY=re_...

# Replicate (for AI)
REPLICATE_API_TOKEN=r8_...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="WedStay Marketplace"

# Features
NEXT_PUBLIC_ENABLE_AI_VISUALIZER=true
NEXT_PUBLIC_ENABLE_VENDOR_PORTAL=true
```

---

## Step 5: Migrate from Vercel Postgres

### Update Database Imports
```typescript
// Before (NextFaster with Vercel Postgres)
import { sql } from '@vercel/postgres';

// After (WedStay with Supabase)
import { db } from '@/lib/drizzle/db';
import { createClient } from '@/lib/supabase/server';
```

### Create Supabase Clients
```typescript
// src/lib/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

---

## Step 6: Configure Authentication

### Setup Supabase Auth
```typescript
// src/app/auth/login/page.tsx
import { createClient } from '@/lib/supabase/server';

export default function LoginPage() {
  async function signIn(formData: FormData) {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: error.message };
    }

    redirect('/dashboard');
  }

  return (
    <form action={signIn}>
      {/* Form fields */}
    </form>
  );
}
```

### Configure Auth Callback
```typescript
// src/app/auth/callback/route.ts
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(requestUrl.origin);
}
```

---

## Step 7: Seed Database

### Create Seed Script
```typescript
// scripts/seed-database.ts
import { db } from '@/lib/drizzle/db';
import { vendors, products, stylePresets } from '@/lib/drizzle/schema';
import { faker } from '@faker-js/faker';

async function seed() {
  console.log('🌱 Seeding database...');

  // Create vendors
  const vendorData = Array.from({ length: 10 }, () => ({
    userId: faker.string.uuid(),
    companyName: faker.company.name(),
    slug: faker.helpers.slugify(faker.company.name()).toLowerCase(),
    description: faker.company.catchPhrase(),
    status: 'approved',
  }));

  const insertedVendors = await db
    .insert(vendors)
    .values(vendorData)
    .returning();

  // Create products
  const productData = Array.from({ length: 100 }, () => ({
    vendorId: faker.helpers.arrayElement(insertedVendors).id,
    name: faker.commerce.productName(),
    slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
    handle: faker.string.uuid(),
    description: faker.commerce.productDescription(),
    category: faker.helpers.arrayElement(['venues', 'florals', 'decor', 'furniture', 'lighting']),
    basePrice: faker.number.float({ min: 100, max: 10000, precision: 0.01 }).toString(),
    status: 'approved',
    isActive: true,
    featured: faker.datatype.boolean(),
  }));

  await db.insert(products).values(productData);

  console.log('✅ Database seeded successfully!');
}

seed().catch(console.error);
```

### Run Seed Script
```bash
# Execute seed script
pnpm tsx scripts/seed-database.ts
```

---

## Step 8: Start Development

### Run Development Server
```bash
# Start with Turbopack
pnpm dev

# Open browser
open http://localhost:3000
```

### Verify Setup
- [ ] Homepage loads
- [ ] Database connection works
- [ ] Authentication functional
- [ ] Images load from storage
- [ ] Server actions execute

---

## Step 9: Configure IDE

### VS Code Settings
```json
// .vscode/settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

---

## Step 10: Testing Setup

### Install Testing Dependencies
```bash
pnpm add -D vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @playwright/test
```

### Configure Vitest
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
});
```

### Configure Playwright
```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm dev',
    port: 3000,
  },
});
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

#### Database Connection Failed
```bash
# Restart Supabase
supabase stop
supabase start
```

#### Type Errors
```bash
# Regenerate types
pnpm supabase gen types typescript --local > src/types/database.ts
```

#### Build Failures
```bash
# Clear cache
rm -rf .next
pnpm build
```

---

## Next Steps

1. ✅ Review [Architecture Documentation](../architecture/overview.md)
2. ✅ Explore [Feature Documentation](../features/marketplace.md)
3. ✅ Check [API Documentation](../api/server-actions.md)
4. ✅ Read [Deployment Guide](./deployment.md)

---

## Development Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run linting
pnpm type-check       # Check TypeScript

# Database
pnpm db:generate      # Generate migrations
pnpm db:push          # Push to database
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed database

# Testing
pnpm test             # Run unit tests
pnpm test:e2e         # Run E2E tests
pnpm test:watch       # Watch mode

# Utilities
pnpm analyze          # Bundle analysis
pnpm format           # Format code
```

---

## Support

For issues or questions:
1. Check documentation
2. Review common issues
3. Create GitHub issue

Happy coding! 🚀
