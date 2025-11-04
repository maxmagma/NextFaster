// WedStay Marketplace - Drizzle ORM Schema for Supabase
// Complete database schema for wedding venue and product marketplace

import {
  pgTable,
  uuid,
  text,
  integer,
  decimal,
  boolean,
  timestamp,
  json,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const userRoleEnum = pgEnum('user_role', ['customer', 'vendor', 'admin']);
export const productStatusEnum = pgEnum('product_status', [
  'draft',
  'pending',
  'approved',
  'rejected',
  'archived',
]);
export const vendorStatusEnum = pgEnum('vendor_status', [
  'pending',
  'approved',
  'rejected',
  'suspended',
]);
export const inquiryStatusEnum = pgEnum('inquiry_status', [
  'pending',
  'quoted',
  'booked',
  'cancelled',
  'completed',
]);
export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'confirmed',
  'processing',
  'completed',
  'cancelled',
  'refunded',
]);

// Auth Users reference (Supabase auth.users table)
// This is a reference table - the actual table exists in Supabase Auth schema
export const authUsers = pgTable('auth_users', {
  id: uuid('id').primaryKey(),
});

// Profiles (extends Supabase auth.users)
export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id')
      .primaryKey()
      .references(() => authUsers.id, { onDelete: 'cascade' }),
    email: text('email').notNull().unique(),
    fullName: text('full_name'),
    role: userRoleEnum('role').default('customer').notNull(),
    avatarUrl: text('avatar_url'),
    phone: text('phone'),
    metadata: json('metadata').$type<Record<string, any>>(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('profiles_email_idx').on(table.email),
    roleIdx: index('profiles_role_idx').on(table.role),
  })
);

// Vendors
export const vendors = pgTable(
  'vendors',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => profiles.id, { onDelete: 'cascade' })
      .notNull(),
    companyName: text('company_name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    logoUrl: text('logo_url'),
    coverImageUrl: text('cover_image_url'),
    website: text('website'),
    phone: text('phone'),
    email: text('email'),
    serviceAreas: text('service_areas').array(),

    // Business info
    yearsInBusiness: integer('years_in_business'),
    insuranceVerified: boolean('insurance_verified').default(false),
    businessLicense: text('business_license'),

    // Status
    status: vendorStatusEnum('status').default('pending').notNull(),
    approvedAt: timestamp('approved_at'),
    rejectionReason: text('rejection_reason'),

    // Commission
    commissionRate: decimal('commission_rate', { precision: 5, scale: 2 }).default('15.00'),

    // Metrics (denormalized for performance)
    totalProducts: integer('total_products').default(0),
    totalInquiries: integer('total_inquiries').default(0),
    totalRevenue: decimal('total_revenue', { precision: 10, scale: 2 }).default('0'),
    averageRating: decimal('average_rating', { precision: 3, scale: 2 }),

    // SEO
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex('vendors_slug_idx').on(table.slug),
    statusIdx: index('vendors_status_idx').on(table.status),
    userIdIdx: index('vendors_user_id_idx').on(table.userId),
  })
);

// Products (optimized for NextFaster patterns)
export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    vendorId: uuid('vendor_id')
      .references(() => vendors.id, { onDelete: 'cascade' })
      .notNull(),

    // Core info
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    handle: text('handle').notNull().unique(), // NextFaster pattern
    description: text('description'),
    category: text('category').notNull(),
    subcategory: text('subcategory'),

    // Pricing
    basePrice: decimal('base_price', { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
    priceType: text('price_type').notNull().default('rental'), // rental, service, package
    currency: text('currency').notNull().default('USD'),

    // Inventory
    quantity: integer('quantity').default(1),
    trackInventory: boolean('track_inventory').default(false),
    minimumOrder: integer('minimum_order').default(1),

    // Media (Supabase Storage URLs)
    images: text('images').array().default([]),
    primaryImage: text('primary_image'),
    videoUrl: text('video_url'),

    // Attributes
    styleTags: text('style_tags').array().default([]),
    colorPalette: text('color_palette').array().default([]),
    features: json('features').$type<string[]>(),
    dimensions: json('dimensions').$type<{
      width?: number;
      height?: number;
      depth?: number;
      unit?: string;
    }>(),
    specifications: json('specifications').$type<Record<string, any>>(),

    // Status
    status: productStatusEnum('status').default('draft').notNull(),
    isActive: boolean('is_active').default(true),
    featured: boolean('featured').default(false),

    // SEO (NextFaster pattern)
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    metaKeywords: text('meta_keywords').array(),

    // Performance metrics
    views: integer('views').default(0),
    inquiries: integer('inquiries').default(0),
    cartAdds: integer('cart_adds').default(0),
    orders: integer('orders').default(0),

    // Timestamps
    publishedAt: timestamp('published_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    vendorIdx: index('products_vendor_idx').on(table.vendorId),
    categoryIdx: index('products_category_idx').on(table.category),
    statusIdx: index('products_status_idx').on(table.status),
    handleIdx: uniqueIndex('products_handle_idx').on(table.handle),
    featuredIdx: index('products_featured_idx').on(table.featured),
    // Composite index for marketplace queries
    marketplaceIdx: index('products_marketplace_idx').on(
      table.status,
      table.isActive,
      table.featured,
      table.createdAt
    ),
  })
);

