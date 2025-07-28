import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase';

const CreateTechnicalAnalysisSchema = z.object({
  tokenAddress: z.string().min(1, 'Token address is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  description: z.string().min(1, 'Description is required'),
  description_en: z.string().nullable().optional(),
});

/**
 * Creates technical analysis record in database
 */
async function createTechnicalAnalysisRecord(
  tokenAddress: string,
  imageUrl: string,
  description: string,
  description_en?: string | null,
) {
  const supabase = createServerSupabaseClient();

  const insertData: any = {
    address: tokenAddress,
    image: imageUrl,
    description: description,
  };

  // Add English description if it exists
  if (description_en !== undefined) {
    insertData.description_en = description_en || null;
  }

  const { data, error } = await supabase
    .from('technical_analysis')
    .insert(insertData)
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
    const description_en = formData.get('description_en') as string | null;

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

    // Validate the data
    const validatedData = CreateTechnicalAnalysisSchema.parse({
      tokenAddress,
      imageUrl,
      description,
      description_en,
    });

    // Create database record
    const technicalAnalysisRecord = await createTechnicalAnalysisRecord(
      validatedData.tokenAddress,
      validatedData.imageUrl,
      validatedData.description.trim(),
      validatedData.description_en?.trim() || null,
    );

    return NextResponse.json({
      success: true,
      technicalAnalysis: technicalAnalysisRecord,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Technical analysis create API error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0]?.message || 'Invalid request data' },
        { status: 400 },
      );
    }

    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Create failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
