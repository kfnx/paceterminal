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

import * as Avatar from '@/components/ui/avatar';
import * as Button from '@/components/ui/button';
import { S3Image } from '@/components/ui/s3-image';

interface ImageUploaderProps {
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

export function ImageUploader({
  tokenAddress,
  currentImageUrl,
  onImageUploaded,
  disabled = false,
}: ImageUploaderProps) {
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

  const handleUpload = useCallback(async (uploadFile: File) => {
    if (!uploadFile) {
      toast.error('Please select a file.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', uploadFile);
    formData.append('folder', 'tokens');
    
    // If there's a current image, add it as replaceUrl for automatic replacement
    if (currentImageUrl) {
      formData.append('replaceUrl', currentImageUrl);
    }

    try {
      const response = await fetch('/api/image-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadedImage(data);
      onImageUploaded(data.url);

      const message = data.oldFileDeleted
        ? 'Image replaced successfully!'
        : 'Image uploaded successfully!';
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
  }, [currentImageUrl, onImageUploaded]);

  const handleFileChange = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      await handleUpload(selectedFile);
    }
  }, [handleUpload]);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      await handleUpload(droppedFile);
    }
  }, [handleUpload]);

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
          <Avatar.Root size='64'>
            <Avatar.Image src={displayImage} />
          </Avatar.Root>
        ) : (
          <div className='flex size-16 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiImageLine className='size-8 text-text-sub-600' />
          </div>
        )}

        <div className='flex flex-col gap-2'>
          <div className='text-sm text-text-sub-600'>
            {displayImage ? 'Current image' : 'No image uploaded'}
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
              ? 'Drop your image here'
              : 'Drag and drop an image here'}
          </p>
          <p className='text-xs text-text-sub-600'>
            or click to browse (JPEG, PNG, GIF, WebP up to 5MB)
          </p>
        </div>
        <input
          id='image-upload'
          type='file'
          accept='image/jpeg,image/png,image/gif,image/webp'
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className='absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed'
        />
      </div>

      {/* Upload Success */}
      {uploadedImage && (
        <div className='flex items-center space-x-2 rounded-lg border border-success-light bg-success-lighter p-3'>
          <RiCheckLine className='h-4 w-4 text-success-base' />
          <p className='text-sm text-success-dark'>
            Image {uploadedImage.oldFileDeleted ? 'replaced' : 'uploaded'}{' '}
            successfully!
          </p>
        </div>
      )}
    </div>
  );
}
