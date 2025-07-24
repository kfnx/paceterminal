import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';

// Only warn in development if environment variables are missing
if (
  process.env.NODE_ENV === 'development' &&
  (!process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
) {
  console.warn(
    '⚠️ Missing Supabase environment variables. Please create a .env.local file with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
  );
}

// Client-side Supabase client - use for client components and hooks
export const supabase = createBrowserClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);

// Legacy client for backward compatibility
export const legacySupabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
);

// Server-side client with service role key for admin operations
export const createServerSupabaseClient = () => {
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder_service_key';

  if (
    process.env.NODE_ENV === 'development' &&
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.warn(
      '⚠️ Missing Supabase service role key. Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file',
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey);
};
