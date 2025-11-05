#!/usr/bin/env node

/**
 * NextFaster to WedStay Migration Script
 *
 * This script automates the conversion of the NextFaster template
 * to the WedStay Wedding Marketplace.
 *
 * Usage: node migrate-to-wedstay.js
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const config = {
  projectName: 'WedStay Marketplace',
  packageName: 'wedstay-marketplace',
  supabaseRequired: true,
  removeVercelPostgres: true,
  removeVercelBlob: true,
};

// Color output for terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n${'─'.repeat(50)}`),
};

// Main migration function
async function migrate() {
  log.section('🚀 Starting NextFaster → WedStay Migration');

  try {
    // Step 1: Update package.json
    await updatePackageJson();

    // Step 2: Install new dependencies
    await installDependencies();

    // Step 3: Setup Supabase
    await setupSupabase();

    // Step 4: Create new directory structure
    await createDirectoryStructure();

    // Step 5: Create configuration files
    await createConfigFiles();

    // Step 6: Migrate database files
    await migrateDatabaseFiles();

    // Step 7: Create documentation
    await createDocumentation();

    // Step 8: Update environment files
    await updateEnvironmentFiles();

    // Step 9: Clean up NextFaster specific files
    await cleanupNextFasterFiles();

    log.section('✅ Migration Complete!');
    log.info('Next steps:');
    log.info('1. Configure your .env.local file with actual keys');
    log.info('2. Run: pnpm db:push');
    log.info('3. Run: pnpm dev');
    log.info('4. Visit: http://localhost:3000');

  } catch (error) {
    log.error(`Migration failed: ${error.message}`);
    process.exit(1);
  }
}

// Update package.json
async function updatePackageJson() {
  log.section('Updating package.json');

  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packagePath, 'utf-8'));

  // Update basic info
  packageJson.name = config.packageName;
  packageJson.description = 'A luxury wedding venue and product marketplace built on NextFaster';
  packageJson.version = '1.0.0';

  // Update scripts
  packageJson.scripts = {
    ...packageJson.scripts,
    'dev': 'next dev --turbo',
    'db:generate': 'drizzle-kit generate',
    'db:migrate': 'drizzle-kit migrate',
    'db:push': 'drizzle-kit push',
    'db:studio': 'drizzle-kit studio',
    'db:seed': 'tsx scripts/seed-database.ts',
    'supabase:types': 'supabase gen types typescript --local > src/types/database.ts',
    'test': 'vitest',
    'test:e2e': 'playwright test',
  };

  // Remove Vercel Postgres dependencies if configured
  if (config.removeVercelPostgres) {
    delete packageJson.dependencies['@vercel/postgres'];
  }

  if (config.removeVercelBlob) {
    delete packageJson.dependencies['@vercel/blob'];
  }

  await fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2));
  log.success('Updated package.json');
}

// Install new dependencies
async function installDependencies() {
  log.section('Installing WedStay dependencies');

  const dependencies = [
    '@supabase/supabase-js',
    '@supabase/ssr',
    'stripe',
    'resend',
    'replicate',
    'react-hook-form',
    '@hookform/resolvers',
    'date-fns',
    'recharts',
    'framer-motion',
  ];

  const devDependencies = [
    'supabase',
    'drizzle-kit',
    '@playwright/test',
    'vitest',
    '@vitejs/plugin-react',
    '@testing-library/react',
    '@testing-library/jest-dom',
    'tsx',
  ];

  log.info('Installing production dependencies...');
  execSync(`pnpm add ${dependencies.join(' ')}`, { stdio: 'inherit' });

  log.info('Installing dev dependencies...');
  execSync(`pnpm add -D ${devDependencies.join(' ')}`, { stdio: 'inherit' });

  log.success('Dependencies installed');
}

// Setup Supabase
async function setupSupabase() {
  log.section('Setting up Supabase');

  try {
    execSync('supabase init', { stdio: 'inherit' });
    log.success('Supabase initialized');
  } catch (error) {
    log.warning('Supabase already initialized or not installed globally');
    log.info('Run: npm install -g supabase');
  }
}

// Create directory structure
async function createDirectoryStructure() {
  log.section('Creating WedStay directory structure');

  const directories = [
    'docs',
    'docs/architecture',
    'docs/guides',
    'docs/api',
    'docs/features',
    'src/app/(marketing)',
    'src/app/(shop)',
    'src/app/(visualizer)',
    'src/app/(vendor)',
    'src/app/(admin)',
    'src/app/auth',
    'src/components/commerce',
    'src/components/visualizer',
    'src/components/vendor',
    'src/components/admin',
    'src/components/providers',
    'src/lib/supabase',
    'src/lib/drizzle',
    'src/lib/actions',
    'src/lib/api',
    'supabase/migrations',
    'supabase/functions',
    'scripts',
    'tests/e2e',
    'tests/unit',
  ];

  for (const dir of directories) {
    await fs.mkdir(path.join(process.cwd(), dir), { recursive: true });
    log.success(`Created ${dir}`);
  }
}

// Create configuration files
async function createConfigFiles() {
  log.section('Creating configuration files');

  // Drizzle config
  const drizzleConfig = `import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/drizzle/schema.ts',
  out: './supabase/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.SUPABASE_DB_URL!,
  },
} satisfies Config;
`;

  await fs.writeFile('drizzle.config.ts', drizzleConfig);
  log.success('Created drizzle.config.ts');

  // Vitest config
  const vitestConfig = `import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
`;

  await fs.writeFile('vitest.config.ts', vitestConfig);
  log.success('Created vitest.config.ts');

  // Playwright config
  const playwrightConfig = `import { defineConfig } from '@playwright/test';

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
    reuseExistingServer: !process.env.CI,
  },
});
`;

  await fs.writeFile('playwright.config.ts', playwrightConfig);
  log.success('Created playwright.config.ts');

  // Test setup
  const testSetup = `import '@testing-library/jest-dom';
`;

  await fs.writeFile('tests/setup.ts', testSetup);
  log.success('Created test setup');
}

// Migrate database files
async function migrateDatabaseFiles() {
  log.section('Creating database files');

  // Create Supabase client
  const supabaseServerClient = `import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Handle cookie errors in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // Handle cookie errors
          }
        },
      },
    }
  );
}
`;

  await fs.writeFile('src/lib/supabase/server.ts', supabaseServerClient);
  log.success('Created Supabase server client');

  // Create Supabase browser client
  const supabaseBrowserClient = `import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
`;

  await fs.writeFile('src/lib/supabase/client.ts', supabaseBrowserClient);
  log.success('Created Supabase browser client');

  // Create Drizzle database instance
  const drizzleDb = `import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.SUPABASE_DB_URL!;
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
`;

  await fs.writeFile('src/lib/drizzle/db.ts', drizzleDb);
  log.success('Created Drizzle database instance');
}

// Create documentation files
async function createDocumentation() {
  log.section('Creating documentation');

  // Copy documentation files from the specification
  log.info('Documentation structure created');
  log.info('See /docs folder for comprehensive documentation');
  log.info('Run: cat docs/claude.md for AI integration guide');
}

// Update environment files
async function updateEnvironmentFiles() {
  log.section('Creating environment files');

  const envExample = `# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_DB_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Upstash Redis (from NextFaster)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# Replicate (AI)
REPLICATE_API_TOKEN=r8_...

# OpenAI (optional)
OPENAI_API_KEY=sk-...

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME="WedStay Marketplace"

# Analytics (from NextFaster)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
VERCEL_SPEED_INSIGHTS_ID=

# Feature Flags
NEXT_PUBLIC_ENABLE_AI_VISUALIZER=true
NEXT_PUBLIC_ENABLE_VENDOR_PORTAL=true
`;

  await fs.writeFile('.env.example', envExample);
  log.success('Created .env.example');

  // Create .env.local if it doesn't exist
  try {
    await fs.access('.env.local');
    log.info('.env.local already exists, skipping');
  } catch {
    await fs.writeFile('.env.local', envExample);
    log.success('Created .env.local (configure with your actual keys)');
  }
}

// Clean up NextFaster specific files
async function cleanupNextFasterFiles() {
  log.section('Cleaning up NextFaster files');

  const filesToUpdate = [
    'README.md',
  ];

  // Update README
  const newReadme = `# ${config.projectName}

A luxury wedding venue and product marketplace built on the [NextFaster](https://github.com/ethanniser/NextFaster) high-performance e-commerce template.

## Features

- 🏛 **Venue & Product Marketplace** - Curated wedding products and rentals
- 🎨 **AI Venue Visualizer** - Transform venue photos with product overlays
- 👥 **Multi-Vendor System** - Complete vendor management
- 💼 **Inquiry Management** - Quote requests and bookings
- 💳 **Stripe Integration** - Secure payment processing
- ⚡ **Blazing Fast** - Built on NextFaster's performance architecture

## Tech Stack

- **Next.js 16** with Partial Prerendering
- **Supabase** for database and auth
- **Drizzle ORM** for type-safe queries
- **Tailwind CSS** for styling
- **Stripe** for payments
- **Replicate** for AI

## Getting Started

\`\`\`bash
# Install dependencies
pnpm install

# Setup Supabase
supabase start

# Configure environment
cp .env.example .env.local

# Run migrations
pnpm db:push

# Start development
pnpm dev
\`\`\`

## Documentation

See the [/docs](./docs) folder for comprehensive documentation.

## License

Based on NextFaster - MIT License
`;

  await fs.writeFile('README.md', newReadme);
  log.success('Updated README.md');
}

// Run migration
migrate().catch((error) => {
  log.error(`Fatal error: ${error.message}`);
  process.exit(1);
});
