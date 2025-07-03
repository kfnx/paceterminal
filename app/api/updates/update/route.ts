import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase';

// Validation schema for the request body
const UpdateUpdateSchema = z.object({
  id: z.number().int('ID must be an integer'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  link: z.string().url('Link must be a valid URL'),
  image: z.string().url('Image must be a valid URL').nullable().optional(),
  date: z.string().min(1, 'Date is required'),
});

export async function PUT(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { id, title, description, link, image, date } =
      UpdateUpdateSchema.parse(body);

    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('updates')
      .update({
        title,
        description,
        link,
        image: image || null,
        date: date,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating update:', error);
      return NextResponse.json(
        { error: 'Failed to update update' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      update: data,
    });
  } catch (error) {
    console.error('Update API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid request data' },
        { status: 400 },
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Update failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
