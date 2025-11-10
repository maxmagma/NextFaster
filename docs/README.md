# WedStay Marketplace Documentation

## 📚 Documentation Overview

Welcome to the WedStay Marketplace documentation. This is a **lead generation and affiliate marketplace** built on the [NextFaster](https://github.com/ethanniser/NextFaster) high-performance template, adapted for the luxury wedding industry.

### 🚀 Quick Links

- [Claude AI Integration Guide](./claude.md) - AI assistant commands and context
- [Architecture Overview](./architecture/overview.md)
- [Setup Guide](./guides/setup.md)
- [Deployment Guide](./guides/deployment.md)

---

## 📖 Documentation Structure

### 🏗 Architecture
- [Overview](./architecture/overview.md) - System architecture and design patterns
- [Database Schema](./architecture/database-schema.md) - Complete Supabase schema documentation
- [Performance Strategy](./architecture/performance.md) - NextFaster performance optimizations
- [Caching Strategy](./architecture/caching-strategy.md) - Multi-layer caching approach

### 📚 Guides
- [Setup Guide](./guides/setup.md) - Development environment setup
- [Deployment Guide](./guides/deployment.md) - Production deployment checklist
- [Admin Guide](./guides/admin-guide.md) - Admin dashboard operations for WedStay team

### 🔌 API Documentation
- [Server Actions](./api/server-actions.md) - All server actions reference
- [REST Endpoints](./api/rest-endpoints.md) - API routes documentation
- [Webhooks](./api/webhooks.md) - Stripe and Supabase webhooks

### ✨ Features
- [Marketplace](./features/marketplace.md) - Lead generation and affiliate marketplace
- [AI Visualizer](./features/ai-visualizer.md) - Venue visualization with AI
- [Admin Dashboard](./features/admin-dashboard.md) - Product management for WedStay team
- [Inquiry System](./features/inquiry-system.md) - Lead capture and vendor routing

---

## 🎯 Key Features

### Performance-First Architecture
- **Next.js 15** with Partial Prerendering (PPR)
- **Turbopack** for lightning-fast development
- **React Server Components** for optimal bundle size
- **Edge Runtime** compatibility
- **Streaming SSR** for instant page loads

### Wedding-Specific Features
- 🏛 **Admin-Curated Marketplace** - WedStay team manages all wedding products
- 🎨 **AI Venue Visualizer** - Transform venue photos with product overlays
- 🔗 **Affiliate & Direct Links** - Products redirect to external vendor sites
- 💼 **Lead Generation** - Inquiry forms for rental products routed to vendors
- 📊 **Commission Tracking** - Track revenue from affiliates and leads

### Technical Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **UI**: shadcn/ui components
- **Auth**: Supabase Auth
- **Storage**: Supabase Storage
- **AI**: Replicate API
- **Cache**: Upstash Redis
- **Analytics**: Vercel Analytics

---

## 🚦 Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- Supabase CLI
- Git

### Quick Start
```bash
# Clone and setup
git clone https://github.com/ethanniser/NextFaster.git wedding-marketplace
cd wedding-marketplace

# Install dependencies
pnpm install

# Setup Supabase
supabase init
supabase start

# Configure environment
cp .env.example .env.local
# Edit .env.local with your keys

# Run migrations
pnpm db:push

# Start development
pnpm dev
```

---

## 📊 Performance Targets

Based on NextFaster's proven architecture:

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 0.6s
- **Largest Contentful Paint**: < 1.0s
- **Cumulative Layout Shift**: < 0.05
- **First Load JS**: < 85kB

---

## 🏢 Project Structure

```
wedding-marketplace/
├── docs/               # This documentation
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React components
│   ├── lib/           # Utilities and libraries
│   └── types/         # TypeScript definitions
├── supabase/          # Database configuration
├── public/            # Static assets
└── scripts/           # Build and maintenance scripts
```

---

## 👥 User Roles

### Customer
- Browse marketplace
- Create inquiries
- Use AI visualizer
- Manage cart and checkout

### Vendor
- Manage products
- Handle inquiries
- View analytics
- Update profile

### Admin
- Approve vendors
- Moderate products
- System settings
- Analytics dashboard

---

## 🔒 Security

- **Row Level Security (RLS)** on all tables
- **Role-based access control** via Supabase Auth
- **Secure payment processing** with Stripe
- **CSRF protection** on all forms
- **Rate limiting** with Upstash

---

## 📈 Monitoring

- **Vercel Analytics** for traffic insights
- **Speed Insights** for performance metrics
- **Error tracking** for production issues
- **Custom events** for business metrics

---

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines.

---

## 📝 License

This project is based on NextFaster and maintains its MIT license.

---

## 🔗 Resources

- [NextFaster Repository](https://github.com/ethanniser/NextFaster)
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

---

## 📞 Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with reproduction steps

---

Last updated: November 2024
