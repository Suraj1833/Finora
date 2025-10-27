# Finora - Financial Dashboard Application

## Overview

Finora is a comprehensive financial management application that enables users to connect and monitor multiple financial accounts (bank accounts, UPI payments, digital wallets, credit cards, and cryptocurrency) in a unified dashboard. The application provides expense tracking, budget management, transaction categorization, and financial insights through an intuitive, fintech-inspired interface.

The project is structured as a full-stack TypeScript application with a React frontend and Express backend, utilizing Drizzle ORM for database operations and shadcn/ui components for a polished user experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework:** React 18 with TypeScript
- **Routing:** Wouter (lightweight client-side routing)
- **State Management:** Client-side localStorage-based state store (`client/src/store.ts`) for persisting account and transaction data
- **Data Fetching:** TanStack Query (React Query) for server state management
- **Styling:** Tailwind CSS with custom design system based on shadcn/ui
- **Build Tool:** Vite

**Design System:**
- Based on shadcn/ui component library with "new-york" style preset
- Custom color scheme with HSL-based theming supporting light/dark modes
- Typography using Inter (primary) and JetBrains Mono (monospace for financial values) via Google Fonts
- Fintech-inspired design principles drawing from Stripe, Plaid, and Revolut interfaces
- Component library with pre-built financial UI components (account cards, transaction lists, budget progress, etc.)

**Key Pages:**
- `/` - Signup page with Google and phone authentication options
- `/connect` - Account connection flow for linking financial accounts
- `/dashboard` - Account summary and management
- `/finance-dashboard` - Main financial insights dashboard with transactions, budgets, and spending analysis

### Backend Architecture

**Technology Stack:**
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database ORM:** Drizzle ORM
- **Database Driver:** Neon Serverless (PostgreSQL)
- **Session Management:** Planned with connect-pg-simple

**Data Layer:**
- **Database:** PostgreSQL via Neon serverless connection
- **Schema Location:** `shared/schema.ts` (shared between client and server)
- **Current Schema:** Basic user authentication table (username, password, UUID primary key)
- **Storage Interface:** Abstract storage interface (`server/storage.ts`) with in-memory implementation for development and planned database implementation

**API Design:**
- RESTful API endpoints prefixed with `/api`
- Request/response logging middleware for debugging
- JSON body parsing with raw body preservation for webhook verification
- Placeholder API routes documented in `server/routes-placeholder.ts` for upcoming features:
  - Multi-account integration endpoints
  - Smart expense categorization
  - AI budget planner
  - Predictive alerts and nudges
  - AI chat assistant
  - Insight dashboard analytics

**Architectural Patterns:**
- Separation of concerns with distinct client/server/shared directories
- Repository pattern via storage interface abstraction
- Middleware-based request processing pipeline
- Environment-based configuration (development vs. production builds)

### Build and Development

**Development Mode:**
- Vite dev server with HMR (Hot Module Replacement)
- Express backend with tsx runtime for TypeScript execution
- Middleware mode Vite integration for unified dev experience
- Replit-specific plugins for cartographer and dev banner in development

**Production Build:**
- Frontend: Vite static build to `dist/public`
- Backend: esbuild bundling to `dist/index.js` as ESM module
- Asset optimization and code splitting via Vite

**Path Aliases:**
- `@/*` → `client/src/*` (frontend components/utilities)
- `@shared/*` → `shared/*` (shared types/schemas)
- `@assets/*` → `attached_assets/*` (static assets)

## External Dependencies

### Database
- **Neon PostgreSQL:** Serverless PostgreSQL database with WebSocket support
- **Connection:** Via `@neondatabase/serverless` package with connection pooling
- **Schema Management:** Drizzle Kit for migrations (output: `./migrations`)

### UI Component Library
- **shadcn/ui:** Comprehensive component library built on Radix UI primitives
- **Radix UI:** Headless, accessible UI components (dialogs, dropdowns, tooltips, etc.)
- **Recharts:** Charting library for financial data visualization (pie charts, category breakdowns)

### Form Management
- **React Hook Form:** Form state management and validation
- **Zod:** Schema validation with Drizzle integration via `drizzle-zod`

### Styling and Utilities
- **Tailwind CSS:** Utility-first CSS framework with custom configuration
- **class-variance-authority:** Type-safe variant styling for components
- **clsx + tailwind-merge:** Conditional className management

### Development Tools
- **TypeScript:** Strict type checking across frontend and backend
- **ESBuild:** Fast JavaScript bundling for production backend
- **tsx:** TypeScript execution for development server
- **PostCSS + Autoprefixer:** CSS processing pipeline

### Planned/Future Integrations
- Session management with PostgreSQL store (`connect-pg-simple`)
- AI/ML features for expense categorization and budget recommendations
- Real-time notifications for spending alerts
- Multi-account aggregation APIs (mentioned in placeholder routes)

### Font Delivery
- Google Fonts CDN for Inter and JetBrains Mono typefaces