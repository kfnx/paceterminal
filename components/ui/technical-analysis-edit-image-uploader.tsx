'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import {
  RiCheckLine,
  RiCloseLine,
  RiImageLine,
  RiUploadLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import * as Button from '@/components/ui/button';
import { S3Image } from '@/components/ui/s3-image';

interface TechnicalAnalysisEditImageUploaderProps {
  technicalAnalysisId: string;
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

export function TechnicalAnalysisEditImageUploader({
  technicalAnalysisId,
  currentImageUrl,
  onImageUploaded,
  disabled = false,
}: TechnicalAnalysisEditImageUploaderProps) {
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
      if (!uploadFile || !technicalAnalysisId) {
        toast.error(
          'Please select a file and ensure technical analysis ID is provided.',
        );
        return;
      }

      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', uploadFile);
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

        // Step 2: Update the technical analysis record in the database
        const updateFormData = new FormData();
        updateFormData.append('id', technicalAnalysisId);
        updateFormData.append('imageUrl', uploadData.url);

        const updateResponse = await fetch(
          '/api/technical-analysis/update-image',
          {
            method: 'PUT',
            body: updateFormData,
          },
        );

        const updateResult = await updateResponse.json();

        if (!updateResponse.ok || !updateResult.success) {
          throw new Error(
            updateResult.error || 'Failed to update technical analysis record',
          );
        }

        setUploadedImage(uploadData);
        onImageUploaded(uploadData.url);

        const message = uploadData.oldFileDeleted
          ? 'Technical analysis image updated successfully!'
          : 'Technical analysis image uploaded successfully!';
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
    [currentImageUrl, technicalAnalysisId, onImageUploaded],
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
      <div className='flex flex-col gap-2'>
        <div className='text-sm text-text-sub-600'>
          {displayImage
            ? 'Current technical analysis image'
            : 'No technical analysis image uploaded'}
        </div>
        {uploadedImage && (
          <div className='text-xs text-text-sub-600'>
            {uploadedImage.oldFileDeleted
              ? 'Image updated'
              : 'New image uploaded'}
          </div>
        )}
      </div>
      {/* Current/Uploaded Image Display */}
      <div className='flex items-center gap-4'>
        {displayImage ? (
          <div className='relative w-full overflow-hidden rounded-lg'>
            <S3Image
              src={displayImage}
              alt='Technical Analysis'
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
        <input
          type='file'
          id='technical-analysis-edit-image-upload'
          className='absolute inset-0 cursor-pointer opacity-0'
          onChange={handleFileChange}
          accept='image/*'
          disabled={disabled || isUploading}
        />

        <div className='flex flex-col items-center gap-2'>
          <RiImageLine className='size-8 text-text-sub-600' />
          <div className='text-sm font-medium text-text-strong-950'>
            {isUploading
              ? 'Uploading...'
              : isDragOver
                ? 'Drop your image here'
                : 'Click to upload or drag and drop'}
          </div>
          <div className='text-xs text-text-sub-600'>
            PNG, JPG, GIF up to 5MB
          </div>
        </div>
      </div>

      {/* Success State */}
      {uploadedImage && (
        <div className='flex items-center gap-3 rounded-lg bg-green-50 p-3'>
          <RiCheckLine className='size-5 text-green-600' />
          <div className='flex-1'>
            <div className='text-sm font-medium text-green-900'>
              Technical Analysis Image Updated Successfully
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
