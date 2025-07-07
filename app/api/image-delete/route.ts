import { NextRequest, NextResponse } from 'next/server';
import {
  DeleteObjectCommand,
  HeadObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

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
 * Deletes an image from S3
 */
async function deleteImageFromS3(key: string) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;

  // Check if file exists first
  const exists = await fileExists(key);
  if (!exists) {
    return { success: false, error: 'File not found', existed: false };
  }

  const params = {
    Bucket: bucketName,
    Key: key,
  };

  const command = new DeleteObjectCommand(params);
  try {
    await s3Client.send(command);
    return { success: true, existed: true };
  } catch (error) {
    console.error('Error deleting from S3:', error);
    throw new Error('Failed to delete file from S3.');
  }
}

/**
 * Extracts key from S3 URL
 */
function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    // Handle both s3.amazonaws.com and s3.region.amazonaws.com formats
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

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const url = searchParams.get('url');

    if (!key && !url) {
      return NextResponse.json(
        { error: 'Either key or url parameter is required' },
        { status: 400 },
      );
    }

    let fileKey = key;

    // If URL is provided instead of key, extract the key
    if (!fileKey && url) {
      fileKey = extractKeyFromUrl(url);
      if (!fileKey) {
        return NextResponse.json(
          { error: 'Invalid S3 URL format' },
          { status: 400 },
        );
      }
    }

    if (!fileKey) {
      return NextResponse.json(
        { error: 'Could not determine file key' },
        { status: 400 },
      );
    }

    // Validate that the key is in the images folder for security
    if (!fileKey.startsWith('images/')) {
      return NextResponse.json(
        { error: 'Can only delete files from images folder' },
        { status: 403 },
      );
    }

    const result = await deleteImageFromS3(fileKey);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      key: fileKey,
      existed: result.existed,
      deletedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Image delete API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Delete failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
