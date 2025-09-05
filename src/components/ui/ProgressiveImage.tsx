'use client';

import { useState, useRef, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/utils/cn';
import { ImageFallback } from './ImageFallback';

interface ProgressiveImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  lowSrc?: string; // Optional low-quality placeholder for blur effect
  onLoad?: () => void;
  onError?: () => void;
}

export function ProgressiveImage({
  src,
  alt,
  className = '',
  priority = false,
  fill = false,
  sizes,
  lowSrc,
  unoptimized,
  onLoad: externalOnLoad,
  onError: externalOnError,
  ...restProps
}: ProgressiveImageProps) {
  // Separate width/height from other props when fill is true
  const { width, height, ...otherProps } = restProps;
  const imageProps = fill ? otherProps : restProps;
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [imageLoadAttempted, setImageLoadAttempted] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // Convert src to string for img elements
  const srcString = typeof src === 'string' ? src : (typeof src === 'object' && src !== null && 'src' in src) ? String(src.src) : '';
  
  // Fallback placeholder image (a simple gray rectangle SVG)
  const fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e5e7eb'/%3E%3Ctext x='200' y='150' text-anchor='middle' dy='0.3em' font-family='Arial, sans-serif' font-size='16' fill='%23374151'%3EImage not available%3C/text%3E%3C/svg%3E";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!mounted) return;
    
    if (priority) {
      setIsVisible(true);
      setIsLoading(true); // Reset loading state for priority images
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            setIsLoading(true); // Reset loading state when image becomes visible
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
  }, [priority, mounted]);

  const handleLoad = () => {
    setIsLoading(false);
    setShowFallback(false);
    setHasError(false);
    setImageLoadAttempted(true);
    externalOnLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    setShowFallback(true);
    setImageLoadAttempted(true);
    externalOnError?.();
  };

  const handleFallbackError = () => {
    // If even the fallback fails, just show the placeholder
    setShowFallback(false);
    setImageLoadAttempted(true);
  };

  const noImage = !src;
  const isLocalPreview = typeof src === 'string' && (src.startsWith('blob:') || src.startsWith('data:'));
  const isUnsplash = typeof src === 'string' && src.includes('images.unsplash.com');
  const isBlobUrl = typeof src === 'string' && src.startsWith('blob:');
  
  // Auto-detect if image should be unoptimized
  const shouldBeUnoptimized = unoptimized ?? (isLocalPreview || isUnsplash);
  
  // Force use of regular img tag for Unsplash URLs to avoid Next.js optimization issues
  const forceRegularImg = isUnsplash;

  // Don't render anything until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className={cn('relative overflow-hidden bg-gray-200 dark:bg-gray-700', className)}>
        <div className="w-full h-full" />
      </div>
    );
  }

  // Show placeholder only when there is no image at all
  if (noImage) {
    return (
      <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
        <ImageFallback className="w-full h-full" />
      </div>
    );
  }

  // Handle blob URLs that cause security errors
  if (isBlobUrl) {
    return (
      <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
        <ImageFallback 
          className="w-full h-full" 
          text="Preview not available"
        />
      </div>
    );
  }

  // Fallback to a plain <img> when using local preview (data URLs only, not blob) or Unsplash URLs
  if ((isLocalPreview && !isBlobUrl) || forceRegularImg) {
    return (
      <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
        {!isVisible && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
            {lowSrc && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600" />
              </div>
            )}
          </div>
        )}
        {isVisible && (
          <div className="relative w-full h-full" style={{ zIndex: 1 }}>
            {showFallback ? (
              <ImageFallback className="w-full h-full" />
            ) : (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={srcString}
                  alt={alt}
                  onLoad={handleLoad}
                  onError={handleError}
                  style={{
                    width: fill ? '100%' : (restProps.width ? `${restProps.width}px` : 'auto'),
                    height: fill ? '100%' : (restProps.height ? `${restProps.height}px` : 'auto'),
                    objectFit: fill ? 'cover' : undefined,
                    display: 'block'
                  }}
                />
                {/* Loading overlay on top of image */}
                {isLoading && !imageLoadAttempted && (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center" style={{ zIndex: 2 }}>
                    <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 animate-pulse" />
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  }

  // If next/image fails (e.g. remote optimization 500), fallback to native <img>
  if (hasError) {
    return (
      <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
        {/* Show loading placeholder when not visible yet */}
        {!isVisible && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
            {lowSrc && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600" />
              </div>
            )}
          </div>
        )}
        
        {/* Actual fallback image - only render when visible */}
         {isVisible && (
           <div className="relative w-full h-full" style={{ zIndex: 1 }}>
             {showFallback ? (
               <ImageFallback className="w-full h-full" />
             ) : (
               <>
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img
                   src={srcString}
                   alt={alt}
                   onLoad={handleLoad}
                   onError={() => setShowFallback(true)}
                   style={{
                     width: fill ? '100%' : (restProps.width ? `${restProps.width}px` : 'auto'),
                     height: fill ? '100%' : (restProps.height ? `${restProps.height}px` : 'auto'),
                     objectFit: fill ? 'cover' : undefined,
                     display: 'block'
                   }}
                 />
                 {/* Loading overlay on top of image */}
                 {isLoading && !imageLoadAttempted && (
                   <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center" style={{ zIndex: 2 }}>
                     <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 animate-pulse" />
                   </div>
                 )}
               </>
             )}
           </div>
         )}
      </div>
    );
  }

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Show loading placeholder when not visible yet */}
      {!isVisible && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
          {lowSrc && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600" />
            </div>
          )}
        </div>
      )}

      {/* Actual image - always render when visible */}
      {isVisible && (
        <div className="relative w-full h-full" style={{ zIndex: 1 }}>
          <Image
            src={src}
            alt={alt}
            fill={fill}
            sizes={sizes}
            priority={priority}
            onLoad={handleLoad}
            onError={handleError}
            className={fill ? 'object-cover' : ''}
            placeholder={lowSrc ? 'blur' : 'empty'}
            blurDataURL={lowSrc}
            unoptimized={shouldBeUnoptimized}
            {...imageProps}
          />
          {/* Loading overlay on top of image */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center" style={{ zIndex: 2 }}>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 animate-pulse" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProgressiveImage;