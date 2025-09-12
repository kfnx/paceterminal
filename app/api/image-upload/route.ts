import { NextRequest, NextResponse } from 'next/server';
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

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
 * Extracts key from S3 URL
 */
function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    if (pathParts.length < 2) return null;

    // Remove empty first element from split
    pathParts.shift();

    // Join remaining parts to form the key
    return pathParts.join('/');
  } catch (error) {
    return null;
  }
}

/**
 * Deletes an image from S3
 */
async function deleteImageFromS3(key: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  try {
    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    // Don't throw error for delete failures during replacement
    return { success: false, error: error };
  }
}

/**
 * Uploads an image to S3 with UUID filename
 */
async function uploadImageToS3(
  file: Buffer,
  folder: string,
  contentType: string,
  originalFileName?: string,
  replaceUrl?: string,
) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_S3_REGION;

  // Generate UUID filename
  const extension = contentType.split('/')[1];
  const uuid = uuidv4();
  const key = `images/${folder}/${uuid}.${extension}`;

  // Check if file already exists (unlikely with UUID but good practice)
  const exists = await fileExists(key);

  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // 1 year cache
    Metadata: {
      originalFileName: originalFileName || '',
      uploadedAt: new Date().toISOString(),
      replacedFile: replaceUrl || '',
    },
  };

  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;

    // If this is a replacement, try to delete the old file
    let oldFileDeleted = false;
    if (replaceUrl) {
      const oldKey = extractKeyFromUrl(replaceUrl);
      if (oldKey && oldKey.startsWith('images/')) {
        const deleteResult = await deleteImageFromS3(oldKey);
        oldFileDeleted = deleteResult.success;
      }
    }

    return {
      success: true,
      url,
      key,
      uuid,
      replaced: exists,
      oldFileDeleted,
      replacedUrl: replaceUrl || null,
    };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string | null;
    const replaceUrl = formData.get('replaceUrl') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!folder) {
      return NextResponse.json(
        { error: 'Folder parameter is required' },
        { status: 400 },
      );
    }

    // Validate folder name to prevent directory traversal
    const validFolders = [
      'tokens',
      'teams',
      'flywheels',
      'technical-analysis',
      'general',
      'ads',
    ];
    if (!validFolders.includes(folder)) {
      return NextResponse.json(
        { error: `Invalid folder. Must be one of: ${validFolders.join(', ')}` },
        { status: 400 },
      );
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { url, key, uuid, replaced, oldFileDeleted, replacedUrl } =
      await uploadImageToS3(
        fileBuffer,
        folder,
        file.type,
        file.name,
        replaceUrl || undefined,
      );

    return NextResponse.json({
      success: true,
      url,
      key,
      uuid,
      folder,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      replaced,
      oldFileDeleted,
      replacedUrl,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Image upload API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
