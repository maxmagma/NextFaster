// JSON-LD Schema Markup Generators for Best-in-Class SEO
// Comprehensive schema types for WedStay marketplace

import type { Product, WithContext, Organization, WebSite, BreadcrumbList, Event } from 'schema-dts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wedstay.com';

/**
 * Organization Schema
 * Used on homepage and all pages for brand identity
 */
export function generateOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${siteUrl}/#organization`,
    name: 'WedStay',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Luxury wedding venue and product marketplace for unforgettable celebrations',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/wedstay',
      'https://instagram.com/wedstay',
      'https://facebook.com/wedstay',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'hello@wedstay.com',
      availableLanguage: ['English'],
    },
  };
}

/**
 * WebSite Schema
 * Used on homepage for site search
 */
export function generateWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: 'WedStay',
    description: 'Discover and book premium wedding venues, rentals, and services',
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    } as any,
  };
}

/**
 * Product Schema
 * Used on all product pages
 */
export function generateProductSchema({
  name,
  description,
  images,
  price,
  currency = 'USD',
  category,
  vendor,
  handle,
  rating,
  reviewCount,
  availability = 'InStock',
}: {
  name: string;
  description: string;
  images: string[];
  price: string;
  currency?: string;
  category: string;
  vendor: {
    name: string;
    slug: string;
  };
  handle: string;
  rating?: number;
  reviewCount?: number;
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}): WithContext<Product> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: images,
    url: `${siteUrl}/product/${handle}`,
    sku: handle,
    brand: {
      '@type': 'Brand',
      name: vendor.name,
      url: `${siteUrl}/vendors/${vendor.slug}`,
    },
    category,
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/product/${handle}`,
      priceCurrency: currency,
      price,
      availability: `https://schema.org/${availability}`,
      seller: {
        '@type': 'Organization',
        name: vendor.name,
        url: `${siteUrl}/vendors/${vendor.slug}`,
      },
    },
    ...(rating && reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: rating,
            reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };
}

/**
 * Breadcrumb Schema
 * Used on all pages for navigation
 */
export function generateBreadcrumbSchema(
  items: Array<{
    name: string;
    url: string;
  }>
): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * Event Schema
 * Used for wedding-specific pages and venue listings
 */
export function generateEventSchema({
  name,
  startDate,
  endDate,
  location,
  description,
  image,
  offers,
}: {
  name: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
  };
  description: string;
  image?: string;
  offers?: {
    price: string;
    currency: string;
  };
}): WithContext<Event> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name,
    startDate,
    ...(endDate ? { endDate } : {}),
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: location.name,
      address: {
        '@type': 'PostalAddress',
        ...location.address,
      },
    },
    description,
    ...(image ? { image } : {}),
    ...(offers
      ? {
          offers: {
            '@type': 'Offer',
            price: offers.price,
            priceCurrency: offers.currency,
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
    organizer: {
      '@type': 'Organization',
      name: 'WedStay',
      url: siteUrl,
    },
  };
}

/**
 * FAQ Schema
 * Used for FAQ pages and product Q&A
 */
export function generateFAQSchema(
  faqs: Array<{
    question: string;
    answer: string;
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Review Schema
 * Used for product and vendor reviews
 */
export function generateReviewSchema({
  itemReviewed,
  reviews,
}: {
  itemReviewed: {
    type: 'Product' | 'Organization';
    name: string;
    image?: string;
  };
  reviews: Array<{
    author: string;
    rating: number;
    reviewBody: string;
    datePublished: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': itemReviewed.type,
    name: itemReviewed.name,
    ...(itemReviewed.image ? { image: itemReviewed.image } : {}),
    review: reviews.map((review) => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: review.reviewBody,
      datePublished: review.datePublished,
    })),
  };
}

/**
 * Helper to inject schema into page
 */
export function SchemaScript({ schema }: { schema: any }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
