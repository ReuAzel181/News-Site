'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Article } from '@/types';
import { cn } from '@/utils/cn';
import Image from "next/image";
import { type Breakpoint, type ItemLayout } from '@/components/home/layouts/layoutTemplates';
import ArticleManagement from '@/components/ArticleManagement';

interface GridItemProps {
  article: Article;
  onReadMore?: (article: Article) => void;
  onEdit?: (article: Article) => void;
  onEditBreaking?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
  isAdmin: boolean;
  editingLayout: boolean;
  itemLayout?: ItemLayout;
  currentBreakpoint: Breakpoint;
  index: number;
}

export function GridItem({
  article,
  onReadMore,
  onEdit,
  onEditBreaking,
  onDelete,
  isAdmin,
  editingLayout: _editingLayout,
  itemLayout,
  currentBreakpoint: _currentBreakpoint,
  index: _index
}: GridItemProps) {
  const isFeatured = itemLayout?.priority === 'featured';
  const isCompact = itemLayout?.priority === 'compact';

  const handleUpdate = (updatedArticle: any) => {
    // This would typically be handled by the parent component
    console.log('Article updated:', updatedArticle);
  };

  const handleDelete = (articleId: number) => {
    if (onDelete) {
      onDelete(articleId.toString());
    }
  };

  
  return (
    <div
      className="h-full transition-none"
      onClick={() => onReadMore?.(article)}
      id={article.id}
    >
      <div className="w-full flex justify-end mb-1" onClick={(e) => e.stopPropagation()}>
        <ArticleManagement
          article={{
            id: parseInt(article.id),
            title: article.title,
            content: article.content || '',
            excerpt: article.excerpt,
            imageUrl: article.featuredImage || '',
            category: article.category.name,
            author: article.author?.name || 'Staff Writer',
            publishedAt: new Date(article.publishedAt || Date.now()),
            featured: article.featured || false,
            breaking: article.breaking || false,
            slug: article.slug || ''
          }}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          showButtons={isAdmin}
          className=""
        />
      </div>

      <div className="space-y-3 p-5 h-full flex flex-col">
        <div
          className={cn(
            'relative w-full overflow-hidden',
            isFeatured ? 'aspect-[16/9]' : isCompact ? 'aspect-[4/3]' : 'aspect-[3/2]'
          )}
        >
          <ProgressiveImage
            src={article.featuredImage || ''}
            alt={article.title}
            className="w-full h-full object-cover transition-none"
            fill
          />
          {/* Category overlay */}
          <div className="absolute top-2 left-2 z-10">
            <span
              className={cn(
                "px-2 py-1 text-xs font-bold text-white uppercase tracking-wider",
                article.category.name === 'Technology' ? 'bg-blue-600' :
                article.category.name === 'Environment' ? 'bg-green-600' :
                article.category.name === 'Business' ? 'bg-purple-600' :
                article.category.name === 'Politics' ? 'bg-red-600' :
                article.category.name === 'Sports' ? 'bg-orange-600' :
                article.category.name === 'Entertainment' ? 'bg-pink-600' :
                'bg-gray-600'
              )}
            >
              {article.category.name}
            </span>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3
              className={cn(
                'font-bold mb-2 text-base text-gray-900 dark:text-white',
                isFeatured ? 'text-xl' : isCompact ? 'text-sm' : ''
              )}
            >
              {article.title}
            </h3>

            {!isCompact && (
              <p
                className={cn(
                  'text-gray-600 dark:text-gray-300 font-sans mb-3 line-clamp-2 leading-relaxed',
                  isFeatured ? 'text-base' : 'text-sm'
                )}
              >
                {article.excerpt}
              </p>
            )}
          </div>
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500"></div>
              <span className="font-medium">{article.author?.name || 'Staff Writer'}</span>
            </div>
            <time className="text-xs font-medium">
              {article.publishedAt ? formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true }) : 'No date'}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
}