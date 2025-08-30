'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/utils/cn';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: string;
  fill?: boolean;
  sizes?: string;
  quality?: number; // optional; if provided we may use later, but we won't pass to next/image to avoid warnings
  unoptimized?: boolean;
}

export function ProgressiveImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder,
  fill = false,
  sizes,
  // quality intentionally not defaulted to avoid Next.js warnings when not configured
  quality,
  unoptimized,
}: ProgressiveImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsLoading(false);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLoading(false);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    );

    const current = imgRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [priority]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const noImage = !src;
  const isLocalPreview = typeof src === 'string' && (src.startsWith('blob:') || src.startsWith('data:'));
  const isUnsplash = typeof src === 'string' && src.includes('images.unsplash.com');

  // Show placeholder only when there is no image at all
  if (noImage) {
    return (
      <div
        ref={imgRef}
        className={cn('relative flex items-center justify-center overflow-hidden bg-gray-200 dark:bg-gray-700', className)}
      >
        <div className="text-gray-400 text-center p-4">
          <svg
            className="w-8 h-8 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-xs">Image not available</p>
        </div>
      </div>
    );
  }

  // Fallback to a plain <img> when using local preview (blob/data)
  if (isLocalPreview) {
    return (
      <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
        {isLoading && (
          <div className="absolute inset-0 bg-gray-2 00 dark:bg-gray-700">
            {placeholder && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600" />
              </div>
            )}
          </div>
        )}
        <div className="relative w-full h-full">
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              width: fill ? '100%' : (width ? `${width}px` : 'auto'),
              height: fill ? '100%' : (height ? `${height}px` : 'auto'),
              objectFit: fill ? 'cover' : undefined,
              display: 'block'
            }}
          />
        </div>
      </div>
    );
  }

  // If next/image fails (e.g. remote optimization 500), fallback to native <img>
  if (hasError) {
    return (
      <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
        <div className="relative w-full h-full">
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={() => { /* keep fallback */ }}
            style={{
              width: fill ? '100%' : (width ? `${width}px` : 'auto'),
              height: fill ? '100%' : (height ? `${height}px` : 'auto'),
              objectFit: fill ? 'cover' : undefined,
              display: 'block'
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Static loading placeholder: flat (no animations) */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
          {placeholder && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600" />
            </div>
          )}
        </div>
      )}

      {/* Actual image */}
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : (width ?? 400)}
          height={fill ? undefined : (height ?? 300)}
          fill={fill}
          sizes={sizes}
          // quality intentionally omitted to avoid Next.js 16 warnings when not configured in next.config.mjs
          priority={priority}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            fill ? 'object-cover' : ''
          )}
          placeholder={placeholder ? 'blur' : 'empty'}
          blurDataURL={placeholder}
          unoptimized={unoptimized ?? isUnsplash}
        />
      </div>
    </div>
  );
}

export default ProgressiveImage;