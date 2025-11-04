/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Compiler and Next.js 16 features
  experimental: {
    reactCompiler: true,
    // Enable PPR for maximum performance
    ppr: true,
    // Inline CSS for better performance
    inlineCss: true,
    // Optimize package imports
    optimizePackageImports: [
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-label',
      '@radix-ui/react-popover',
      '@radix-ui/react-scroll-area',
      '@radix-ui/react-select',
      '@radix-ui/react-slider',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      'lucide-react',
      'date-fns',
      'recharts',
      'framer-motion',
    ],
    // NextFaster's CSS optimization
    optimizeCss: true,
    // In-function concurrency for better Edge performance
    webpackBuildWorker: true,
  },

  typescript: {
    ignoreBuildErrors: false, // Enable type checking
  },

  eslint: {
    ignoreDuringBuilds: false, // Enable linting
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: 'replicate.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Optimize for wedding images (high quality)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

  // Redirects for SEO
  async redirects() {
    return [
      {
        source: '/products/:path*',
        destination: '/marketplace/:path*',
        permanent: true,
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/insights/vitals.js',
        destination: 'https://cdn.vercel-insights.com/v1/speed-insights/script.js',
      },
      {
        source: '/insights/events.js',
        destination: 'https://cdn.vercel-insights.com/v1/script.js',
      },
      {
        source: '/hfi/events/:slug*',
        destination: 'https://vitals.vercel-insights.com/v1/:slug*?dsn=KD0ni5HQVdxsHAF2tqBECObqH',
      },
      {
        source: '/hfi/vitals',
        destination: 'https://vitals.vercel-insights.com/v2/vitals?dsn=fsGnK5U2NRPzYx0Gch0g5w5PxT1',
      },
    ];
  },

  // Disable powered by header
  poweredByHeader: false,

  // Enable compression
  compress: true,
};

export default nextConfig;
