# SEO Implementation Guide

## Complete SEO Strategy for WedStay Marketplace

This guide covers all SEO implementations including metadata, schema markup, social sharing, and optimization strategies.

---

## Table of Contents

1. [Metadata Configuration](#metadata-configuration)
2. [Schema Markup (JSON-LD)](#schema-markup)
3. [Social Sharing Cards](#social-sharing-cards)
4. [On-Page SEO](#on-page-seo)
5. [Technical SEO](#technical-seo)
6. [Performance Optimization](#performance-optimization)

---

## Metadata Configuration

### Basic Page Metadata

```typescript
import { generateMetadata } from '@/lib/seo/metadata';

export const metadata = generateMetadata({
  title: 'Wedding Venues',
  description: 'Discover premium wedding venues for your special day',
  path: '/venues',
  keywords: ['wedding venues', 'event spaces', 'luxury venues'],
});
```

### Product Page Metadata

```typescript
import { generateProductMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({ params }) {
  const product = await getProduct(params.handle);

  return generateProductMetadata({
    name: product.name,
    description: product.description,
    price: product.basePrice,
    currency: 'USD',
    images: product.images,
    category: product.category,
    vendor: product.vendor.companyName,
    handle: product.handle,
  });
}
```

### Vendor Page Metadata

```typescript
import { generateVendorMetadata } from '@/lib/seo/metadata';

export const metadata = generateVendorMetadata({
  companyName: 'Elegant Events',
  description: 'Premium wedding decor and rentals',
  slug: 'elegant-events',
  logo: '/vendors/elegant-events/logo.jpg',
  serviceAreas: ['Los Angeles', 'San Francisco'],
  totalProducts: 150,
});
```

---

## Schema Markup

### Organization Schema (Homepage)

```typescript
import { generateOrganizationSchema, generateWebSiteSchema, SchemaScript } from '@/lib/seo/schema';

export default function HomePage() {
  const orgSchema = generateOrganizationSchema();
  const websiteSchema = generateWebSiteSchema();

  return (
    <>
      <SchemaScript schema={orgSchema} />
      <SchemaScript schema={websiteSchema} />
      {/* Page content */}
    </>
  );
}
```

### Product Schema

```typescript
import { generateProductSchema, SchemaScript } from '@/lib/seo/schema';

export default async function ProductPage({ params }) {
  const product = await getProduct(params.handle);

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    images: product.images,
    price: product.basePrice,
    currency: 'USD',
    category: product.category,
    vendor: {
      name: product.vendor.companyName,
      slug: product.vendor.slug,
    },
    handle: product.handle,
    rating: product.averageRating,
    reviewCount: product.reviewCount,
    availability: product.quantity > 0 ? 'InStock' : 'OutOfStock',
  });

  return (
    <>
      <SchemaScript schema={productSchema} />
      {/* Product display */}
    </>
  );
}
```

### Breadcrumb Schema

```typescript
import { generateBreadcrumbSchema, SchemaScript } from '@/lib/seo/schema';

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: 'Home', url: '/' },
  { name: 'Marketplace', url: '/marketplace' },
  { name: 'Decor', url: '/marketplace/decor' },
  { name: product.name, url: `/product/${product.handle}` },
]);

<SchemaScript schema={breadcrumbSchema} />;
```

### Event Schema (Wedding Events)

```typescript
import { generateEventSchema, SchemaScript } from '@/lib/seo/schema';

const eventSchema = generateEventSchema({
  name: 'Luxury Garden Wedding Package',
  startDate: '2024-06-15T14:00:00',
  endDate: '2024-06-15T22:00:00',
  location: {
    name: 'Rosewood Estate',
    address: {
      streetAddress: '123 Garden Lane',
      addressLocality: 'Los Angeles',
      addressRegion: 'CA',
      postalCode: '90210',
      addressCountry: 'US',
    },
  },
  description: 'Complete wedding package including venue, decor, and catering',
  image: '/events/garden-wedding.jpg',
  offers: {
    price: '15000',
    currency: 'USD',
  },
});

<SchemaScript schema={eventSchema} />;
```

### FAQ Schema

```typescript
import { generateFAQSchema, SchemaScript } from '@/lib/seo/schema';

const faqSchema = generateFAQSchema([
  {
    question: 'How far in advance should I book?',
    answer: 'We recommend booking 6-12 months in advance for peak wedding season.',
  },
  {
    question: 'What is included in the rental price?',
    answer: 'All rental prices include delivery, setup, and pickup within our service area.',
  },
  {
    question: 'Do you offer payment plans?',
    answer: 'Yes, we offer flexible payment plans for orders over $5,000.',
  },
]);

<SchemaScript schema={faqSchema} />;
```

### Review Schema

```typescript
import { generateReviewSchema, SchemaScript } from '@/lib/seo/schema';

const reviewSchema = generateReviewSchema({
  itemReviewed: {
    type: 'Product',
    name: product.name,
    image: product.primaryImage,
  },
  reviews: [
    {
      author: 'Sarah Johnson',
      rating: 5,
      reviewBody: 'Absolutely stunning! Made our wedding perfect.',
      datePublished: '2024-01-15',
    },
    {
      author: 'Michael Chen',
      rating: 5,
      reviewBody: 'Professional service and beautiful products.',
      datePublished: '2024-01-20',
    },
  ],
});

<SchemaScript schema={reviewSchema} />;
```

---

## Social Sharing Cards

### Twitter Cards

```typescript
import { generateTwitterCard } from '@/lib/seo/og-image';

export const metadata = {
  twitter: generateTwitterCard({
    title: product.name,
    description: product.description,
    image: product.primaryImage,
    imageAlt: `${product.name} - ${product.vendor.companyName}`,
    creator: '@wedstay',
  }),
};
```

### Open Graph (Facebook, LinkedIn)

```typescript
import { generateOpenGraphConfig } from '@/lib/seo/og-image';

export const metadata = {
  openGraph: generateOpenGraphConfig({
    type: 'product',
    title: product.name,
    description: product.description,
    url: `https://wedstay.com/product/${product.handle}`,
    images: product.images.map((img) => ({
      url: img,
      width: 1200,
      height: 1200,
      alt: product.name,
    })),
    product: {
      price: product.basePrice,
      currency: 'USD',
      availability: 'in stock',
    },
  }),
};
```

### Dynamic OG Images

```typescript
import { generateOGImageUrl } from '@/lib/seo/og-image';

// Generate dynamic OG image
const ogImage = generateOGImageUrl({
  title: product.name,
  category: product.category,
  price: `$${product.basePrice}`,
  type: 'product',
});

export const metadata = {
  openGraph: {
    images: [ogImage],
  },
};
```

---

## On-Page SEO

### Heading Structure

```tsx
<article>
  <h1>Main Product Title</h1> {/* Only one H1 per page */}
  <h2>Product Details</h2>
  <h3>Specifications</h3>
  <h3>Dimensions</h3>
  <h2>Reviews</h2>
  <h3>Customer Reviews</h3>
</article>
```

### Semantic HTML

```tsx
<main>
  <article>
    <header>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </header>

    <section aria-labelledby="details">
      <h2 id="details">Product Details</h2>
      {/* Content */}
    </section>

    <section aria-labelledby="reviews">
      <h2 id="reviews">Customer Reviews</h2>
      {/* Reviews */}
    </section>
  </article>

  <aside>
    <section aria-labelledby="related">
      <h2 id="related">Related Products</h2>
      {/* Related items */}
    </section>
  </aside>
</main>
```

### Image Optimization

```tsx
import Image from 'next/image';

<Image
  src={product.primaryImage}
  alt={`${product.name} - ${product.category} for weddings`} // Descriptive alt text
  width={1200}
  height={1200}
  priority={isPrimaryImage}
  quality={90}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>;
```

### Internal Linking

```tsx
// Contextual internal links
<Link href="/marketplace/decor">Browse all wedding decor</Link>

// Breadcrumb navigation
<nav aria-label="Breadcrumb">
  <ol>
    <li><Link href="/">Home</Link></li>
    <li><Link href="/marketplace">Marketplace</Link></li>
    <li aria-current="page">{product.name}</li>
  </ol>
</nav>
```

---

## Technical SEO

### Sitemap Configuration

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const vendors = await getVendors();

  return [
    {
      url: 'https://wedstay.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://wedstay.com/marketplace',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    ...products.map((product) => ({
      url: `https://wedstay.com/product/${product.handle}`,
      lastModified: product.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...vendors.map((vendor) => ({
      url: `https://wedstay.com/vendors/${vendor.slug}`,
      lastModified: vendor.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
```

### Robots.txt

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/vendor/dashboard/', '/api/'],
      },
    ],
    sitemap: 'https://wedstay.com/sitemap.xml',
  };
}
```

### Canonical URLs

```typescript
// Always set canonical URLs
export const metadata = {
  alternates: {
    canonical: `https://wedstay.com/product/${product.handle}`,
  },
};
```

---

## Performance Optimization

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 2.5s
  - Optimize hero images with Next.js Image
  - Use `priority` for above-the-fold images
  - Implement PPR for instant page shells

- **FID (First Input Delay)**: < 100ms
  - Minimize JavaScript bundles
  - Use Server Components
  - Lazy load non-critical components

- **CLS (Cumulative Layout Shift)**: < 0.1
  - Set width/height on all images
  - Reserve space for dynamic content
  - Use CSS aspect-ratio

### Image Optimization

```typescript
// Image component with optimization
<Image
  src={product.image}
  alt={product.name}
  width={1200}
  height={1200}
  placeholder="blur"
  blurDataURL={product.blurDataUrl}
  loading={index === 0 ? 'eager' : 'lazy'}
  quality={85}
  formats={['image/avif', 'image/webp']}
/>
```

---

## SEO Checklist

### Every Page Must Have:
- [ ] Unique `<title>` tag (50-60 characters)
- [ ] Meta description (150-160 characters)
- [ ] Canonical URL
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Appropriate schema markup
- [ ] Semantic HTML structure
- [ ] Mobile-responsive design
- [ ] Fast loading time (< 3s)

### Product Pages Must Have:
- [ ] Product schema markup
- [ ] Breadcrumb schema
- [ ] High-quality images with alt text
- [ ] Detailed description (300+ words)
- [ ] Reviews schema (if available)
- [ ] Related products section
- [ ] Clear CTAs

### Category Pages Must Have:
- [ ] CollectionPage schema
- [ ] Filtered sitemap entries
- [ ] Pagination with rel="next/prev"
- [ ] Internal links to products

---

## Monitoring & Testing

### Tools to Use:
- **Google Search Console**: Track indexing and performance
- **PageSpeed Insights**: Monitor Core Web Vitals
- **Schema.org Validator**: Test JSON-LD markup
- **Twitter Card Validator**: Test social cards
- **Facebook Sharing Debugger**: Test OG tags

### Regular Audits:
- Weekly: Search Console performance
- Monthly: Full SEO audit with Screaming Frog
- Quarterly: Competitor analysis

---

## Best Practices

### Content Strategy
- Write unique product descriptions (no vendor copy)
- Use natural keyword placement
- Include wedding-specific keywords
- Create helpful blog content
- Update content regularly

### Link Building
- Get listed in wedding directories
- Partner with wedding blogs
- Create shareable content (guides, checklists)
- Encourage vendor profiles with backlinks

### Local SEO (for vendors)
- Google Business Profile
- Local citations
- Service area pages
- Local schema markup

---

## Resources

- [Google SEO Starter Guide](https://developers.google.com/search/docs/beginner/seo-starter-guide)
- [Schema.org Documentation](https://schema.org/)
- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Web.dev Core Web Vitals](https://web.dev/vitals/)

---

Last updated: November 2024
