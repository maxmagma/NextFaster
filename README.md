# WedStay Marketplace

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
