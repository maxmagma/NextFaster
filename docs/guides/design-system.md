# WedStay Design System

## Sophisticated Black & White Aesthetic

**NO purple. NO AI patterns. Clean, professional, timeless.**

---

## Design Philosophy

WedStay's design system emphasizes:

- **Sophistication over trends** - Timeless black/white aesthetic
- **Clarity over complexity** - Clean layouts, clear hierarchy
- **Quality over quantity** - Premium photography, refined details
- **Function over decoration** - Every element serves a purpose

---

## Color Palette

### Primary Colors

```css
/* Pure Black & White */
--black: #000000;
--white: #FFFFFF;

/* Never use purple, blue gradients, or typical AI colors */
```

### Neutral Scale (Stone)

```css
/* Sophisticated warm neutrals */
--stone-50: #FAFAF9;   /* Backgrounds */
--stone-100: #F5F5F4;  /* Cards, sections */
--stone-200: #E7E5E4;  /* Borders, dividers */
--stone-300: #D6D3D1;  /* Disabled states */
--stone-400: #A8A29E;  /* Muted text */
--stone-500: #78716C;  /* Secondary text */
--stone-600: #57534E;  /* Body text */
--stone-700: #44403C;  /* Headings */
--stone-800: #292524;  /* Strong emphasis */
--stone-900: #1C1917;  /* Darkest elements */
--stone-950: #0C0A09;  /* Maximum contrast */
```

### Semantic Colors

```css
/* Primary = Black */
--primary: #000000;
--primary-foreground: #FFFFFF;

/* Accent = Dark Stone (NOT purple!) */
--accent: #1C1917;
--accent-foreground: #FFFFFF;

/* Error = Refined Red */
--error: #DC2626;
--error-foreground: #FFFFFF;

/* Success = Deep Green */
--success: #059669;
--success-foreground: #FFFFFF;
```

### Color Usage Rules

