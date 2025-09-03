'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Article } from '@/components/home/types';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';

interface EditArticleModalProps {
  isOpen: boolean;
  article: Article;
  onClose: () => void;
  onSave: (article: Article) => void;
  availableTags?: string[]; // optional list of predefined tags
}

export default function EditArticleModal({ isOpen, article, onClose, onSave, availableTags = [] }: EditArticleModalProps) {
  const [draft, setDraft] = useState<Article>(article);
  const [newTag, setNewTag] = useState<string>('');
  const [localImageFile, setLocalImageFile] = useState<File | null>(null);
  const [localImageUrl, setLocalImageUrl] = useState<string | null>(null);

  useEffect(() => {
    setDraft(article);
    setNewTag('');
    // cleanup previous object URL when switching articles
    if (localImageUrl) {
      URL.revokeObjectURL(localImageUrl);
      setLocalImageUrl(null);
      setLocalImageFile(null);
    }
  }, [article, localImageUrl]);

  useEffect(() => {
    return () => {
      if (localImageUrl) URL.revokeObjectURL(localImageUrl);
    };
  }, [localImageUrl]);

  const handleChange = (field: keyof Article, value: Article[keyof Article]) => {
    setDraft(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    const t = newTag.trim();
    if (!t) return;
    const existing = draft.tags || [];
    if (existing.includes(t)) {
      setNewTag('');
      return;
    }
    setDraft(prev => ({ ...prev, tags: [...existing, t] }));
    setNewTag('');
  };
  const toggleTag = (tag: string) => {
    setDraft(prev => {
      const current = prev.tags || [];
      return current.includes(tag)
        ? { ...prev, tags: current.filter(t => t !== tag) }
        : { ...prev, tags: [...current, tag] };
    });
  };

   const handleRemoveTag = (tag: string) => {
     const existing = draft.tags || [];
     setDraft(prev => ({ ...prev, tags: existing.filter(t => t !== tag) }));
   };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (localImageUrl) URL.revokeObjectURL(localImageUrl);
    const url = URL.createObjectURL(file);
    setLocalImageFile(file);
    setLocalImageUrl(url);
    setDraft(prev => ({ ...prev, imageUrl: url }));
  };

  // simple deterministic color palette for tags
  const TAG_COLORS = ['#fde68a', '#a7f3d0', '#bfdbfe', '#fecaca', '#ddd6fe', '#fbcfe8', '#c7d2fe', '#fef3c7'];
  const hashString = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return Math.abs(h);
  };
  const tagColor = (tag: string) => TAG_COLORS[hashString(tag) % TAG_COLORS.length];

  const handleSave = () => {
    // tags already in draft.tags
    onSave({ ...draft });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      variant="flat"
      className="max-w-5xl"
    >
      <div className="w-full bg-white dark:bg-gray-900">
        {/* Enhanced Header */}
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                Edit Article
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Make changes to your article content and settings
              </p>
            </div>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="px-6 py-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Title Field */}
            <div className="lg:col-span-2 space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Article Title *
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Enter a compelling article title..."
                required
              />
            </div>

            {/* Image Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Featured Image
              </label>
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="w-full h-48 bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center overflow-hidden">
                  {draft.imageUrl ? (
                    <ProgressiveImage 
                      src={draft.imageUrl} 
                      alt={draft.title} 
                      className="w-full h-full object-cover" 
                      fill 
                    />
                  ) : (
                    <div className="text-center">
                      <svg className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-gray-500 dark:text-gray-400">No image selected</span>
                    </div>
                  )}
                </div>
                
                {/* File Upload */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="block w-full text-sm text-gray-900 dark:text-gray-300 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-medium file:bg-gray-900 dark:file:bg-gray-100 file:text-white dark:file:text-gray-900 hover:file:bg-gray-800 dark:hover:file:bg-gray-200 file:transition-colors file:duration-200 file:cursor-pointer cursor-pointer"
                  />
                </div>
                
                {/* URL Input */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block">
                    Or enter image URL
                  </label>
                  <input
                    type="url"
                    value={draft.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            {/* Excerpt Field */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                Article Excerpt
              </label>
              <textarea
                value={draft.excerpt || ''}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                placeholder="Write a brief summary of your article..."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                A short description that appears in article previews
              </p>
            </div>
          </div>
          
          {/* Content Field */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
              Article Content *
            </label>
            <textarea
              value={draft.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 resize-y"
              placeholder="Write your article content here..."
              required
            />
          </div>

          {/* Tags Section */}
          <div className="space-y-4">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
              Article Tags
            </label>
            
            {/* Available Tags */}
            {availableTags.length > 0 && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Select from available tags:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const selected = (draft.tags || []).includes(tag);
                    return (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-2 text-sm font-medium transition-all duration-200 ${
                          selected 
                            ? 'bg-blue-600 text-white border-blue-600' 
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                        } border`}
                        aria-pressed={selected}
                      >
                        {tag}
                        {selected && (
                          <svg className="w-4 h-4 ml-1 inline" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            {/* Add Custom Tag */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder="Add a custom tag..."
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
                className="px-4 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Add Tag
              </button>
            </div>
            
            {/* Selected Tags */}
            {(draft.tags && draft.tags.length > 0) && (
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">Selected tags:</p>
                <div className="flex flex-wrap gap-2">
                  {draft.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 border border-gray-300 bg-gradient-to-r from-gray-50 to-gray-100"
                      style={{ backgroundColor: tagColor(tag) }}
                    >
                      {tag}
                      <button 
                        type="button" 
                        className="ml-2 text-gray-600 hover:text-gray-900 transition-colors" 
                        onClick={() => handleRemoveTag(tag)}
                        aria-label={`Remove ${tag} tag`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
        
        {/* Enhanced Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">Tip:</span> Use Ctrl+S to save quickly
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSave} 
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
              >
                Save Article
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}