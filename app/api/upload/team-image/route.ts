import { NextRequest, NextResponse } from 'next/server';
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

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
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      }),
    );
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Sanitizes a string to be used in file paths
 */
function sanitizeFileName(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Uploads a team image to S3
 */
async function uploadTeamImage(
  file: Buffer,
  tokenAddress: string,
  teamMemberIndex: number,
  teamMemberName: string,
  contentType: string,
) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_S3_REGION;

  // Determine file extension from content type
  const extension = contentType.split('/')[1];

  // Create a more descriptive key for team member images
  const sanitizedName = teamMemberName
    ? sanitizeFileName(teamMemberName)
    : `member-${teamMemberIndex}`;
  const key = `images/teams/${tokenAddress}/${sanitizedName}.${extension}`;

  // Check if file already exists
  const exists = await fileExists(key);

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
    CacheControl: 'public, max-age=3600', // 1 hour cache
    Metadata: {
      tokenAddress: tokenAddress,
      teamMemberIndex: teamMemberIndex.toString(),
      teamMemberName: teamMemberName || '',
      uploadedAt: new Date().toISOString(),
    },
  };

  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    const timestamp = Date.now(); // Cache-busting timestamp
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}?v=${timestamp}`;
    return { success: true, url, key, replaced: exists };
  } catch (error) {
    console.error('Error uploading team image to S3:', error);
    throw new Error('Failed to upload team member image to S3.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const tokenAddress = formData.get('tokenAddress') as string | null;
    const teamMemberIndex = formData.get('teamMemberIndex') as string | null;
    const teamMemberName = formData.get('teamMemberName') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!tokenAddress) {
      return NextResponse.json(
        { error: 'Token address is required' },
        { status: 400 },
      );
    }

    if (!teamMemberIndex) {
      return NextResponse.json(
        { error: 'Team member index is required' },
        { status: 400 },
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const memberIndex = parseInt(teamMemberIndex, 10);

    const { url, key, replaced } = await uploadTeamImage(
      fileBuffer,
      tokenAddress,
      memberIndex,
      teamMemberName || '',
      file.type,
    );

    return NextResponse.json({
      success: true,
      url,
      key,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      replaced,
      tokenAddress,
      teamMemberIndex: memberIndex,
      teamMemberName: teamMemberName || '',
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Team image upload API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
