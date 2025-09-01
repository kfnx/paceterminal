import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase';

// Validation schema for the request body
const ResendInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { email } = ResendInvitationSchema.parse(body);

    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    // Check if user exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const user = existingUser.users.find((user) => user.email === email);

    if (!user) {
      return NextResponse.json(
        { error: 'User with this email does not exist' },
        { status: 404 },
      );
    }

    // Check if user is already confirmed
    if (user.email_confirmed_at) {
      return NextResponse.json(
        { error: 'User has already confirmed their email' },
        { status: 400 },
      );
    }

    // Resend the invitation using Supabase Auth
    // Note: Supabase doesn't have a dedicated resend method, so we use inviteUserByEmail
    // which will resend the invitation if the user already exists but hasn't confirmed
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/update-password`,
    });

    if (error) {
      console.error('Error resending invitation:', error);
      return NextResponse.json(
        { error: 'Failed to resend invitation' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Invitation resent successfully',
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    });
  } catch (error) {
    console.error('Error in resend-invitation API:', error);

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
