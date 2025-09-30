# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pace Terminal is a cryptocurrency token research and analysis platform focused on Solana blockchain tokens. It serves as a curated database for evaluating emerging crypto projects with comprehensive team analysis, business metrics, and technical data.

## Common Development Commands

### Package Management
- `pnpm install` - Install dependencies
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

### Database
- `pnpm db:gen:types` - Generate TypeScript types from Supabase schema

## Architecture

### Frontend Stack
- **Framework**: Next.js 14 with App Router and TypeScript
- **UI**: Custom component library using Tailwind CSS and Radix UI primitives
- **Icons**: @remixicon/react for consistent iconography
- **State Management**: TanStack Query for server state, Jotai for client state
- **Forms**: React Hook Form with Zod validation
- **Styling**: Extensive custom design system with semantic color tokens

### Backend & Data
- **Database**: Supabase (PostgreSQL) with typed schema
- **Authentication**: Supabase Auth with @supabase/ssr for server-side rendering
- **Session Management**: Next.js middleware with automatic token refresh
- **Route Protection**: Server-side user validation for admin routes
- **File Storage**: AWS S3 for token and flywheel images
- **API**: Next.js 14 API routes with proper authentication middleware

### Blockchain Integration
- **Network**: Solana mainnet via Helius RPC
- **Wallet Adapters**: @solana/wallet-adapter-* ecosystem
- **Primary Wallet**: Phantom wallet integration
- **Features**: SOL and SPL token transfers, wallet connection management

## Key Application Features

### Core Entities
- **Tokens**: Solana token data with tier classifications (S, A, B, C)
- **Teams**: Team member profiles linked to tokens
- **Flywheels**: Business model visualizations
- **Members**: Subscription-based access control
- **Users**: Authentication and authorization system

### User Workflows
1. **Public Access**: Browse token directory, basic information
2. **Authenticated Users**: Full token details, wallet integration
3. **Admin Users**: Content management, user administration
4. **Member Users**: Premium features based on subscription status

### Solana Wallet System
- **Connection Management**: Auto-connect, state management, balance fetching
- **Transactions**: Universal SOL and SPL token transfers
- **Payment System**: USDC subscription payments ($20/month, $200/year)
- **Network Support**: Mainnet, devnet, testnet, localnet detection

## Development Guidelines

### Code Style (from .cursor/rules)
- Use functional and declarative patterns, avoid classes
- Prefer React Server Components over client components when possible
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)
- Implement proper error handling with early returns and guard clauses
- Follow mobile-first responsive design principles
- Use pnpm for package management
- Use @remixicon/react for icons
- Use @tanstack/react-query for data fetching
- Use Zod for validation in API routes
- Import components with namespace imports (e.g., `import * as Button from '@/components/ui/button'`)

### File Organization
- `app/` - Next.js 14 app router structure
  - `app/(main)/` - Public pages with navigation
  - `app/admin/` - Admin-only pages with authentication middleware
  - `app/api/` - API routes with proper authentication
- `components/` - Reusable UI components with ui/ subfolder for primitives
- `hooks/` - Custom React hooks for business logic
- `lib/` - Utility functions, constants, and database types
- `utils/` - Helper functions and shared utilities

### Key Custom Hooks
- `useWalletConnection` - Wallet state and balance management
- `useSolanaTransaction` - SOL and token transfer functionality
- `useAuth` - Authentication state management
- `useTokens` - Token data fetching and management
- `useMembers` - Membership status checking

### Database Schema
The application uses Supabase with generated TypeScript types in `lib/database.types.ts`. Key tables include:
- `tokens` - Core token information and metadata
- `teams` - Team member profiles and social links
- `flywheels` - Business model visualization data
- `members` - Subscription and access control
- `users` - User accounts and profiles
- `token_burned_chart` - Burn screener chart data with token names and percentages
- `ads` - Advertisement management system

## Environment Variables

Required environment variables for development:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side admin operations
- `NEXT_PUBLIC_HELIUS_RPC_URL` - Solana RPC endpoint
- `AWS_ACCESS_KEY_ID` - S3 file upload access
- `AWS_SECRET_ACCESS_KEY` - S3 file upload secret
- `AWS_REGION` - S3 bucket region (ap-southeast-1)
- `AWS_BUCKET_NAME` - S3 bucket name (paceterminal)

## Special Considerations

### Solana Integration
- All wallet operations use the custom hook system for consistency
- Token transfers support any SPL token with configurable mint addresses
- Network detection automatically handles mainnet/devnet differences
- Payment system integrates with membership verification API

