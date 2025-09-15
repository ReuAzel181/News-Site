'use client';

import { useEffect, useState } from 'react';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Clock, User, Eye, Share2, Bookmark, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Modal } from './Modal';
import { cn } from '@/utils/cn';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Article } from '@/types';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article | null;
  editable?: boolean; // only admins can toggle edit mode
}

const categoryColors = {
  Technology: 'bg-blue-500',
  Environment: 'bg-green-500',
  Business: 'bg-purple-500',
  Politics: 'bg-red-500',
  Sports: 'bg-orange-500',
  Entertainment: 'bg-pink-500',
};

export function ArticleModal({
  isOpen,
  onClose,
  article,
  editable = false,
}: ArticleModalProps) {
  const [draft, setDraft] = useState<Article | null>(article);
  const [content, setContent] = useState<string>('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchContent = async () => {
      if (!article) {
        setDraft(null);
        setContent('');
        setFeaturedImage(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('Article')
          .select('id, title, excerpt, content, featuredImage, categoryId, authorId, publishedAt, views, slug, published')
          .eq('id', article.id)
          .single();

        if (error) {
          console.error('Error fetching article content:', error.message);
          setError('Failed to load article content');
          setContent(article.content || article.excerpt || '');
          setFeaturedImage(article.featuredImage || null);
          setDraft(article);
        } else {
          setContent(data?.content || article.excerpt || '');
          setFeaturedImage(data?.featuredImage || article.featuredImage || null);

          const mappedArticle: Article = {
            ...article,
            ...data,
            category: article.category,
            author: article.author,
            categoryId: data.categoryId || article.categoryId,
            authorId: data.authorId || article.authorId,
            publishedAt: data.publishedAt ? new Date(data.publishedAt) : article.publishedAt,
          };
          setDraft(mappedArticle);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
        setContent(article.content || article.excerpt || '');
        setFeaturedImage(article.featuredImage || null);
        setDraft(article);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
    setIsEditing(false);
  }, [article, supabase]);

  if (!draft && !isLoading) return null;

  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading article...</p>
          </div>
        </div>
      </Modal>
    );
  }

  if (!draft) return null;

  const handleChange = (field: keyof Article, value: any) => {
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!draft) return;

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('Article')
        .update({
          title: draft.title,
          excerpt: draft.excerpt,
          content: draft.content,
          featuredImage: draft.featuredImage,
        })
        .eq('id', draft.id);

      if (error) {
        console.error('Update failed:', error.message);
        setError(`Failed to save: ${error.message}`);
      } else {
        setError(null);
        setIsEditing(false);
        setContent(draft.content || draft.excerpt || '');
      }
    } catch (err) {
      console.error('Unexpected error during save:', err);
      setError('An unexpected error occurred while saving');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="relative">
        {/* Hero Image */}
        {featuredImage && !isEditing && (
          <div className="relative" style={{ aspectRatio: '16/9' }}>
            <ProgressiveImage
              src={featuredImage}
              alt={draft.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute top-4 left-4">
              <span
                className={cn(
                  'inline-block px-3 py-1 text-xs font-semibold text-white',
                  categoryColors[draft.category?.name as keyof typeof categoryColors] || 'bg-gray-500'
                )}
              >
                {draft.category?.name}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 md:p-8">
          {!isEditing ? (
            <>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {draft.title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{draft.author?.name || 'Staff Writer'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    {draft.publishedAt
                      ? formatDistanceToNow(new Date(draft.publishedAt), { addSuffix: true })
                      : 'Not published'}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{draft.views?.toLocaleString()} views</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 mb-6">
                <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
                  <Bookmark className="w-4 h-4" />
                  <span>Save</span>
                </button>
                {editable && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="ml-auto flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors duration-200"
                    disabled={isLoading}
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Article</span>
                  </button>
                )}
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300">
                  {error}
                </div>
              )}

              {/* Article Content */}
              <div
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </>
          ) : (
            <>
              {/* Editable Fields */}
              <div className="space-y-4 mb-6">
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                />
                <textarea
                  value={draft.excerpt || ''}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border rounded"
                />
                <textarea
                  value={draft.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2 border rounded"
                />
                <input
                  type="url"
                  value={draft.featuredImage || ''}
                  onChange={(e) => handleChange('featuredImage', e.target.value)}
                  className="w-full px-4 py-2 border rounded"
                  placeholder="https://example.com/image.jpg"
                />

                {/* Save / Cancel */}
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    )}
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setError(null);
                      setDraft(article); // Reset to original
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
