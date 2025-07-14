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

interface FlywheelImageUploaderProps {
  tokenAddress: string;
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

export function FlywheelImageUploader({
  tokenAddress,
  currentImageUrl,
  onImageUploaded,
  disabled = false,
}: FlywheelImageUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(
    null,
  );
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleUpload = useCallback(
    async (uploadFile: File) => {
      if (!uploadFile) {
        toast.error('Please select a file.');
        return;
      }

      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('folder', 'flywheels');

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

        // Step 2: Update the flywheel record in the database
        const updateFormData = new FormData();
        updateFormData.append('tokenAddress', tokenAddress);
        updateFormData.append('imageUrl', uploadData.url);

        const updateResponse = await fetch('/api/flywheel/update-image', {
          method: 'POST',
          body: updateFormData,
        });

        const updateResult = await updateResponse.json();

        if (!updateResponse.ok || !updateResult.success) {
          // If database update fails, we should probably delete the uploaded image
          // For now, just show an error
          throw new Error(
            updateResult.error || 'Failed to update flywheel record',
          );
        }

        setUploadedImage(uploadData);
        onImageUploaded(uploadData.url);

        const message = uploadData.oldFileDeleted
          ? 'Flywheel image replaced successfully!'
          : 'Flywheel image uploaded successfully!';
        toast.success(message);

        // Clear the file after successful upload
        setFile(null);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        toast.error(errorMessage);
        // Clear the file on error too
        setFile(null);
      } finally {
        setIsUploading(false);
      }
    },
    [currentImageUrl, tokenAddress, onImageUploaded],
  );

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        await handleUpload(selectedFile);
      }
    },
    [handleUpload],
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) {
        setFile(droppedFile);
        await handleUpload(droppedFile);
      }
    },
    [handleUpload],
  );

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
      <div className='flex w-full items-center gap-4'>
        {displayImage ? (
          <div className='relative w-full overflow-hidden rounded-lg'>
            <S3Image
              src={displayImage}
              alt='Flywheel'
              width={256}
              height={256}
              className='h-full w-full object-cover'
            />
          </div>
        ) : (
          <div className='flex h-32 w-32 shrink-0 items-center justify-center rounded-lg bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiImageLine className='size-12 text-text-sub-600' />
          </div>
        )}
      </div>
      {uploadedImage && (
        <div className='text-xs text-text-sub-600'>
          {uploadedImage.oldFileDeleted
            ? 'Replaced existing image'
            : 'New image uploaded'}
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
          isDragOver
            ? 'bg-primary-lighter border-primary-base'
            : 'border-stroke-soft-200'
        } ${disabled || isUploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <RiUploadLine className='mx-auto h-8 w-8 text-text-soft-400' />
        <div className='mt-2 space-y-1'>
          <p className='text-sm font-medium text-text-strong-950'>
            {isUploading
              ? 'Uploading...'
              : isDragOver
                ? 'Drop your flywheel image here'
                : 'Drag and drop a flywheel image here'}
          </p>
          <p className='text-xs text-text-sub-600'>
            or click to browse (JPEG, PNG, GIF, WebP up to 5MB)
          </p>
        </div>
        <input
          id='flywheel-image-upload'
          type='file'
          accept='image/jpeg,image/png,image/gif,image/webp'
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className='absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed'
        />
      </div>

      {/* Upload Success */}
      {uploadedImage && (
        <div className='space-y-4 rounded-lg border border-success-light bg-success-lighter p-4'>
          <div className='flex items-center space-x-2'>
            <RiCheckLine className='h-5 w-5 text-success-base' />
            <p className='font-medium text-success-dark'>
              Flywheel image uploaded successfully!
            </p>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center space-x-2'>
              <span className='text-sm font-medium text-text-strong-950'>
                File:
              </span>
              <span className='text-sm text-text-sub-600'>
                {uploadedImage.fileName}
              </span>
            </div>

            <div className='flex items-center space-x-2'>
              <span className='text-sm font-medium text-text-strong-950'>
                Size:
              </span>
              <span className='text-sm text-text-sub-600'>
                {formatFileSize(uploadedImage.fileSize)}
              </span>
            </div>

            <div className='flex items-center space-x-2'>
              <span className='text-sm font-medium text-text-strong-950'>
                URL:
              </span>
              <a
                href={uploadedImage.url}
                target='_blank'
                rel='noopener noreferrer'
                className='text-sm text-primary-base underline hover:text-primary-darker'
              >
                View Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
