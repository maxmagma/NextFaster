import type { Metadata } from 'next';

const siteConfig = {
  name: 'WedStay',
  title: 'WedStay - Luxury Wedding Venue & Product Marketplace',
  description:
    'Discover and book premium wedding venues, rentals, and services. Curated marketplace for unforgettable celebrations.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://wedstay.com',
  ogImage: '/og-image.jpg',
  keywords: [
    'wedding marketplace',
    'wedding venues',
    'wedding rentals',
    'event planning',
    'luxury weddings',
    'wedding services',
    'venue rental',
    'wedding decor',
  ],
};

export function generateMetadata({
  title,
  description,
  image,
  path = '',
  type = 'website',
  keywords,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  type?: 'website' | 'article' | 'product';
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || siteConfig.ogImage;
  const pageUrl = `${siteConfig.url}${path}`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords || siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,

    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },

    openGraph: {
      type: type === 'product' ? 'website' : type,
      locale: 'en_US',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: pageTitle,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [pageImage],
      creator: '@wedstay',
    },

    alternates: {
      canonical: pageUrl,
    },

    other: {
      'og:site_name': siteConfig.name,
    },
  };
}

export function generateProductMetadata({
  name,
  description,
  price,
  currency = 'USD',
  images,
  category,
  vendor,
  handle,
}: {
  name: string;
  description: string;
  price: string;
  currency?: string;
  images: string[];
  category: string;
  vendor: string;
  handle: string;
}): Metadata {
  const pageTitle = `${name} - ${vendor}`;
  const pageUrl = `${siteConfig.url}/product/${handle}`;

  return {
    ...generateMetadata({
      title: pageTitle,
      description,
      image: images[0],
      path: `/product/${handle}`,
      type: 'product',
      keywords: [
        name,
        vendor,
        category,
        'wedding rental',
        'event rental',
        ...siteConfig.keywords,
      ],
    }),

    openGraph: {
      type: 'product' as any,
      url: pageUrl,
      title: pageTitle,
      description,
      siteName: siteConfig.name,
      images: images.map((img, i) => ({
        url: img,
        width: 1200,
        height: 1200,
        alt: `${name} - Image ${i + 1}`,
      })),
    },

    other: {
      'product:price:amount': price,
      'product:price:currency': currency,
      'product:availability': 'in stock',
      'product:category': category,
      'product:brand': vendor,
    },
  };
}

export function generateVendorMetadata({
  companyName,
  description,
  slug,
  logo,
  serviceAreas,
  totalProducts,
}: {
  companyName: string;
  description: string;
  slug: string;
  logo?: string;
  serviceAreas?: string[];
  totalProducts?: number;
}): Metadata {
  return generateMetadata({
    title: companyName,
    description: description || `Browse ${totalProducts || ''} products from ${companyName}`,
    image: logo,
    path: `/vendors/${slug}`,
    keywords: [companyName, ...(serviceAreas || []), 'wedding vendor', ...siteConfig.keywords],
  });
}

export { siteConfig };
