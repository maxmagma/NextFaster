# Architecture Overview

## System Architecture

WedStay Marketplace is built on NextFaster's proven high-performance architecture, adapted for the wedding industry with additional AI capabilities and multi-vendor support.

---

## Core Architecture Principles

### 1. Performance-First Design
- **Partial Prerendering (PPR)**: Static shells with streaming dynamic content
- **React Server Components**: Minimal client-side JavaScript
- **Edge Runtime**: Global distribution with low latency
- **Optimized Images**: Automatic optimization with blur placeholders

### 2. Server-Centric Approach
- **Server Actions**: All mutations through type-safe server functions
- **Server-Side Rendering**: SEO-optimized with streaming
- **Database Queries**: Direct from components with caching
- **Session Management**: Server-side with Supabase

### 3. Type Safety
- **End-to-End TypeScript**: From database to frontend
- **Zod Validation**: Runtime type checking
- **Generated Types**: Automatic from database schema
- **Strict Mode**: No implicit any types

---

## Technology Stack

### Frontend
```typescript
{
  "framework": "Next.js 16",
  "rendering": "PPR + Streaming SSR",
  "styling": "Tailwind CSS",
  "ui": "shadcn/ui",
  "state": "React Server Components + URL state",
  "forms": "React Hook Form + Zod"
}
```

### Backend
```typescript
{
  "runtime": "Node.js 20 + Edge Runtime",
  "database": "Supabase (PostgreSQL)",
  "orm": "Drizzle ORM",
  "auth": "Supabase Auth",
  "storage": "Supabase Storage",
  "cache": "Upstash Redis"
}
```

### Infrastructure
```typescript
{
  "hosting": "Vercel",
  "cdn": "Vercel Edge Network",
  "monitoring": "Vercel Analytics",
  "ci/cd": "GitHub Actions",
  "bundler": "Turbopack (dev) / Webpack (prod)"
}
```

---

## Request Flow Architecture

```
Client Request
     ↓
Is Static Asset? → Yes → CDN Response
     ↓ No
Edge Function
     ↓
Cached? → Yes → Return Cached
     ↓ No
Server Component
     ↓
Data Fetching (Supabase + Redis)
     ↓
Render HTML
     ↓
Stream Response
     ↓
Client
```

---

## Data Architecture

### Database Design
- **PostgreSQL** via Supabase for relational data
- **Supabase Storage** for images and files
- **Redis** for session and cache data
- **Normalized schema** with proper indexes

### Caching Layers
1. **Browser Cache**: Static assets with long TTL
2. **CDN Cache**: Edge-cached responses
3. **Redis Cache**: Database query results
4. **Next.js Cache**: Unstable cache for expensive operations
5. **React Cache**: Component-level memoization

---

## Component Architecture

### Server Components (Default)
```typescript
// Runs on server, no JS shipped to client
export default async function ProductList() {
  const products = await db.products.findMany();
  return <ProductGrid products={products} />;
}
```

### Client Components (When Needed)
```typescript
'use client';
// Only for interactivity
export function AddToCartButton({ productId }) {
  return <button onClick={() => addToCart(productId)}>Add</button>;
}
```

### Streaming Components
```typescript
// Progressive loading with Suspense
export default function Page() {
  return (
    <>
      <StaticHeader />
      <Suspense fallback={<Skeleton />}>
        <DynamicContent />
      </Suspense>
    </>
  );
}
```

---

## Security Architecture

### Authentication Flow
```
User → Client: Login Request
Client → Supabase: Authenticate
Supabase → Client: JWT Token
Client → Server: Request with Token
Server → Supabase: Verify Token
Supabase → Server: User Data
Server → Client: Protected Response
```

### Authorization Layers
1. **Supabase RLS**: Database-level security
2. **Middleware**: Route protection
3. **Server Actions**: Input validation
4. **API Routes**: Rate limiting

---

## Performance Optimizations

### Image Optimization
- Automatic format conversion (WebP/AVIF)
- Responsive sizing
- Blur placeholders
- Lazy loading
- CDN delivery

### Bundle Optimization
- Tree shaking
- Code splitting
- Dynamic imports
- Package optimization
- React Compiler

### Rendering Optimization
- Partial Prerendering
- Streaming SSR
- Selective hydration
- Component-level caching
- Static generation where possible

---

## Deployment Architecture

### Development
```bash
pnpm dev --turbo  # Turbopack for fast HMR
```

### Production
```bash
pnpm build       # Optimized production build
pnpm start       # Production server
```

### Infrastructure
- **Vercel Platform**: Automatic scaling
- **Edge Functions**: Global distribution
- **Serverless Functions**: On-demand compute
- **ISR**: Incremental Static Regeneration
- **PPR**: Partial Prerendering

---

## Monitoring & Observability

### Performance Monitoring
- Core Web Vitals tracking
- Real User Monitoring (RUM)
- Synthetic monitoring
- Custom performance marks

### Error Tracking
- Server-side error boundaries
- Client-side error boundaries
- Structured logging
- Alert notifications

### Analytics
- Page views and interactions
- Conversion tracking
- Custom events
- User flow analysis

---

## Scaling Strategy

### Horizontal Scaling
- Serverless functions auto-scale
- Database connection pooling
- Redis cluster for caching
- CDN for global distribution

### Vertical Scaling
- Optimize database queries
- Implement data pagination
- Use streaming for large datasets
- Progressive enhancement

---

## Development Workflow

### Local Development
1. Hot Module Replacement with Turbopack
2. Local Supabase instance
3. Type checking on save
4. Automatic formatting

### CI/CD Pipeline
1. Automated testing
2. Type checking
3. Linting
4. Build verification
5. Preview deployments
6. Production deployment

---

## Key Design Patterns

### 1. Server Actions Pattern
```typescript
'use server';
export async function createProduct(data: FormData) {
  // Validate, process, revalidate
}
```

### 2. Streaming Pattern
```typescript
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

### 3. Cache Pattern
```typescript
const getCachedData = unstable_cache(
  async () => fetchData(),
  ['cache-key'],
  { revalidate: 3600 }
);
```

### 4. Error Boundary Pattern
```typescript
<ErrorBoundary fallback={<Error />}>
  <RiskyComponent />
</ErrorBoundary>
```

---

## File Structure

```
src/
├── app/              # Pages and layouts
├── components/       # Reusable components
│   ├── ui/          # Base UI components
│   ├── commerce/    # E-commerce components
│   └── providers/   # Context providers
├── lib/             # Core libraries
│   ├── actions/     # Server actions
│   ├── api/         # External APIs
│   └── utils/       # Utilities
└── types/           # TypeScript types
```

---

## Best Practices

### Do's ✅
- Use Server Components by default
- Implement proper error boundaries
- Cache expensive operations
- Optimize images and fonts
- Use TypeScript strictly
- Write semantic HTML
- Follow accessibility guidelines

### Don'ts ❌
- Don't use Client Components unnecessarily
- Avoid large client bundles
- Don't block rendering
- Avoid N+1 queries
- Don't expose sensitive data
- Avoid inline styles
- Don't ignore TypeScript errors

---

## Future Considerations

### Planned Enhancements
- GraphQL API layer
- Real-time features with WebSockets
- Advanced AI features
- Mobile app with React Native
- Internationalization

### Scaling Preparations
- Database sharding strategy
- Microservices architecture
- Event-driven architecture
- Multi-region deployment

---

This architecture ensures WedStay Marketplace delivers exceptional performance while maintaining developer productivity and code quality.
