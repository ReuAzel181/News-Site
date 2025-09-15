'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import articleActions, { Article, UpdateArticleData } from '../services/articleActions';

interface ArticleManagementProps {
  article: Article;
  onUpdate?: (updatedArticle: Article) => void;
  onDelete?: (articleId: number) => void;
  showButtons?: boolean;
  className?: string;
}

interface EditModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedArticle: Article) => void;
}

interface DeleteModalProps {
  article: Article;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

// Edit Modal Component
const EditModal: React.FC<EditModalProps> = ({ article, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<UpdateArticleData>({
    title: article.title,
    content: article.content,
    excerpt: article.excerpt,
    imageUrl: article.imageUrl,
    category: article.category,
    author: article.author,
    featured: article.featured,
    breaking: article.breaking,
    slug: article.slug,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(article.imageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        imageUrl: article.imageUrl,
        category: article.category,
        author: article.author,
        featured: article.featured,
        breaking: article.breaking,
        slug: article.slug,
      });
    }
  }, [article, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data with both imageUrl and featuredImage for compatibility
      const updateData = {
        ...formData,
        featuredImage: formData.imageUrl // Map imageUrl to featuredImage for Supabase
      };
      
      const updatedArticle = await articleActions.updateArticle(article.id, updateData);
      onSave(updatedArticle);
      onClose();
    } catch (error) {
      console.error('Failed to update article:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Update image preview when imageUrl changes
    if (name === 'imageUrl') {
      setImagePreview(value || null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setFormData(prev => ({
        ...prev,
        imageUrl: result.publicUrl
      }));
      setImagePreview(result.publicUrl);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert(error instanceof Error ? error.message : 'Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      imageUrl: ''
    }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Disable body scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full h-full max-w-7xl max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center px-8 py-6 border-b border-gray-300 bg-gray-50">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Article</h2>
              <p className="text-sm text-gray-600 mt-1">Update article content and settings</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 text-2xl w-10 h-10 flex items-center justify-center bg-white hover:bg-gray-100 border border-gray-300 transition-colors"
              disabled={isLoading || isUploading}
              title="Close modal"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <form id="edit-article-form" onSubmit={handleSubmit} className="p-8 min-h-full">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Content */}
                 <div className="lg:col-span-2 space-y-8">
                   <div>
                     <label className="block text-sm font-semibold text-gray-800 mb-3">
                       Article Title
                     </label>
                     <input
                       type="text"
                       name="title"
                       value={formData.title || ''}
                       onChange={handleInputChange}
                       className="w-full p-4 border-2 border-gray-300 focus:border-gray-900 outline-none transition-colors bg-white text-gray-900"
                       placeholder="Enter article title..."
                       required
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-semibold text-gray-800 mb-3">
                       Article Excerpt
                       <span className="text-gray-500 font-normal ml-2">(Brief summary)</span>
                     </label>
                     <textarea
                       name="excerpt"
                       value={formData.excerpt || ''}
                       onChange={handleInputChange}
                       rows={4}
                       className="w-full p-4 border-2 border-gray-300 focus:border-gray-900 outline-none transition-colors resize-none bg-white text-gray-900"
                       placeholder="Enter a brief summary of the article..."
                       required
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-semibold text-gray-800 mb-3">
                       Article Content
                       <span className="text-gray-500 font-normal ml-2">(Main article body)</span>
                     </label>
                     <textarea
                       name="content"
                       value={formData.content || ''}
                       onChange={handleInputChange}
                       rows={22}
                       className="w-full p-4 border-2 border-gray-300 focus:border-gray-900 outline-none transition-colors resize-none bg-white text-gray-900 leading-relaxed"
                       placeholder="Write your article content here..."
                       required
                     />
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Slug
                       </label>
                       <input
                         type="text"
                         name="slug"
                         value={formData.slug || ''}
                         onChange={handleInputChange}
                         className="w-full p-3 border-2 border-gray-300 focus:border-gray-900 outline-none transition-colors bg-white"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">
                         Author
                       </label>
                       <input
                         type="text"
                         name="author"
                         value={formData.author || ''}
                         onChange={handleInputChange}
                         className="w-full p-3 border-2 border-gray-300 focus:border-gray-900 outline-none transition-colors bg-white"
                         required
                       />
                     </div>
                   </div>
                 </div>

                 {/* Right Column - Sidebar */}
                  <div className="space-y-8">
                    {/* Featured Image Section */}
                    <div className="bg-gray-50 p-6 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-800 mb-4">
                        Featured Image
                        <span className="text-gray-500 font-normal ml-2">(Optional)</span>
                      </label>
                      
                      {imagePreview ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-48 object-cover border-2 border-gray-300"
                            />
                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs">
                              Preview
                            </div>
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-2 left-2 bg-red-500 text-white w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                              disabled={isUploading}
                              title="Remove image"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-400 p-8 text-center bg-white">
                          <div className="mb-4">
                            <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <div className="text-gray-500 mb-4 font-medium">No image selected</div>
                          <p className="text-sm text-gray-500">
                            Upload an image or enter URL below
                          </p>
                        </div>
                      )}
                      
                      <div className="mt-3 space-y-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="w-full px-4 py-3 bg-gray-900 text-white text-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                        >
                          {isUploading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                              Uploading...
                            </span>
                          ) : (
                            'Upload Image'
                          )}
                        </button>
                        
                        <div className="text-sm text-gray-600 font-medium">
                          Or enter URL manually:
                        </div>
                        <input
                          type="url"
                          name="imageUrl"
                          value={formData.imageUrl || ''}
                          onChange={handleInputChange}
                          placeholder="https://example.com/image.jpg"
                          className="w-full p-3 text-sm border-2 border-gray-300 focus:border-gray-900 outline-none transition-colors bg-white"
                        />
                        <div className="text-xs text-gray-500">
                          Max 5MB • JPG, PNG, GIF supported
                        </div>
                      </div>
                    </div>

                    {/* Category */}
                    <div className="bg-gray-50 p-6 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-800 mb-4">
                        Category
                        <span className="text-gray-500 font-normal ml-2">(Article topic)</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category || ''}
                        onChange={handleInputChange}
                        className="w-full p-3 border-2 border-gray-300 focus:border-gray-900 outline-none transition-colors bg-white text-gray-900"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="business">📊 Business</option>
                        <option value="technology">💻 Technology</option>
                        <option value="sports">⚽ Sports</option>
                        <option value="lifestyle">🌟 Lifestyle</option>
                        <option value="politics">🏛️ Politics</option>
                        <option value="entertainment">🎬 Entertainment</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-2">
                        Choose the most relevant category for your article
                      </p>
                    </div>

                    {/* Article Options */}
                    <div className="bg-gray-50 p-6 border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-800 mb-4">
                        Article Options
                        <span className="text-gray-500 font-normal ml-2">(Special settings)</span>
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured || false}
                            onChange={handleInputChange}
                            className="mr-3 w-4 h-4 text-blue-600"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">⭐ Featured Article</span>
                            <p className="text-xs text-gray-500">Display prominently on homepage</p>
                          </div>
                        </label>
                        <label className="flex items-center p-3 bg-white border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            name="breaking"
                            checked={formData.breaking || false}
                            onChange={handleInputChange}
                            className="mr-3 w-4 h-4 text-red-600"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-700">🚨 Breaking News</span>
                            <p className="text-xs text-gray-500">Mark as urgent/breaking news</p>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center px-8 py-6 border-t border-gray-300 bg-gray-50">
              <div className="text-sm text-gray-600">
                {isLoading || isUploading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent animate-spin"></div>
                    {isUploading ? 'Uploading image...' : 'Saving changes...'}
                  </span>
                ) : (
                  'All changes are automatically validated'
                )}
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 border-2 border-gray-400 text-gray-700 hover:bg-gray-100 hover:border-gray-500 transition-all font-medium"
                  disabled={isLoading || isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="edit-article-form"
                  className="px-8 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium shadow-sm"
                  disabled={isLoading || isUploading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                      Saving...
                    </span>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

// Delete Confirmation Modal
const DeleteModal: React.FC<DeleteModalProps> = ({ article, isOpen, onClose, onConfirm }) => {
  // Disable body scrolling when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
      onClick={handleBackdropClick}
    >
      <div className="bg-white max-w-md w-full overflow-hidden shadow-lg">
        <div className="px-8 py-6 border-b border-gray-200 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Delete Article</h2>
              <p className="text-sm text-red-600 mt-1">This action cannot be undone</p>
            </div>
          </div>
        </div>
        <div className="px-8 py-6">
          <p className="text-gray-700 leading-relaxed">
            Are you sure you want to permanently delete <strong>"{article.title}"</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            All associated data including images and metadata will be removed.
          </p>
        </div>
        <div className="flex justify-end gap-4 px-8 py-6 bg-gray-50 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 text-white hover:bg-red-700 transition-colors font-medium shadow-sm"
          >
            Delete Article
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Article Management Component
const ArticleManagement: React.FC<ArticleManagementProps> = ({
  article,
  onUpdate,
  onDelete,
  showButtons = true,
  className = ''
}) => {
  const { data: session } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = session?.user?.role === 'ADMIN';

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleSave = (updatedArticle: Article) => {
    onUpdate?.(updatedArticle);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await articleActions.deleteArticle(article.id);
      onDelete?.(article.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete article:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAdmin || !showButtons) {
    return null;
  }

  return (
    <>
      <div className={`flex gap-2 ${className}`}>
        <button
          onClick={handleEdit}
          className="px-3 py-1 bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors"
          title="Edit Article"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="px-3 py-1 bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 transition-colors"
          title="Delete Article"
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>

      <EditModal
        article={article}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleSave}
      />

      <DeleteModal
        article={article}
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ArticleManagement;
export { EditModal, DeleteModal };
export type { ArticleManagementProps, EditModalProps, DeleteModalProps };