// Style Presets for AI Visualizer
export const stylePresets = pgTable(
  'style_presets',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    description: text('description'),
    thumbnailUrl: text('thumbnail_url'),

    // AI Generation params
    promptTemplate: text('prompt_template'),
    negativePrompt: text('negative_prompt'),
    styleSettings: json('style_settings').$type<{
      model?: string;
      strength?: number;
      guidance?: number;
      steps?: number;
    }>(),

    // Products in this preset
    defaultProducts: uuid('default_products').array().default([]),

    isActive: boolean('is_active').default(true),
    sortOrder: integer('sort_order').default(0),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex('style_presets_slug_idx').on(table.slug),
    activeIdx: index('style_presets_active_idx').on(table.isActive),
  })
);

// Inquiries
export const inquiries = pgTable(
  'inquiries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),

    // Contact
    email: text('email').notNull(),
    phone: text('phone'),
    fullName: text('full_name').notNull(),

    // Event details
    eventDate: timestamp('event_date'),
    eventType: text('event_type'), // wedding, reception, etc.
    venueName: text('venue_name'),
    venueLocation: text('venue_location'),
    guestCount: integer('guest_count'),

    // Products
    products: json('products').$type<
      Array<{
        productId: string;
        quantity: number;
        notes?: string;
      }>
    >().notNull(),

    totalValue: decimal('total_value', { precision: 10, scale: 2 }),

    // Status
    status: inquiryStatusEnum('status').default('pending').notNull(),

    // Vendor responses
    vendorResponses: json('vendor_responses').$type<
      Array<{
        vendorId: string;
        quotedPrice: number;
        message: string;
        respondedAt: string;
      }>
    >().default([]),

    // Notes
    customerNotes: text('customer_notes'),
    internalNotes: text('internal_notes'),

    // Source tracking
    source: text('source'),
    referrer: text('referrer'),
    utmParams: json('utm_params').$type<Record<string, string>>(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('inquiries_user_idx').on(table.userId),
    statusIdx: index('inquiries_status_idx').on(table.status),
    createdIdx: index('inquiries_created_idx').on(table.createdAt),
  })
);

// Visualizations
export const visualizations = pgTable(
  'visualizations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),

    // Input
    venuePhotoUrl: text('venue_photo_url').notNull(),
    presetId: uuid('preset_id').references(() => stylePresets.id, { onDelete: 'set null' }),
    selectedProducts: uuid('selected_products').array().default([]),
    customPrompt: text('custom_prompt'),

    // Output
    generatedImageUrl: text('generated_image_url'),
    generationPrompt: text('generation_prompt'),

    // Metadata
    generationTimeMs: integer('generation_time_ms'),
    modelUsed: text('model_used'),
    replicateId: text('replicate_id'),
    isPublic: boolean('is_public').default(false),
    shareToken: text('share_token').unique(),

    // Analytics
    views: integer('views').default(0),
    shares: integer('shares').default(0),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('visualizations_user_idx').on(table.userId),
    shareTokenIdx: uniqueIndex('visualizations_share_token_idx').on(table.shareToken),
    createdIdx: index('visualizations_created_idx').on(table.createdAt),
  })
);

// Cart Items (server-side cart like NextFaster)
export const cartItems = pgTable(
  'cart_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'cascade' }),
    sessionId: text('session_id'), // For guest users
    productId: uuid('product_id')
      .references(() => products.id, { onDelete: 'cascade' })
      .notNull(),
    quantity: integer('quantity').default(1).notNull(),

    // Price snapshot
    priceSnapshot: decimal('price_snapshot', { precision: 10, scale: 2 }),

    // Custom options
    customization: json('customization').$type<Record<string, any>>(),
    rentalDates: json('rental_dates').$type<{
      start: string;
      end: string;
    }>(),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('cart_items_user_idx').on(table.userId),
    sessionIdx: index('cart_items_session_idx').on(table.sessionId),
    productIdx: index('cart_items_product_idx').on(table.productId),
  })
);

