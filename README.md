# WedStay Marketplace

A luxury wedding venue and product marketplace built on the [NextFaster](https://github.com/ethanniser/NextFaster) high-performance e-commerce template.

## Business Model

WedStay is a **lead generation and affiliate marketplace** for wedding products and rentals:

- **WedStay admins curate ALL products** - No vendor self-service portal
- **Two revenue streams:**
  - **Affiliate/Direct Purchase**: Products link to external vendors via affiliate links
  - **Rental Inquiries**: Inquiry forms submitted to vendors, WedStay earns commission on leads
- **No payment processing or fulfillment** - Users are redirected to vendors or submit inquiry forms
- **Vision Board/Cart functionality** - Users collect products, then checkout via external links or inquiries

## Features

- 🏛 **Curated Product Marketplace** - WedStay team manages all wedding products and rentals
- 🎨 **AI Venue Visualizer** - Transform venue photos with product overlays
- 🔗 **Affiliate & Direct Links** - Products link to vendor sites or affiliate programs
- 💼 **Lead Generation** - Inquiry forms for rentals sent directly to vendors
- 📊 **Admin Dashboard** - Complete product, inquiry, and analytics management
- ⚡ **Blazing Fast** - Built on NextFaster's performance architecture

## Tech Stack

- **Next.js 16** with Partial Prerendering
- **Supabase** for database and auth
- **Drizzle ORM** for type-safe queries
- **Tailwind CSS** for styling
- **Stripe** for payments
- **Replicate** for AI

## Getting Started

```bash
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
```

## Documentation

See the [/docs](./docs) folder for comprehensive documentation.

## License

Based on NextFaster - MIT License
