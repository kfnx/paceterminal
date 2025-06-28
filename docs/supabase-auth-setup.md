# Supabase Authentication Setup

This document outlines the Supabase authentication integration for the admin section of the application.

## Overview

The authentication system uses Supabase Auth with the following features:

- Email/password authentication
- Password reset functionality
- Protected admin routes
- Session management
- Automatic redirects

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## File Structure

```
lib/
  supabase.ts              # Supabase client configuration
hooks/
  use-auth.ts              # Authentication hook
app/admin/
  login/
    page.tsx               # Login page
  reset-password/
    page.tsx               # Password reset page
  page.tsx                 # Admin dashboard
  auth-provider.tsx        # Authentication provider with route protection
  layout.tsx               # Admin layout with auth provider
```

## Features

### Authentication Hook (`useAuth`)

The `useAuth` hook provides:

- User state management
- Session management
- Login functionality
- Logout functionality
- Password reset functionality

### Route Protection

The `AuthProvider` component handles route protection by:

- Redirecting unauthenticated users to `/login`
- Redirecting authenticated users away from auth pages
- Managing loading states during authentication checks

### Admin Dashboard

The admin dashboard (`/admin`) shows:

- User information
- Logout functionality
- Protected content

## Usage

### Login

Users can log in at `/login` with their email and password.

### Password Reset

Users can request a password reset at `/password`. They will receive an email with a reset link.

### Logout

Users can log out from the admin dashboard using the "Sign Out" button.

## Security

- All admin routes are protected by middleware
- Sessions are automatically refreshed
- Passwords are handled securely by Supabase
- Environment variables are properly configured

## Development

To test the authentication:

1. Set up your Supabase project
2. Configure environment variables
3. Create a user in your Supabase dashboard or enable sign-ups
4. Navigate to `/login` to test the authentication flow
