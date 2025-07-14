import { NextRequest, NextResponse } from 'next/server';

import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * Updates technical analysis record with new image URL
 */
async function updateTechnicalAnalysisImage(id: number, imageUrl: string) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('technical_analysis')
    .update({
      image: imageUrl,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating technical analysis image:', error);
    throw new Error('Failed to update technical analysis image in database.');
  }

  return data;
}

export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string | null;
    const imageUrl = formData.get('imageUrl') as string | null;

    if (!id) {
      return NextResponse.json(
        { error: 'Technical analysis ID is required' },
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 },
      );
    }

    // Update database record
    const technicalAnalysisRecord = await updateTechnicalAnalysisImage(
      Number(id),
      imageUrl,
    );

    return NextResponse.json({
      success: true,
      technicalAnalysis: technicalAnalysisRecord,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Technical analysis image update API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Update failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
