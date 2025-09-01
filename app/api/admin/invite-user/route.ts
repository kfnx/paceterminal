import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase';

// Validation schema for the request body
const InviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { email } = InviteUserSchema.parse(body);

    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    // Check if user already exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const userExists = existingUser.users.some((user) => user.email === email);

    if (userExists) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 },
      );
    }

    // Invite the user using Supabase Auth
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/update-password`,
    });

    if (error) {
      console.error('Error inviting user:', error);
      return NextResponse.json(
        { error: 'Failed to send invitation' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Invitation sent successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (error) {
    console.error('Error in invite-user API:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid request data' },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
