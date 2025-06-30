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
- `pnpm format:write` - Format code with Prettier

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
- **Authentication**: Supabase Auth with email/password
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
- Prefer React Server Components over client components
- Use descriptive variable names with auxiliary verbs (isLoading, hasError)
- Implement proper error handling with early returns and guard clauses
- Follow mobile-first responsive design principles

### File Organization
- `app/` - Next.js 14 app router structure
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
- Supabase handles authentication with email verification
- Admin operations require service role key validation
- Wallet addresses used for membership verification alongside email auth

## Testing and Quality

- ESLint configuration with Next.js and Tailwind plugins
- Prettier with import sorting for consistent formatting
- TypeScript strict mode for type safety
- Error boundaries and proper error handling throughout application