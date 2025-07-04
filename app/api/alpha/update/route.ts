import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase';

const UpdateAlphaSchema = z.object({
  id: z.number().int('ID must be an integer'),
  title: z.string().min(1, 'Title is required'),
  text: z.string().nullable().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, text } = UpdateAlphaSchema.parse(body);

    const supabase = createServerSupabaseClient();

    const { data, error } = await supabase
      .from('alpha')
      .update({
        title,
        text: text || null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating alpha:', error);
      return NextResponse.json(
        { error: 'Failed to update alpha' },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Alpha update API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid request data' },
        { status: 400 },
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
