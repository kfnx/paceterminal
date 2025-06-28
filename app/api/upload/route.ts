import { NextRequest, NextResponse } from 'next/server';
import {
  // ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Configuration constants
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

// Check for required environment variables
if (
  !process.env.AWS_S3_BUCKET_NAME ||
  !process.env.AWS_S3_REGION ||
  !process.env.AWS_ACCESS_KEY_ID ||
  !process.env.AWS_SECRET_ACCESS_KEY
) {
  // In a real app, you'd want to log this error and handle it gracefully
  // For this example, we'll throw an error to make the misconfiguration obvious.
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
 * Uploads a file to an S3 bucket.
 * @param file - The file buffer to upload.
 * @param fileName - The name of the file to create in S3.
 * @param contentType - The MIME type of the file.
 * @returns An object with the success status and the URL of the uploaded file.
 */
async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
) {
  const bucketName = process.env.AWS_S3_BUCKET_NAME;
  const region = process.env.AWS_S3_REGION;

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // 1 year cache
    // ACL: ObjectCannedACL.public_read, // Make object publicly readable
  };

  const command = new PutObjectCommand(params);
  try {
    await s3Client.send(command);
    const url = `https://${bucketName}.s3.${region}.amazonaws.com/${fileName}`;
    return { success: true, url };
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload file to S3.');
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Create a more organized file structure
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    // Sanitize the file name
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    const uniqueFileName = `uploads/${year}/${month}/${day}/${uuidv4()}-${sanitizedFileName}`;

    const { url } = await uploadFileToS3(fileBuffer, uniqueFileName, file.type);

    return NextResponse.json({
      success: true,
      url,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Upload API error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { error: `Upload failed: ${errorMessage}` },
      { status: 500 },
    );
  }
}
