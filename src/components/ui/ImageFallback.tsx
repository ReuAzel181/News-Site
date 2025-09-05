'use client';

import { cn } from '@/utils/cn';

interface ImageFallbackProps {
  className?: string;
  width?: number;
  height?: number;
  text?: string;
}

export function ImageFallback({ 
  className = '', 
  width = 400, 
  height = 300, 
  text = 'Image not available' 
}: ImageFallbackProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500',
        className
      )}
      style={{ width: width || '100%', height: height || '100%' }}
    >
      <div className="text-center p-4">
        <svg
          className="w-8 h-8 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <p className="text-xs">{text}</p>
      </div>
    </div>
  );
}

export default ImageFallback;