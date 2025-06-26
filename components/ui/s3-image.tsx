'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface S3ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackToSignedUrl?: boolean;
}

export function S3Image({
  src,
  alt,
  width,
  height,
  className,
  fallbackToSignedUrl = true,
}: S3ImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleImageError = async () => {
    if (!fallbackToSignedUrl || hasError) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    try {
      // Extract the key from the S3 URL
      const url = new URL(src);
      const key = url.pathname.substring(1); // Remove leading slash

      // Get signed URL
      const response = await fetch(
        `/api/s3-signed-url?key=${encodeURIComponent(key)}`,
      );
      if (response.ok) {
        const { signedUrl } = await response.json();
        setImageSrc(signedUrl);
        setHasError(false);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error('Failed to get signed URL:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  if (hasError) {
    return (
      <div
        className={`bg-gray-100 text-gray-500 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className='text-sm'>Image not available</span>
      </div>
    );
  }

  return (
    <div className='relative'>
      {isLoading && (
        <div
          className={`bg-gray-100 absolute inset-0 flex items-center justify-center ${className}`}
          style={{ width, height }}
        >
          <div className='border-gray-900 h-8 w-8 animate-spin rounded-full border-b-2'></div>
        </div>
      )}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{ objectFit: 'cover' }}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  );
}