### Image Management
- Token images stored in S3 with CDN optimization
- Flywheel diagrams support business model visualization
- Image upload components handle S3 integration seamlessly

### Authentication Flow
- Supabase Auth with modern @supabase/ssr patterns for secure server-side rendering
- Client-side: `createBrowserClient()` from `@/lib/supabase` for hooks and client components
- Server-side: `createClient()` from `@/lib/supabase-server` for RSC and API routes
- Middleware handles automatic token refresh and route protection
- Admin routes protected via server-side `getUser()` validation in layout (more secure than `getSession()`)
- Service role key for admin operations (user management, invitations)
- Wallet addresses used for membership verification alongside email auth

### Admin Area Architecture
- `/app/admin/layout.tsx` - Server-side authentication guard for all admin routes
- Admin CRUD pages follow consistent patterns: data fetching, modal forms, table display
- Use client components for forms and interactive UI, server components for data fetching
- Toast notifications via Sonner for user feedback
- Modal-based CRUD operations with proper validation and error handling

## Testing and Quality

- ESLint configuration with Next.js and Tailwind plugins
- Prettier with import sorting for consistent formatting
- TypeScript strict mode for type safety
- Error boundaries and proper error handling throughout application

## Development Patterns & Best Practices

### Component Patterns
- **Compound Components**: Use composition patterns for complex UI (Button groups, Avatar groups)
- **Polymorphic Components**: Components with flexible APIs and type safety
- **Radix UI Integration**: Leverage primitive components for accessibility
- **Tailwind Variants (tv)**: Type-safe variant system for consistent component APIs
- **Server/Client Separation**: RSC for data fetching, client components for interactivity

### Authentication & Authorization Patterns
- **Dual Client Architecture**: `createBrowserClient()` for hooks/components, `createClient()` for RSC/API routes
- **Middleware-based Protection**: Admin route protection via `getUser()` validation (more secure than `getSession()`)
- **Service Role Operations**: Use service role key for admin operations (user management, invitations)
- **Route Group Organization**: `(auth)/` for auth pages, `(main)/` for public pages with navigation

### Database & API Patterns
- **Generated Types**: Always use TypeScript types from `lib/database.types.ts`
- **Zod Validation**: Runtime validation in API routes with consistent error handling
- **TanStack Query**: 1-minute stale time for server state management
- **Error Boundaries**: Comprehensive error handling throughout application

### Solana Integration Patterns
- **Custom Hook System**: Use `useWalletConnection`, `useSolanaTransaction` for consistency
- **Network Detection**: Automatic mainnet/devnet handling with appropriate mint addresses
- **Payment Verification**: On-chain transaction validation with membership integration
- **Multi-wallet Support**: Phantom primary, @solana/wallet-adapter-* ecosystem

### Design System Usage
- **Semantic Typography**: Use `title-h1` through `paragraph-xs` classes
- **HSL Color Tokens**: Theme-aware colors via CSS custom properties (`bg-white-0`, `text-strong-950`)
- **Custom Shadows**: Predefined shadow system for buttons, tooltips, and overlays
- **Mobile-first**: Responsive design with breakpoint management

### File Naming & Organization
- **Route Groups**: Use parentheses for logical grouping without affecting URL structure
- **Namespace Imports**: `import * as Button from '@/components/ui/button'`
- **Path Aliases**: `@/*` for project root, `~/*` for public assets
- **Component Co-location**: Keep related components, hooks, and utilities together

### Internationalization
- **Dynamic Locale Detection**: URL-based language switching (`/id` for Indonesian)
- **Server-side Translations**: Pre-rendered content for SEO optimization
- **Translation Context**: Client-side loading with fallbacks

### Development Workflow
- **No Testing Framework**: Project currently lacks formal testing setup (opportunity for addition)
- **Code Quality**: ESLint + Prettier with import sorting for consistency
- **Standalone Build**: Optimized for containerized deployment
- **SVGR Integration**: Custom SVG handling with TypeScript support

## Important Development Reminders

- NEVER create files unless absolutely necessary for achieving your goal
- ALWAYS prefer editing existing files over creating new ones
- NEVER proactively create documentation files (*.md) or README files unless explicitly requested
- When mixing server and client components, ensure proper separation:
  - Server components: Data fetching, authentication, database operations
  - Client components: Forms, interactive UI, hooks, context providers
- Always use proper TypeScript types from `lib/database.types.ts` for database operations
- Follow the established admin CRUD patterns when creating new admin functionality