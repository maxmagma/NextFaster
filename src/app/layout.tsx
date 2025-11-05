import type { Metadata } from 'next';
import './globals.css';
import { SearchDropdownComponent } from '@/components/search-dropdown';
import { Bars3Icon } from '@heroicons/react/24/outline';
import { Suspense } from 'react';
import { Cart } from '@/components/cart';
import { AuthServer } from './auth.server';
import { Link } from '@/components/ui/link';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { WelcomeToast } from './welcome-toast';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { generateOrganizationSchema, SchemaScript } from '@/lib/seo/schema';
import { siteConfig } from '@/lib/seo/metadata';

export const metadata: Metadata = {
  title: {
    template: '%s | WedStay',
    default: 'WedStay - Luxury Wedding Marketplace',
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: 'WedStay' }],
  creator: 'WedStay',
  publisher: 'WedStay',

  metadataBase: new URL(siteConfig.url),

  robots: {
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
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@wedstay',
  },

  alternates: {
    canonical: siteConfig.url,
  },

  other: {
    'theme-color': '#000000', // Black theme
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en" className="h-full">
      <head>
        <SchemaScript schema={orgSchema} />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} flex flex-col overflow-y-auto overflow-x-hidden antialiased font-sans`}
      >
        <div>
          {/* Header - Black & White design */}
          <header className="fixed top-0 z-10 flex h-[90px] w-[100vw] flex-grow items-center justify-between border-b border-stone-200 bg-white p-2 pb-[4px] pt-2 sm:h-[70px] sm:flex-row sm:gap-4 sm:p-4 sm:pb-[4px] sm:pt-0">
            <div className="flex flex-grow flex-col">
              <div className="absolute right-2 top-2 flex justify-end pt-2 font-sans text-sm hover:underline sm:relative sm:right-0 sm:top-0">
                <Suspense
                  fallback={
                    <button className="flex flex-row items-center gap-1 text-black">
                      <div className="h-[20px]" />
                      <svg viewBox="0 0 10 6" className="h-[6px] w-[10px]">
                        <polygon points="0,0 5,6 10,0"></polygon>
                      </svg>
                    </button>
                  }
                >
                  <AuthServer />
                </Suspense>
              </div>
              <div className="flex w-full flex-col items-start justify-center sm:w-auto sm:flex-row sm:items-center sm:gap-2">
                <Link
                  prefetch={true}
                  href="/"
                  className="text-4xl font-bold text-black tracking-tight"
                >
                  WedStay
                </Link>
                <div className="items flex w-full flex-row items-center justify-between gap-4">
                  <div className="mx-0 flex-grow sm:mx-auto sm:flex-grow-0">
                    <SearchDropdownComponent />
                  </div>
                  <div className="flex flex-row justify-between space-x-4">
                    <div className="relative">
                      <Link
                        prefetch={true}
                        href="/order"
                        className="text-lg text-black hover:text-stone-600 transition-colors uppercase tracking-wide text-sm font-medium"
                      >
                        Cart
                      </Link>
                      <Suspense>
                        <Cart />
                      </Suspense>
                    </div>
                    <Link
                      prefetch={true}
                      href="/order-history"
                      className="hidden text-sm font-medium text-black hover:text-stone-600 transition-colors md:block uppercase tracking-wide"
                    >
                      Orders
                    </Link>
                    <Link
                      prefetch={true}
                      href="/order-history"
                      aria-label="Order History"
                      className="block text-black hover:text-stone-600 transition-colors md:hidden"
                    >
                      <Bars3Icon className="w-6 h-6" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="pt-[85px] sm:pt-[70px] min-h-screen">
            {children}
          </main>
        </div>

        {/* Footer - Sophisticated black/white */}
        <footer className="border-t border-stone-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-semibold text-black mb-4">WedStay</h3>
                <p className="text-sm text-stone-600">
                  Curated wedding marketplace for unforgettable celebrations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-4 text-sm uppercase tracking-wide">
                  Shop
                </h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li><Link href="/marketplace" className="hover:text-black transition-colors">All Products</Link></li>
                  <li><Link href="/marketplace/venues" className="hover:text-black transition-colors">Venues</Link></li>
                  <li><Link href="/marketplace/decor" className="hover:text-black transition-colors">Decor</Link></li>
                  <li><Link href="/marketplace/furniture" className="hover:text-black transition-colors">Furniture</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-4 text-sm uppercase tracking-wide">
                  Company
                </h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li><Link href="/about" className="hover:text-black transition-colors">About</Link></li>
                  <li><Link href="/vendors" className="hover:text-black transition-colors">Become a Vendor</Link></li>
                  <li><Link href="/careers" className="hover:text-black transition-colors">Careers</Link></li>
                  <li><Link href="/contact" className="hover:text-black transition-colors">Contact</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-black mb-4 text-sm uppercase tracking-wide">
                  Support
                </h4>
                <ul className="space-y-2 text-sm text-stone-600">
                  <li><Link href="/faq" className="hover:text-black transition-colors">FAQ</Link></li>
                  <li><Link href="/returns" className="hover:text-black transition-colors">Returns</Link></li>
                  <li><Link href="/privacy" className="hover:text-black transition-colors">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-black transition-colors">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-stone-200 text-center text-sm text-stone-600">
              <p>&copy; {new Date().getFullYear()} WedStay. All rights reserved.</p>
            </div>
          </div>
        </footer>

        <Suspense fallback={null}>
          <Toaster closeButton />
          <WelcomeToast />
        </Suspense>

        <Analytics scriptSrc="/insights/events.js" endpoint="/hfi/events" />
        <SpeedInsights />
      </body>
    </html>
  );
}
