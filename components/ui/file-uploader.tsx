'use client';

import { useCallback, useState, type ChangeEvent, type FormEvent } from 'react';
import {
  RiCheckLine,
  RiCloseLine,
  RiErrorWarningLine,
  RiUploadLine,
} from '@remixicon/react';

import { Root as Button } from './button';
import { Input } from './input';
import { S3Image } from './s3-image';

interface UploadedFile {
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
}

export function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
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
      setError(null);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadedFile(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Upload failed');
      }

      setUploadedFile(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setFile(null);
    setError(null);
    setUploadedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return '🖼️';
    } else if (fileType.includes('pdf')) {
      return '📄';
    } else if (fileType.includes('word')) {
      return '📝';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return '📊';
    } else if (fileType.includes('text')) {
      return '📄';
    }
    return '📁';
  };

  const isImage = (fileType: string) => {
    return fileType.startsWith('image/');
  };

  return (
    <div className='w-full max-w-2xl rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs'>
      <div className='space-y-6'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-bold text-text-strong-950'>
            File Uploader
          </h2>
          <p className='text-text-sub-600'>
            Upload files to S3. Drag and drop or click to select.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div
            className={`relative rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
              isDragOver
                ? 'bg-primary-lighter border-primary-base'
                : 'border-stroke-soft-200'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <RiUploadLine className='mx-auto h-12 w-12 text-text-soft-400' />
            <div className='mt-4 space-y-2'>
              <p className='text-lg font-medium text-text-strong-950'>
                {isDragOver
                  ? 'Drop your file here'
                  : 'Drag and drop your file here'}
              </p>
              <p className='text-sm text-text-sub-600'>or click to browse</p>
            </div>
            <input
              id='file'
              type='file'
              onChange={handleFileChange}
              disabled={isUploading}
              className='absolute inset-0 cursor-pointer opacity-0'
            />
          </div>

          {file && (
            <div className='rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-4'>
              <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <span className='text-2xl'>{getFileIcon(file.type)}</span>
                  <div>
                    <p className='font-medium text-text-strong-950'>
                      {file.name}
                    </p>
                    <p className='text-sm text-text-sub-600'>
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  type='button'
                  onClick={clearFile}
                  disabled={isUploading}
                  className='rounded p-1 transition-colors hover:bg-bg-soft-200'
                >
                  <RiCloseLine className='h-4 w-4 text-text-sub-600' />
                </button>
              </div>
            </div>
          )}

          <Button
            type='submit'
            className='w-full'
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
                Uploading...
              </>
            ) : (
              <>
                <RiUploadLine className='mr-2 h-4 w-4' />
                Upload File
              </>
            )}
          </Button>
        </form>

        {error && (
          <div className='flex items-center space-x-2 rounded-lg border border-error-light bg-error-lighter p-4'>
            <RiErrorWarningLine className='h-5 w-5 text-error-base' />
            <p className='text-sm text-error-dark'>{error}</p>
          </div>
        )}

        {uploadedFile && (
          <div className='space-y-4 rounded-lg border border-success-light bg-success-lighter p-4'>
            <div className='flex items-center space-x-2'>
              <RiCheckLine className='h-5 w-5 text-success-base' />
              <p className='font-medium text-success-dark'>
                File uploaded successfully!
              </p>
            </div>

            {isImage(uploadedFile.fileType) && (
              <div className='flex justify-center'>
                <S3Image
                  src={uploadedFile.url}
                  alt={uploadedFile.fileName}
                  width={300}
                  height={200}
                  className='max-w-full'
                />
              </div>
            )}

            <div className='space-y-2'>
              <div className='flex items-center space-x-2'>
                <span className='text-sm font-medium text-text-strong-950'>
                  File:
                </span>
                <span className='text-sm text-text-sub-600'>
                  {uploadedFile.fileName}
                </span>
              </div>

              <div className='flex items-center space-x-2'>
                <span className='text-sm font-medium text-text-strong-950'>
                  Size:
                </span>
                <span className='text-sm text-text-sub-600'>
                  {formatFileSize(uploadedFile.fileSize)}
                </span>
              </div>

              <div className='flex items-center space-x-2'>
                <span className='text-sm font-medium text-text-strong-950'>
                  URL:
                </span>
                <a
                  href={uploadedFile.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-sm text-primary-base underline hover:text-primary-darker'
                >
                  View File
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