❌ **Never Use:**
- Purple (#A855F7, #8B5CF6, etc.)
- Blue gradients
- Bright accent colors
- Multiple accent colors
- Colored backgrounds

✅ **Always Use:**
- Black for primary actions
- Stone neutrals for hierarchy
- White backgrounds
- Minimal color for emphasis

---

## Typography

### Font Family

```css
/* Geist Sans - Clean, modern, professional */
--font-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Geist Mono - For code, data, numbers */
--font-mono: 'Geist Mono', 'SF Mono', Monaco, monospace;
```

### Type Scale

```css
/* Display - Hero sections only */
--text-display: 72px / 0.9 / -0.02em / 700;

/* Headings */
--text-h1: 48px / 1.1 / -0.02em / 600;
--text-h2: 36px / 1.2 / -0.01em / 600;
--text-h3: 24px / 1.3 / -0.01em / 600;
--text-h4: 20px / 1.4 / normal / 600;
--text-h5: 16px / 1.5 / normal / 600;

/* Body */
--text-body-large: 18px / 1.6 / normal / 400;
--text-body: 16px / 1.5 / normal / 400;
--text-body-small: 14px / 1.5 / normal / 400;

/* Captions */
--text-caption: 12px / 1.4 / normal / 500;
--text-caption-small: 10px / 1.3 / 0.05em / 600;
```

### Font Weights

```css
--weight-regular: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

### Typography Rules

✅ **DO:**
- Use 16px as base body size
- Maintain clear hierarchy
- Limit to 2-3 weights per page
- Use black (900) for headings
- Use stone-600 for body text
- Use stone-400 for muted text

❌ **DON'T:**
- Mix more than 2 font families
- Use decorative fonts
- Go below 14px for body text
- Use all caps excessively
- Use italic for emphasis (use weight instead)

---

## Spacing System

### Base Unit: 4px

```css
/* Spacing scale (4px base) */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

### Layout Spacing

```css
/* Container widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;
--container-2xl: 1536px;

/* Section spacing */
--section-spacing-sm: 64px;
--section-spacing-md: 96px;
--section-spacing-lg: 128px;

/* Grid gaps */
--grid-gap-sm: 16px;
--grid-gap-md: 24px;
--grid-gap-lg: 32px;
```

---

## Components

### Buttons

```tsx
// Primary Button (Black)
<button className="
  bg-black text-white
  px-6 py-3
  text-sm font-medium
  border border-black
  hover:bg-stone-900
  transition-colors
  uppercase tracking-wide
">
  Add to Cart
</button>

// Secondary Button (Outlined)
<button className="
  bg-white text-black
  px-6 py-3
  text-sm font-medium
  border border-black
  hover:bg-black hover:text-white
  transition-colors
  uppercase tracking-wide
">
  Learn More
</button>

// Ghost Button (Minimal)
<button className="
  text-black
  px-4 py-2
  text-sm font-medium
  hover:bg-stone-100
  transition-colors
">
  View Details
</button>
```

### Cards

```tsx
// Product Card
<article className="
  bg-white
  border border-stone-200
  hover:border-black
  transition-colors
  group
">
  <div className="aspect-square overflow-hidden">
    <Image
      src={product.image}
      className="
        object-cover
        group-hover:scale-105
        transition-transform duration-500
      "
    />
  </div>
  <div className="p-6">
    <h3 className="text-lg font-semibold text-black">
      {product.name}
    </h3>
    <p className="text-sm text-stone-500 mt-1">
      {product.vendor}
    </p>
    <p className="text-base font-medium text-black mt-4">
      ${product.price}
    </p>
  </div>
</article>
```

### Form Inputs

```tsx
// Text Input
<input
  type="text"
  className="
    w-full
    px-4 py-3
    border border-stone-200
    focus:border-black focus:outline-none
    text-base text-black
    placeholder:text-stone-400
    transition-colors
  "
  placeholder="Email address"
/>

// Select Dropdown
<select className="
  w-full
  px-4 py-3
  border border-stone-200
  focus:border-black focus:outline-none
  text-base text-black
  bg-white
  transition-colors
">
  <option>Select category</option>
</select>
```

---

## Layout Patterns

### Grid System

```tsx
// Product Grid (Responsive)
<div className="
  grid
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  gap-6
  lg:gap-8
">
  {products.map(product => <ProductCard />)}
</div>

// Hero Section
<section className="
  max-w-7xl mx-auto
  px-4 sm:px-6 lg:px-8
  py-20 lg:py-32
">
  <h1 className="text-5xl lg:text-7xl font-semibold">
    Curated Wedding <br />
    Marketplace
  </h1>
</section>
```

### Whitespace Usage

```css
/* Generous whitespace */
.section {
  padding-block: 80px; /* Vertical breathing room */
}

.container {
  max-width: 1280px;
  margin-inline: auto;
  padding-inline: 32px; /* Side padding */
}

.content {
  max-width: 65ch; /* Optimal reading width */
  line-height: 1.6; /* Comfortable reading */
}
```

---

## Border Radius

### Minimal Rounding

```css
/* Subtle, professional */
--radius-sm: 2px;
--radius-md: 3px;
--radius-lg: 4px;

/* Never use */
--radius-full: 0; /* NO pill-shaped buttons */
--radius-2xl: 0;  /* NO overly rounded cards */
```

---

## Shadows

### Refined Elevation

```css
/* Subtle shadows only */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);

/* For modals/popovers only */
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
```

❌ **Never use:**
- Colored shadows
- Heavy drop shadows
- Inner shadows (except inputs)
- Multiple shadows

---

## Icons

### Heroicons (NOT Lucide)

```tsx
import { ShoppingBagIcon, HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

// All icons BLACK or WHITE only
<ShoppingBagIcon className="w-6 h-6 text-black" />
<HeartIcon className="w-5 h-5 text-white" />
```

### Icon Sizes

```css
--icon-xs: 16px;
--icon-sm: 20px;
--icon-md: 24px;
--icon-lg: 32px;
--icon-xl: 48px;
```

### Icon Rules

✅ **DO:**
- Use 24px outline icons for UI
- Use solid icons for filled states
- Keep icons black or white
- Align icons with text baseline
- Use consistent stroke width

❌ **DON'T:**
- Color icons (except error states)
- Mix icon libraries
- Use decorative icons
- Scale icons with transform

---

## Photography

### Image Treatment

```tsx
// High-quality, minimal processing
<Image
  src={photo}
  className="
    object-cover
    w-full h-full
    saturate-90  // Slightly desaturated
    contrast-105 // Slightly higher contrast
  "
/>
```

### Image Ratios

```css
/* Product images */
--ratio-square: 1 / 1;
--ratio-portrait: 4 / 5;
--ratio-landscape: 3 / 2;

/* Hero images */
--ratio-wide: 16 / 9;
--ratio-ultrawide: 21 / 9;
```

### Photography Guidelines

✅ **DO:**
- Use professional photography
- Maintain consistent lighting
- Show products in context
- Use minimal backgrounds
- Keep images crisp

❌ **DON'T:**
- Over-filter images
- Use stock photo clichés
- Add text overlays
- Use busy backgrounds

---

## Animation & Transitions

### Timing

```css
/* Duration */
--duration-fast: 150ms;
--duration-base: 200ms;
--duration-slow: 300ms;

/* Easing */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Common Transitions

```css
/* Hover states */
.button {
  transition: all 200ms ease-out;
}

/* Image zoom */
.image {
  transition: transform 500ms ease-out;
}

/* Opacity */
.fade {
  transition: opacity 200ms ease-in-out;
}
```

---

## Component Library

### Using shadcn/ui

All components should be customized to match our black/white aesthetic:

```tsx
// Button variants
<Button variant="default">  // Black background
<Button variant="outline">  // Black border
<Button variant="ghost">    // Transparent

// Card (white with border)
<Card className="border-stone-200 hover:border-black">

// Input (minimal styling)
<Input className="border-stone-200 focus:border-black" />
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile first */
--screen-sm: 640px;
--screen-md: 768px;
--screen-lg: 1024px;
--screen-xl: 1280px;
--screen-2xl: 1536px;
```

### Mobile Design Rules

✅ **DO:**
- Design mobile-first
- Stack elements vertically
- Increase touch targets (44px minimum)
- Simplify navigation
- Optimize images for mobile

❌ **DON'T:**
- Hide important content
- Use tiny text
- Require horizontal scrolling
- Use hover-only interactions

---

## Accessibility

### WCAG AAA Standards

```tsx
// Color contrast
<div className="bg-black text-white">  // 21:1 contrast
<div className="bg-white text-black">  // 21:1 contrast

// Focus states
<button className="
  focus:outline-none
  focus:ring-2 focus:ring-black
  focus:ring-offset-2
">

// ARIA labels
<button aria-label="Add to cart">
  <ShoppingBagIcon />
</button>
```

---

## Design Principles

### 1. Less is More
- Remove unnecessary elements
- Let content breathe
- Embrace whitespace
- One clear action per screen

### 2. Consistency
- Reuse components
- Follow patterns
- Maintain spacing
- Keep hierarchy clear

### 3. Quality
- Professional photography
- Smooth animations
- Crisp typography
- Attention to detail

### 4. Performance
- Optimize images
- Minimize JavaScript
- Fast loading
- Smooth interactions

---

## Anti-Patterns (Never Do)

❌ **Avoid These AI/Generic Patterns:**

1. **Purple accent colors** - We use black/stone only
2. **Gradient backgrounds** - Flat colors only
3. **Rounded pill buttons** - Minimal radius only
4. **Drop shadows everywhere** - Subtle elevation only
5. **Colored icons** - Black/white only
6. **Multiple accent colors** - One accent (black)
7. **Decorative elements** - Functional only
8. **Busy layouts** - Clean and spacious
9. **Generic stock photos** - Professional, contextual only
10. **Trend-chasing** - Timeless aesthetic

---

## References

Study these for inspiration:
- High-end fashion e-commerce
- Premium curation platforms
- Minimalist marketplaces
- Editorial design systems

---

Last updated: November 2024
