// Open Graph Image Generation Utilities
// Best-in-class social sharing cards for Twitter, Facebook, LinkedIn

/**
 * Generate OG Image URL with dynamic parameters
 * Using Next.js dynamic OG image generation
 */
export function generateOGImageUrl({
  title,
  category,
  price,
  type = 'product',
}: {
  title: string;
  category?: string;
  price?: string;
  type?: 'product' | 'vendor' | 'page';
}): string {
  const params = new URLSearchParams({
    title,
    type,
    ...(category ? { category } : {}),
    ...(price ? { price } : {}),
  });

  return `/api/og?${params.toString()}`;
}

/**
 * Twitter Card Configuration
 * Large image cards for maximum engagement
 */
export interface TwitterCard {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
}

export function generateTwitterCard({
  title,
  description,
  image,
  imageAlt,
  creator = '@wedstay',
}: {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  creator?: string;
}): TwitterCard {
  return {
    card: 'summary_large_image',
    site: '@wedstay',
    creator,
    title,
    description,
    image,
    imageAlt: imageAlt || title,
  };
}

/**
 * Facebook/Open Graph Configuration
 * Optimized for Facebook, LinkedIn, and other OG-compatible platforms
 */
export interface OpenGraphConfig {
  type: 'website' | 'article' | 'product' | 'profile';
  title: string;
  description: string;
  url: string;
  siteName: string;
  locale: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>;
  // Product-specific
  'product:price:amount'?: string;
  'product:price:currency'?: string;
  'product:availability'?: 'in stock' | 'out of stock';
  // Article-specific
  'article:published_time'?: string;
  'article:modified_time'?: string;
  'article:author'?: string;
}

export function generateOpenGraphConfig({
  type,
  title,
  description,
  url,
  images,
  product,
  article,
}: {
  type: 'website' | 'article' | 'product' | 'profile';
  title: string;
  description: string;
  url: string;
  images: Array<{
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  }>;
  product?: {
    price: string;
    currency?: string;
    availability?: 'in stock' | 'out of stock';
  };
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
  };
}): OpenGraphConfig {
  return {
    type,
    title,
    description,
    url,
    siteName: 'WedStay',
    locale: 'en_US',
    images: images.map((img) => ({
      url: img.url,
      width: img.width || 1200,
      height: img.height || 630,
      alt: img.alt || title,
    })),
    ...(product
      ? {
          'product:price:amount': product.price,
          'product:price:currency': product.currency || 'USD',
          'product:availability': product.availability || 'in stock',
        }
      : {}),
    ...(article
      ? {
          'article:published_time': article.publishedTime,
          'article:modified_time': article.modifiedTime,
          'article:author': article.author,
        }
      : {}),
  };
}

/**
 * Image Optimization Settings
 * For social card images
 */
export const OG_IMAGE_DIMENSIONS = {
  // Twitter & Facebook optimal size
  width: 1200,
  height: 630,
  // Aspect ratio 1.91:1
  aspectRatio: 1200 / 630,
};

/**
 * Generate structured data for rich previews
 */
export function generateRichPreviewData({
  title,
  description,
  image,
  url,
  type,
}: {
  title: string;
  description: string;
  image: string;
  url: string;
  type: 'product' | 'article' | 'website';
}) {
  return {
    // Standard meta tags
    title,
    description,

    // Open Graph
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': type,
    'og:site_name': 'WedStay',

    // Twitter
    'twitter:card': 'summary_large_image',
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:site': '@wedstay',

    // Additional meta
    'theme-color': '#000000', // Black theme
    'msapplication-TileColor': '#000000',
  };
}
