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
  fileName: string;
  fileSize: number;
  fileType: string;
  replaced: boolean;
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
    if (!file || !tokenAddress) {
      toast.error('Please select a file and ensure token address is provided.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('tokenAddress', tokenAddress);

    try {
      const response = await fetch('/api/upload/flywheel-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadedImage(data);
      onImageUploaded(data.url);

      const message = data.replaced
        ? 'Flywheel image replaced successfully!'
        : 'Flywheel image uploaded successfully!';
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
              alt='Flywheel'
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
              ? 'Current flywheel image'
              : 'No flywheel image uploaded'}
          </div>
          {uploadedImage && (
            <div className='text-xs text-text-sub-600'>
              {uploadedImage.replaced
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
        <RiUploadLine className='mx-auto h-8 w-8 text-text-soft-400' />
        <div className='mt-2 space-y-1'>
          <p className='text-sm font-medium text-text-strong-950'>
            {isDragOver
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

      {/* File Preview */}
      {file && (
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <span className='text-2xl'>🖼️</span>
              <div>
                <p className='font-medium text-text-strong-950'>{file.name}</p>
                <p className='text-sm text-text-sub-600'>
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Button.Root
                type='button'
                size='small'
                onClick={handleUpload}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <div className='mr-2 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent' />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Button.Icon as={RiUploadLine} />
                    Upload
                  </>
                )}
              </Button.Root>
              <Button.Root
                type='button'
                size='small'
                variant='neutral'
                mode='stroke'
                onClick={clearFile}
                disabled={isUploading}
              >
                <Button.Icon as={RiCloseLine} />
              </Button.Root>
            </div>
          </div>
        </div>
      )}

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
