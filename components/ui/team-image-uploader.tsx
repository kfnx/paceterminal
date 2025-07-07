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

interface TeamImageUploaderProps {
  tokenAddress: string;
  teamMemberIndex: number;
  teamMemberName?: string;
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

export function TeamImageUploader({
  tokenAddress,
  teamMemberIndex,
  teamMemberName = '',
  currentImageUrl,
  onImageUploaded,
  disabled = false,
}: TeamImageUploaderProps) {
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
    formData.append('teamMemberIndex', teamMemberIndex.toString());
    if (teamMemberName) {
      formData.append('teamMemberName', teamMemberName);
    }

    try {
      const response = await fetch('/api/upload/team-image', {
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
        ? 'Team member image replaced successfully!'
        : 'Team member image uploaded successfully!';
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
          <Avatar.Root size='64'>
            <Avatar.Image
              src={displayImage}
              alt={teamMemberName || 'Team member'}
            />
          </Avatar.Root>
        ) : (
          <div className='flex size-16 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiImageLine className='size-8 text-text-sub-600' />
          </div>
        )}

        <div className='flex flex-col gap-2'>
          <div className='text-sm text-text-sub-600'>
            {displayImage ? 'Current team member image' : 'No image uploaded'}
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
              ? 'Drop team member image here'
              : 'Drag and drop team member image here'}
          </p>
          <p className='text-xs text-text-sub-600'>
            or click to browse (JPEG, PNG, GIF, WebP up to 5MB)
          </p>
        </div>
        <input
          id={`team-image-upload-${teamMemberIndex}`}
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
              <span className='text-2xl'>👤</span>
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
        <div className='flex items-center space-x-2 rounded-lg border border-success-light bg-success-lighter p-3'>
          <RiCheckLine className='h-4 w-4 text-success-base' />
          <p className='text-sm text-success-dark'>
            Team member image {uploadedImage.replaced ? 'replaced' : 'uploaded'}{' '}
            successfully!
          </p>
        </div>
      )}
    </div>
  );
}
