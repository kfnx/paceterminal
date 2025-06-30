import { NextRequest, NextResponse } from 'next/server';
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { createServerSupabaseClient } from '@/lib/supabase';

// Configuration constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
];

// Check for required environment variables
if (
  !process.env.AWS_S3_BUCKET_NAME ||
  !process.env.AWS_S3_REGION ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY
) {
  throw new Error('Missing required AWS S3 environment variables');
}

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Validates the uploaded file
 */
function validateFile(file: File): { isValid: boolean; error?: string } {
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(
        ', ',
      )}`,
    };
  }

  return { isValid: true };
}

/**
 * Checks if a file exists in S3
 */
async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Uploads a flywheel image to S3
 */
async function uploadFlywheelImage(
  file: Buffer,
  tokenAddress: string,
  contentType: string,
) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_S3_REGION;

  // Determine file extension from content type
  const extension = contentType.split('/')[1];
  const key = `images/flywheels/${tokenAddress}.${extension}`;

  // Check if file already exists
  const exists = await fileExists(key);

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // 1 year cache
  };

  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    return { success: true, url, key, replaced: exists };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3.');
  }
}

/**
 * Updates or creates flywheel record in database
 */
async function updateFlywheelRecord(tokenAddress: string, imageUrl: string) {
  // Create server-side Supabase client with service role key
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from('flywheels')
    .upsert(
      {
        address: tokenAddress,
        image: imageUrl,
      },
      {
        onConflict: 'address',
      },
    )
    .select()
    .single();

  if (error) {
    console.error('Error updating flywheel record:', error);
    throw new Error('Failed to update flywheel record in database.');
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const tokenAddress = formData.get('tokenAddress') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!tokenAddress) {
      return NextResponse.json(
        { error: 'No token address provided' },
        { status: 400 },
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Upload to S3
    const uploadResult = await uploadFlywheelImage(
      fileBuffer,
      tokenAddress,
      file.type,
    );

    // Update database record
    const flywheelRecord = await updateFlywheelRecord(
      tokenAddress,
      uploadResult.url,
    );

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      replaced: uploadResult.replaced,
      uploadedAt: new Date().toISOString(),
      flywheel: flywheelRecord,
    });
  } catch (error) {
    console.error('Flywheel upload API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
