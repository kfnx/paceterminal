import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';

/**
 * Creates technical analysis record in database
 */
async function createTechnicalAnalysisRecord(
  tokenAddress: string,
  imageUrl: string,
  description: string,
) {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('technical_analysis')
    .insert({
      address: tokenAddress,
      image: imageUrl,
      description: description,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating technical analysis record:', error);
    throw new Error('Failed to create technical analysis record in database.');
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const tokenAddress = formData.get('tokenAddress') as string | null;
    const imageUrl = formData.get('imageUrl') as string | null;
    const description = formData.get('description') as string | null;

    if (!tokenAddress) {
      return NextResponse.json(
        { error: 'Token address is required' },
        { status: 400 },
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 },
      );
    }

    if (!description || description.trim() === '') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 },
      );
    }

    // Create database record
    const technicalAnalysisRecord = await createTechnicalAnalysisRecord(
      tokenAddress,
      imageUrl,
      description.trim(),
    );

    return NextResponse.json({
      success: true,
      technicalAnalysis: technicalAnalysisRecord,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Technical analysis create API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Create failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}