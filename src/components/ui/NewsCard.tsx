'use client';

import React from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';

interface NewsCardProps {
  title: string;
  excerpt: string;
  category: string;
  publishedAt: Date;
  imageUrl: string;
  authorName?: string;
  onClick?: () => void;
  className?: string;
  categoryColor?: string;
}

export function NewsCard({
  title,
  excerpt,
  category,
  publishedAt,
  imageUrl,
  authorName,
  onClick,
  className,
  categoryColor = '#3B82F6'
}: NewsCardProps) {
  // Format the date as relative time (e.g., "2 hours ago")
  const timeAgo = formatDistanceToNow(new Date(publishedAt), { addSuffix: true });

  return (
    <div 
      className={cn(
        'flex flex-col w-full bg-white dark:bg-gray-900 cursor-pointer',
        className
      )}
      onClick={onClick}
      style={{ borderRadius: '0px' }} // Ensure sharp corners
    >
      {/* Image container with fixed aspect ratio */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority
        />
        
        {/* Category label - flat design */}
        <div 
          className="absolute left-0 top-0 py-1 px-3 text-white text-xs font-medium"
          style={{ backgroundColor: categoryColor, borderRadius: '0px' }}
        >
          {category}
        </div>
      </div>
      
      {/* Content area */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{excerpt}</p>
        
        {/* Footer with metadata */}
        <div className="mt-auto flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          {authorName && <span>{authorName}</span>}
          <span>{timeAgo}</span>
        </div>
      </div>
    </div>
  );
}