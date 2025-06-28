import { NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase';

export async function GET() {
  try {
    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    // Fetch users from Supabase Auth
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 },
      );
    }

    // Transform the data to match our User interface
    const users = data.users.map((user) => ({
      id: user.id,
      email: user.email || '',
      role: (user.user_metadata?.role as 'admin' | 'user') || 'user',
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at || null,
      confirmed_at: user.email_confirmed_at || null,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error in users API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
