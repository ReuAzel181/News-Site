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
  }, [article]);

  useEffect(() => {
    return () => {
      if (localImageUrl) URL.revokeObjectURL(localImageUrl);
    };
  }, [localImageUrl]);

  const handleChange = (field: keyof Article, value: any) => {
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
    // Update the Modal usage to full width and enforce flat styling
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      className="rounded-none shadow-none"
    >
      <div className="w-full" style={{ backgroundColor: 'var(--card)' }}>
        {/* Header - flat */}
        <div className="px-6 py-4 flex items-center justify-between" style={{ backgroundColor: 'var(--background)' }}>
          <h3 className="text-base font-bold">Edit Article</h3>
          <button type="button" onClick={onClose} className="px-2 py-1 text-sm bg-black text-white">
            Close
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold block">Title</label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 bg-white text-black rounded-none shadow-none border-0 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold block">Image</label>
              <div className="space-y-2">
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  {draft.imageUrl ? (
                    <ProgressiveImage src={draft.imageUrl} alt={draft.title} className="w-full h-40" fill />
                  ) : (
                    <span className="text-sm text-gray-500">No image selected</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="block w-full text-sm text-gray-900 file:bg-black file:text-white file:px-3 file:py-2 file:mr-3 file:border-0 file:rounded-none"
                />
                <div className="space-y-1">
                  <label className="text-sm font-semibold block">Or Image URL</label>
                  <input
                    type="text"
                    value={draft.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    className="w-full px-3 py-2 bg-white text-black rounded-none shadow-none border-0 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold block">Excerpt</label>
              <textarea
                value={draft.excerpt || ''}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                className="w-full min-h-[70px] px-3 py-2 bg-white text-black rounded-none shadow-none border-0 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold block">Content</label>
              <textarea
                value={draft.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                className="w-full min-h-[140px] px-3 py-2 bg-white text-black rounded-none shadow-none border-0 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {(availableTags.length ? availableTags : (draft.tags || [])).map((tag) => {
                  const selected = (draft.tags || []).includes(tag);
                  return (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-2 py-1 text-xs ${selected ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                      style={{ borderRadius: 0 }}
                      aria-pressed={selected}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
              {(draft.tags && draft.tags.length > 0) && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {draft.tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 text-xs" style={{ backgroundColor: tagColor(tag) }}>
                      {tag}
                      <button type="button" className="ml-2 text-xs underline" onClick={() => handleRemoveTag(tag)}>remove</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer actions - flat */}
          <div className="pt-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-black">
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="px-4 py-2 bg-black text-white">
              Save
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}