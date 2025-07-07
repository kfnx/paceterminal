'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import {
  RiCheckLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiImageLine,
  RiUploadLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import * as Button from '@/components/ui/button';
import { S3Image } from '@/components/ui/s3-image';

interface TechnicalAnalysisImageUploaderProps {
  tokenAddress: string;
  description: string;
  currentImageUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  disabled?: boolean;
}

interface UploadedImage {
  url: string;
  key: string;
  uuid: string;
  folder: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  replaced: boolean;
  oldFileDeleted: boolean;
  replacedUrl: string | null;
  uploadedAt: string;
}

export function TechnicalAnalysisImageUploader({
  tokenAddress,
  description,
  currentImageUrl,
  onImageUploaded,
  disabled = false,
}: TechnicalAnalysisImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null,
  );
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  }, []);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file.');
      return;
    }

    if (!description.trim()) {
      toast.error('Please provide a description for the technical analysis.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'technical-analysis');
    
    // If there's a current image, add it as replaceUrl for automatic replacement
    if (currentImageUrl) {
      formData.append('replaceUrl', currentImageUrl);
    }

    try {
      // Step 1: Upload the image
      const uploadResponse = await fetch('/api/image-upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.error || 'Upload failed');
      }

      // Step 2: Create the technical analysis record in the database
      const createFormData = new FormData();
      createFormData.append('tokenAddress', tokenAddress);
      createFormData.append('imageUrl', uploadData.url);
      createFormData.append('description', description.trim());

      const createResponse = await fetch('/api/technical-analysis/create', {
        method: 'POST',
        body: createFormData,
      });

      const createResult = await createResponse.json();

      if (!createResponse.ok || !createResult.success) {
        // If database creation fails, we should probably delete the uploaded image
        throw new Error(createResult.error || 'Failed to create technical analysis record');
      }

      setUploadedImage(uploadData);
      onImageUploaded(uploadData.url);

      const message = uploadData.oldFileDeleted
        ? 'Technical analysis image replaced successfully!'
        : 'Technical analysis image uploaded successfully!';
      toast.success(message);

      // Clear the file after successful upload
      setFile(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setUploadedImage(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const displayImage = uploadedImage?.url || currentImageUrl;

  return (
    <div className='space-y-4'>
      {/* Current/Uploaded Image Display */}
      <div className='flex items-center gap-4'>
        {displayImage ? (
          <div className='relative h-32 w-32 overflow-hidden rounded-lg'>
            <S3Image
              src={displayImage}
              alt='Technical Analysis'
              width={128}
              height={128}
              className='h-full w-full object-cover'
            />
          </div>
        ) : (
          <div className='flex h-32 w-32 shrink-0 items-center justify-center rounded-lg bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiImageLine className='size-12 text-text-sub-600' />
          </div>
        )}

        <div className='flex flex-col gap-2'>
          <div className='text-sm text-text-sub-600'>
            {displayImage
              ? 'Current technical analysis image'
              : 'No technical analysis image uploaded'}
          </div>
          {uploadedImage && (
            <div className='text-xs text-text-sub-600'>
              {uploadedImage.oldFileDeleted
                ? 'Replaced existing image'
                : 'New image uploaded'}
            </div>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragOver
            ? 'bg-primary-lighter border-primary-base'
            : 'border-stroke-soft-200'
        } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type='file'
          id='technical-analysis-image-upload'
          className='absolute inset-0 cursor-pointer opacity-0'
          onChange={handleFileChange}
          accept='image/*'
          disabled={disabled || isUploading}
        />

        <div className='flex flex-col items-center gap-2'>
          <RiImageLine className='size-8 text-text-sub-600' />
          <div className='text-sm font-medium text-text-strong-950'>
            Click to upload or drag and drop
          </div>
          <div className='text-xs text-text-sub-600'>
            PNG, JPG, GIF up to 5MB
          </div>
        </div>
      </div>

      {/* File Preview */}
      {file && (
        <div className='bg-bg-soft-100 flex items-center justify-between rounded-lg p-3'>
          <div className='flex items-center gap-3'>
            <RiImageLine className='size-5 text-text-sub-600' />
            <div>
              <div className='text-sm font-medium text-text-strong-950'>
                {file.name}
              </div>
              <div className='text-xs text-text-sub-600'>
                {formatFileSize(file.size)}
              </div>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button.Root
              size='xsmall'
              variant='neutral'
              mode='stroke'
              onClick={clearFile}
              disabled={isUploading}
            >
              <Button.Icon as={RiCloseLine} />
            </Button.Root>
            <Button.Root
              size='xsmall'
              onClick={handleUpload}
              disabled={isUploading}
            >
              <Button.Icon as={isUploading ? undefined : RiUploadLine} />
              {isUploading ? 'Uploading...' : 'Upload'}
            </Button.Root>
          </div>
        </div>
      )}

      {/* Success State */}
      {uploadedImage && (
        <div className='flex items-center gap-3 rounded-lg bg-green-50 p-3'>
          <RiCheckLine className='size-5 text-green-600' />
          <div className='flex-1'>
            <div className='text-sm font-medium text-green-900'>
              Technical Analysis Image Uploaded Successfully
            </div>
            <div className='text-xs text-green-700'>
              {uploadedImage.fileName} •{' '}
              {formatFileSize(uploadedImage.fileSize)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
