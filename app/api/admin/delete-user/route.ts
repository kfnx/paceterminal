import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase';

// Validation schema for the request body
const DeleteUserSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
});

export async function DELETE(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { userId } = DeleteUserSchema.parse(body);

    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    // Check if user exists
    const { data: existingUser } = await supabase.auth.admin.listUsers();
    const user = existingUser.users.find((user) => user.id === userId);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete the user using Supabase Auth
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      console.error('Error deleting user:', error);
      return NextResponse.json(
        { error: 'Failed to delete user' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'User deleted successfully',
      userId,
    });
  } catch (error) {
    console.error('Error in delete-user API:', error);

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
