'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import Image from 'next/image';
import {
  RiCheckLine,
  RiCloseLine,
  RiImageLine,
  RiUploadLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import * as Button from '@/components/ui/button';

interface AdImageUploaderProps {
  position: 'left' | 'right';
  currentImageUrl?: string;
  currentTargetUrl?: string;
  onImageUploaded: (imageUrl: string) => void;
  onTargetUrlChanged: (targetUrl: string) => void;
  onImageRemoved?: () => void;
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

export function AdImageUploader({
  position,
  currentImageUrl,
  currentTargetUrl,
  onImageUploaded,
  onTargetUrlChanged,
  onImageRemoved,
  disabled = false,
}: AdImageUploaderProps) {
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
      formData.append('folder', 'ads');

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
          ? 'Ad image replaced successfully!'
          : 'Ad image uploaded successfully!';
        toast.success(message);

        // Upload successful
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        toast.error(errorMessage);
        // Error occurred
      } finally {
        setIsUploading(false);
      }
    },
    [currentImageUrl, onImageUploaded],
  );

  const handleFileChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
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
        await handleUpload(droppedFile);
      }
    },
    [handleUpload],
  );

  const handleRemoveImage = useCallback(async () => {
    if (currentImageUrl && onImageRemoved) {
      try {
        const response = await fetch('/api/image-delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: currentImageUrl }),
        });

        if (response.ok) {
          onImageRemoved();
          setUploadedImage(null);
          toast.success('Ad image removed successfully!');
        } else {
          throw new Error('Failed to remove image');
        }
      } catch (err) {
        toast.error('Failed to remove image');
      }
    }
  }, [currentImageUrl, onImageRemoved]);

  const displayImage = uploadedImage?.url || currentImageUrl;

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h3 className='text-sm font-medium capitalize text-text-strong-950'>
          {position} Side Ad
        </h3>
        {displayImage && onImageRemoved && (
          <Button.Root
            size='xsmall'
            variant='neutral'
            mode='stroke'
            onClick={handleRemoveImage}
            disabled={disabled}
          >
            <Button.Icon as={RiCloseLine} />
            Remove
          </Button.Root>
        )}
      </div>

      {/* Current/Uploaded Image Display */}
      {displayImage ? (
        <div className='relative mx-auto h-[640px] w-[200px] overflow-hidden rounded-lg border border-stroke-soft-200'>
          <Image
            src={displayImage}
            alt={`${position} side ad`}
            width={200}
            height={650}
          />
          {uploadedImage && (
            <div className='text-xs absolute bottom-2 left-2 rounded bg-success-base px-2 py-1 text-white'>
              {uploadedImage.oldFileDeleted ? 'Replaced' : 'New'}
            </div>
          )}
        </div>
      ) : (
        <div className='mx-auto flex h-[650px] w-[200px] items-center justify-center rounded-lg border-2 border-dashed border-stroke-soft-200 bg-bg-weak-50'>
          <div className='text-center'>
            <RiImageLine className='mx-auto h-12 w-12 text-text-sub-600' />
            <p className='text-sm mt-2 text-text-sub-600'>No ad image</p>
          </div>
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
                ? 'Drop your ad image here'
                : displayImage
                  ? 'Replace ad image'
                  : 'Upload ad image'}
          </p>
          <p className='text-xs text-text-sub-600'>
            Drag and drop or click to browse (JPEG, PNG, GIF, WebP up to 5MB)
          </p>
        </div>
        <input
          id={`ad-upload-${position}`}
          type='file'
          accept='image/jpeg,image/png,image/gif,image/webp'
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className='absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed'
        />
      </div>

      {/* Target URL Input */}
      <div className='space-y-2'>
        <label
          htmlFor={`target-url-${position}`}
          className='text-sm block font-medium text-text-strong-950'
        >
          Target URL
        </label>
        <input
          id={`target-url-${position}`}
          type='url'
          value={currentTargetUrl || ''}
          onChange={(e) => onTargetUrlChanged(e.target.value)}
          placeholder='https://example.com'
          disabled={disabled}
          className='w-full rounded-md border border-stroke-soft-200 px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-base disabled:cursor-not-allowed disabled:bg-bg-weak-50'
        />
        <p className='text-xs text-text-sub-600'>
          URL to open when the ad is clicked
        </p>
      </div>

      {/* Upload Success */}
      {uploadedImage && (
        <div className='flex items-center space-x-2 rounded-lg border border-success-light bg-success-lighter p-3'>
          <RiCheckLine className='h-4 w-4 text-success-base' />
          <p className='text-sm text-success-dark'>
            Ad image {uploadedImage.oldFileDeleted ? 'replaced' : 'uploaded'}{' '}
            successfully!
          </p>
        </div>
      )}
    </div>
  );
}
