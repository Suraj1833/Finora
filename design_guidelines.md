# Finora Design Guidelines

## Design Approach

**Selected Approach:** Design System + Fintech Reference Hybrid
- **Primary References:** Stripe (payment UI clarity), Plaid (connection flows), Revolut (dashboard simplicity)
- **Core Principle:** Build trust through clarity, consistency, and professional restraint
- **Design Philosophy:** Financial applications demand precision, security cues, and effortless navigation

## Typography System

**Font Stack:**
- Primary: Inter (via Google Fonts CDN) - clean, modern, excellent at small sizes
- Monospace: JetBrains Mono - for account numbers, balances

**Hierarchy:**
- Hero/Page Titles: 2.5rem (40px), font-weight 700
- Section Headers: 1.75rem (28px), font-weight 600
- Card Titles: 1.25rem (20px), font-weight 600
- Body Text: 1rem (16px), font-weight 400
- Financial Values: 1.5rem (24px), font-weight 600, monospace
- Labels/Meta: 0.875rem (14px), font-weight 500

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6, p-8
- Section spacing: space-y-8, space-y-12
- Card gaps: gap-4, gap-6
- Micro-spacing: m-2, m-4

**Container Strategy:**
- Max-width: 1200px for main content (max-w-6xl)
- Card max-width: 500px for signup/connect flows
- Dashboard grid: Full width with responsive columns

## Component Library

### Authentication Components

**Signup Card:**
- Centered card (max-w-md) with generous padding (p-8)
- Logo/brand at top (mb-8)
- Headline + subtitle explaining value proposition
- Two primary action buttons stacked vertically (space-y-4):
  - "Continue with Google" (with Google icon)
  - "Continue with Phone" (with phone icon)
- Footer with terms/privacy links (text-sm, mt-8)
- Subtle elevation with rounded corners (rounded-2xl)

**Phone Number Input Flow:**
- Large input field for phone number (h-12, text-lg)
- Country code selector integrated
- OTP verification screen with 6-digit code input boxes
- Clear back navigation

### Account Connection Interface

**Connection Card Layout:**
- Grid of connection options: grid-cols-1 md:grid-cols-3 gap-6
- Each card includes:
  - Large icon representing service type (h-16 w-16)
  - Service name (text-xl font-semibold)
  - Connection status indicator
  - "Connect" button or "Connected" badge
  - Optional: last sync timestamp

**Account Types:**
- Bank Account: Traditional bank icon, includes routing info display
- UPI: UPI logo, shows linked UPI IDs
- Wallet: Digital wallet icon, displays wallet balance preview

**Connection Flow:**
- Modal/slide-over for credential entry
- Progress indicator for connection status
- Success confirmation with animation
- Error states with retry options

### Dashboard Components

**Summary Header:**
- Full-width section (py-12)
- Total balance prominently displayed (text-4xl, font-bold, monospace)
- Subtitle: "Across all accounts" (text-sm)
- Quick action buttons: "Add Account", "Refresh" (inline-flex gap-4)

**Account Cards Grid:**
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Each account card contains:
  - Account type badge (top-left)
  - Account name/last 4 digits
  - Current balance (text-2xl, monospace)
  - Mini trend indicator (optional)
  - Last updated timestamp
  - "View Details" link
- Card styling: p-6, rounded-xl, border treatment

**Transaction Preview (Optional Dashboard Section):**
- Horizontal scrollable list or fixed recent 5 transactions
- Each transaction: icon, description, amount, date
- "View All Transactions" link

**Empty States:**
- For no connected accounts: Large icon, helpful message, "Connect Account" CTA
- Centered in viewport, friendly tone

## Navigation

**Top Navigation Bar:**
- Fixed position (sticky top-0)
- Logo left, navigation center/right
- User profile menu (right corner)
- Height: h-16
- Items: Dashboard, Accounts, Settings
- Mobile: Hamburger menu with slide-out drawer

## Interaction Patterns

**Button Hierarchy:**
- Primary Actions: Full-width on mobile, auto-width on desktop, h-12, rounded-lg
- Secondary Actions: outlined style, same dimensions
- Icon buttons: h-10 w-10, rounded-full

**Card Interactions:**
- Hover: Subtle lift effect (translate-y transition)
- Active: Slight scale down
- No distracting animations on financial data

**Loading States:**
- Skeleton screens for dashboard data
- Inline spinners for connection attempts
- Progress bars for multi-step flows

## Responsive Behavior

**Breakpoints:**
- Mobile: base (default)
- Tablet: md: (768px)
- Desktop: lg: (1024px)

**Mobile Adaptations:**
- Stack all cards vertically
- Full-width buttons
- Reduced padding (p-4 instead of p-8)
- Simplified navigation (bottom nav consideration)

**Desktop Enhancements:**
- Multi-column layouts
- Hover states more prominent
- Sidebar for account list (optional)

## Trust & Security Visual Cues

**Security Indicators:**
- Lock icons near sensitive fields
- "Secure Connection" badge on connection screens
- SSL/encryption messaging in footer
- Bank-grade security copy

**Professional Polish:**
- Consistent rounded corners (rounded-lg to rounded-2xl)
- Subtle shadows (shadow-sm for cards, shadow-md for elevated)
- Clean borders (border treatment over heavy shadows)
- Ample whitespace preventing cluttered feel

## Accessibility Requirements

- Minimum touch target: 44x44px for all interactive elements
- Form labels always visible (no placeholder-only inputs)
- Clear focus indicators (ring-2 ring-offset-2)
- Semantic HTML structure throughout
- ARIA labels for icon-only buttons
- Keyboard navigation support for all flows

## Images

**No Hero Image Required** - This is a utility-focused application prioritizing function over marketing appeal

**Icon Usage:**
- Use Font Awesome or Heroicons via CDN
- Financial icons: bank, credit-card, wallet, smartphone
- UI icons: check-circle, x-circle, arrow-right, refresh
- Provider logos: Google logo for OAuth

**Account Type Icons:**
- Large, clear iconography (h-12 w-12 minimum)
- Consistent style across all account types
- Positioned prominently in cards