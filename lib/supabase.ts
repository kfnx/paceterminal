import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
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
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!serviceRoleKey) {
    throw new Error('Missing Supabase service role key');
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey);
};