// Orders
export const orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
    orderNumber: text('order_number').notNull().unique(),

    // Stripe
    stripePaymentIntentId: text('stripe_payment_intent_id'),
    stripeCustomerId: text('stripe_customer_id'),

    // Amounts
    subtotal: decimal('subtotal', { precision: 10, scale: 2 }).notNull(),
    tax: decimal('tax', { precision: 10, scale: 2 }).default('0'),
    shipping: decimal('shipping', { precision: 10, scale: 2 }).default('0'),
    discount: decimal('discount', { precision: 10, scale: 2 }).default('0'),
    total: decimal('total', { precision: 10, scale: 2 }).notNull(),
    currency: text('currency').notNull().default('USD'),

    // Items snapshot
    items: json('items').$type<
      Array<{
        productId: string;
        name: string;
        price: number;
        quantity: number;
        vendorId: string;
        customization?: Record<string, any>;
      }>
    >().notNull(),

    // Customer info
    customerEmail: text('customer_email').notNull(),
    customerPhone: text('customer_phone'),
    customerName: text('customer_name'),

    // Event info
    eventDate: timestamp('event_date'),
    eventLocation: text('event_location'),
    eventType: text('event_type'),

    // Shipping/billing
    shippingAddress: json('shipping_address').$type<{
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }>(),
    billingAddress: json('billing_address').$type<{
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    }>(),

    // Status
    status: orderStatusEnum('status').default('pending').notNull(),
    paymentStatus: text('payment_status'),

    // Notes
    customerNotes: text('customer_notes'),
    internalNotes: text('internal_notes'),

    // Fulfillment
    fulfillmentStatus: text('fulfillment_status'),
    trackingNumber: text('tracking_number'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('orders_user_idx').on(table.userId),
    orderNumberIdx: uniqueIndex('orders_order_number_idx').on(table.orderNumber),
    statusIdx: index('orders_status_idx').on(table.status),
    createdIdx: index('orders_created_idx').on(table.createdAt),
  })
);

// Reviews
export const reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => profiles.id, { onDelete: 'cascade' })
      .notNull(),
    productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
    vendorId: uuid('vendor_id').references(() => vendors.id, { onDelete: 'cascade' }),
    orderId: uuid('order_id').references(() => orders.id, { onDelete: 'set null' }),

    rating: integer('rating').notNull(), // 1-5
    title: text('title'),
    content: text('content').notNull(),
    photos: text('photos').array().default([]),

    isVerifiedPurchase: boolean('is_verified_purchase').default(false),
    isPublished: boolean('is_published').default(true),

    // Moderation
    flagged: boolean('flagged').default(false),
    flagReason: text('flag_reason'),

    // Helpful votes
    helpfulCount: integer('helpful_count').default(0),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('reviews_user_idx').on(table.userId),
    productIdx: index('reviews_product_idx').on(table.productId),
    vendorIdx: index('reviews_vendor_idx').on(table.vendorId),
    ratingIdx: index('reviews_rating_idx').on(table.rating),
  })
);

// Analytics Events (for tracking)
export const analyticsEvents = pgTable(
  'analytics_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => profiles.id, { onDelete: 'set null' }),
    sessionId: text('session_id'),

    eventType: text('event_type').notNull(), // page_view, product_view, add_to_cart, etc.
    eventData: json('event_data').$type<Record<string, any>>(),

    // Context
    page: text('page'),
    referrer: text('referrer'),
    userAgent: text('user_agent'),
    ip: text('ip'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdx: index('analytics_events_user_idx').on(table.userId),
    sessionIdx: index('analytics_events_session_idx').on(table.sessionId),
    eventTypeIdx: index('analytics_events_type_idx').on(table.eventType),
    createdIdx: index('analytics_events_created_idx').on(table.createdAt),
  })
);

// Relations (for Drizzle ORM query builder)
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [profiles.id],
    references: [vendors.userId],
  }),
  inquiries: many(inquiries),
  cartItems: many(cartItems),
  orders: many(orders),
  visualizations: many(visualizations),
  reviews: many(reviews),
}));

export const vendorsRelations = relations(vendors, ({ one, many }) => ({
  user: one(profiles, {
    fields: [vendors.userId],
    references: [profiles.id],
  }),
  products: many(products),
  reviews: many(reviews),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  vendor: one(vendors, {
    fields: [products.vendorId],
    references: [vendors.id],
  }),
  cartItems: many(cartItems),
  reviews: many(reviews),
}));

export const stylePresetsRelations = relations(stylePresets, ({ many }) => ({
  visualizations: many(visualizations),
}));

export const visualizationsRelations = relations(visualizations, ({ one }) => ({
  user: one(profiles, {
    fields: [visualizations.userId],
    references: [profiles.id],
  }),
  preset: one(stylePresets, {
    fields: [visualizations.presetId],
    references: [stylePresets.id],
  }),
}));

export const inquiriesRelations = relations(inquiries, ({ one }) => ({
  user: one(profiles, {
    fields: [inquiries.userId],
    references: [profiles.id],
  }),
}));

export const ordersRelations = relations(orders, ({ one }) => ({
  user: one(profiles, {
    fields: [orders.userId],
    references: [profiles.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(profiles, {
    fields: [reviews.userId],
    references: [profiles.id],
  }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
  vendor: one(vendors, {
    fields: [reviews.vendorId],
    references: [vendors.id],
  }),
  order: one(orders, {
    fields: [reviews.orderId],
    references: [orders.id],
  }),
}));
