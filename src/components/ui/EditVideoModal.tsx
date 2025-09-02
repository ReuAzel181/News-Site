'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/Modal';

interface Video {
  id: string;
  videoId: string;
  title: string;
  description: string;
  channel: string;
  views: string;
  publishedAt: Date;
  thumbnail: string;
  duration: string;
}

interface EditVideoModalProps {
  isOpen: boolean;
  video: Video;
  onClose: () => void;
  onSave: (video: Video) => void;
}

export function EditVideoModal({ isOpen, video, onClose, onSave }: EditVideoModalProps) {
  const [draft, setDraft] = useState<Video>(video);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    setDraft(video);
    setErrors({});
  }, [video]);

  const handleChange = (field: keyof Video, value: Video[keyof Video]) => {
    setDraft(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!draft.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!draft.videoId.trim()) {
      newErrors.videoId = 'YouTube video URL or ID is required';
    } else if (!isValidYouTubeId(draft.videoId)) {
      newErrors.videoId = 'Please enter a valid YouTube video URL or ID';
    }
    
    if (!draft.channel.trim()) {
      newErrors.channel = 'Channel name is required';
    }
    
    if (!draft.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidYouTubeId = (id: string): boolean => {
    // Check if it's a valid 11-character YouTube video ID
    return /^[a-zA-Z0-9_-]{11}$/.test(id);
  };

  const extractVideoId = (url: string): string => {
    // Extract YouTube video ID from various URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /^[a-zA-Z0-9_-]{11}$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1] || match[0];
      }
    }
    
    return url; // Return as-is if no pattern matches
  };

  const handleVideoIdChange = (value: string) => {
    const videoId = extractVideoId(value);
    handleChange('videoId', videoId);
  };

  const handleSave = () => {
    setIsValidating(true);
    if (validateForm()) {
      onSave({ ...draft });
      onClose();
    }
    setIsValidating(false);
  };

  const formatViewCount = (views: string): string => {
    // Auto-format view counts
    const num = parseInt(views.replace(/[^0-9]/g, ''));
    if (isNaN(num)) return views;
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleViewsChange = (value: string) => {
    // Allow users to type freely, but suggest formatting
    handleChange('views', value);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      variant="flat"
      className="max-w-5xl"
    >
      <div className="w-full bg-white">
        {/* Enhanced Header */}
        <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Video
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Update video information and preview your changes
              </p>
            </div>
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              style={{ borderRadius: '0px' }}
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
              <label className="text-sm font-semibold text-gray-700 block">
                Video Title *
              </label>
              <input
                type="text"
                value={draft.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className={`w-full px-4 py-3 bg-white text-gray-900 border ${errors.title ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500`}
                style={{ borderRadius: '0px' }}
                placeholder="Enter a compelling video title..."
                required
              />
              {errors.title && (
                <p className="text-sm text-red-600 mt-1">{errors.title}</p>
              )}
            </div>

            {/* YouTube URL/ID Field */}
            <div className="lg:col-span-2 space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">
                YouTube Video URL or ID *
              </label>
              <input
                type="text"
                value={draft.videoId}
                onChange={(e) => handleVideoIdChange(e.target.value)}
                className={`w-full px-4 py-3 bg-white text-gray-900 border ${errors.videoId ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500`}
                style={{ borderRadius: '0px' }}
                placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ"
                required
              />
              {errors.videoId && (
                <p className="text-sm text-red-600 mt-1">{errors.videoId}</p>
              )}
              {draft.videoId && !errors.videoId && (
                <div className="text-xs text-gray-600">
                  Preview: <a 
                    href={`https://www.youtube.com/watch?v=${draft.videoId}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    https://www.youtube.com/watch?v={draft.videoId}
                  </a>
                </div>
              )}
            </div>

            {/* Channel Field */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">
                Channel Name *
              </label>
              <input
                type="text"
                value={draft.channel}
                onChange={(e) => handleChange('channel', e.target.value)}
                className={`w-full px-4 py-3 bg-white text-gray-900 border ${errors.channel ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500`}
                style={{ borderRadius: '0px' }}
                placeholder="Enter channel name..."
                required
              />
              {errors.channel && (
                <p className="text-sm text-red-600 mt-1">{errors.channel}</p>
              )}
            </div>

            {/* Views Field */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">
                View Count
              </label>
              <input
                type="text"
                value={draft.views}
                onChange={(e) => handleViewsChange(e.target.value)}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500"
                style={{ borderRadius: '0px' }}
                placeholder="e.g., 1.2M, 500K, 1,234"
              />
              <p className="text-xs text-gray-500">
                Suggested format: {formatViewCount(draft.views || '0')}
              </p>
            </div>

            {/* Published Date Field */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">
                Published Date
              </label>
              <input
                type="datetime-local"
                value={new Date(draft.publishedAt).toISOString().slice(0, 16)}
                onChange={(e) => handleChange('publishedAt', new Date(e.target.value))}
                className="w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                style={{ borderRadius: '0px' }}
              />
            </div>

            {/* Description Field */}
            <div className="lg:col-span-2 space-y-3">
              <label className="text-sm font-semibold text-gray-700 block">
                Video Description *
              </label>
              <textarea
                value={draft.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={6}
                className={`w-full px-4 py-3 bg-white text-gray-900 border ${errors.description ? 'border-red-500' : 'border-gray-300'} focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 placeholder-gray-500`}
                style={{ borderRadius: '0px' }}
                placeholder="Write a compelling description for your video..."
                required
              />
              {errors.description && (
                <p className="text-sm text-red-600 mt-1">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500">
                A good description helps viewers understand what your video is about
              </p>
            </div>
          </div>

          {/* Video Preview */}
          {draft.videoId && isValidYouTubeId(draft.videoId) && (
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-6">
                <label className="text-sm font-semibold text-gray-700 block mb-4">
                  Video Preview
                </label>
                <div className="bg-gray-50 p-6" style={{ borderRadius: '0px' }}>
                  <div className="max-w-2xl mx-auto">
                    <div className="relative w-full bg-gray-200" style={{ aspectRatio: '16/9', borderRadius: '0px' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${draft.videoId}`}
                        title={draft.title}
                        className="w-full h-full"
                        style={{ borderRadius: '0px' }}
                        allowFullScreen
                      />
                    </div>
                    <div className="mt-4 text-center">
                      <h4 className="font-semibold text-gray-900">{draft.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{draft.channel} • {draft.views} views</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Enhanced Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              <span className="font-medium">Tip:</span> Make sure your video is public on YouTube
            </div>
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                style={{ borderRadius: '0px' }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleSave}
                disabled={isValidating}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ borderRadius: '0px' }}
              >
                {isValidating ? 'Saving...' : 'Save Video'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}