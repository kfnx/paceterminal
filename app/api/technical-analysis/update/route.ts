import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase';

const UpdateTechnicalAnalysisSchema = z.object({
  id: z.number().int('ID must be an integer'),
  description: z.string().min(1, 'Description is required'),
  description_en: z.string().nullable().optional(),
});

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, description, description_en } =
      UpdateTechnicalAnalysisSchema.parse(body);

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    if (description === undefined) {
      return NextResponse.json(
        { error: 'No description provided' },
        { status: 400 },
      );
    }

    // Create server-side Supabase client with service role key
    const supabase = createServerSupabaseClient();

    const updateData: any = {
      description: description || null,
    };

    // Add English description if it exists
    if (description_en !== undefined) {
      updateData.description_en = description_en || null;
    }

    const { data, error } = await supabase
      .from('technical_analysis')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating technical analysis:', error);
      return NextResponse.json(
        { error: 'Failed to update technical analysis' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      technicalAnalysis: data,
    });
  } catch (error) {
    console.error('Technical analysis update API error:', error);

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
