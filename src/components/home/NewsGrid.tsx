'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Eye, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/utils/cn';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { ArticleModal } from '@/components/ui/ArticleModal';
import {
  BreakingNewsSection,
  BusinessSection,
  SportsSection,
  LifestyleSection,
  TechnologySection,
  FeaturedVideosSection
} from './sections';
import { Article } from './types';
import { fetchMixedNews, getMockNewsData } from '@/services/newsService';

// Mock news data removed - now using dynamic data from newsService

// Category colors for news sections
const categoryColors = {
  'Breaking': 'bg-red-600',
  'Politics': 'bg-blue-600',
  'Business': 'bg-green-600',
  'Sports': 'bg-orange-600',
  'Technology': 'bg-purple-600',
  'Health': 'bg-pink-600',
  'Entertainment': 'bg-yellow-600',
  'International': 'bg-indigo-600',
  'National': 'bg-gray-600',
  'Finance': 'bg-emerald-600',
  'Legal': 'bg-slate-600',
  'Religion': 'bg-amber-600',
  'Agriculture': 'bg-lime-600',
  'Environment': 'bg-teal-600',
  'Education': 'bg-cyan-600',
  'Transportation': 'bg-violet-600',
  'Tourism': 'bg-rose-600',
  'Aviation': 'bg-sky-600',
  'Energy': 'bg-stone-600',
  'National Security': 'bg-red-700'
};

// YouTube videos for the featured videos section
// YouTube videos data
const youtubeVideos = [
  {
    id: 'video1',
    title: 'President Marcos SONA 2024 Highlights',
    description: 'Key highlights from President Ferdinand Marcos Jr.\'s 2024 State of the Nation Address covering economic recovery, infrastructure, and governance reforms.',
    videoId: 'smBAliz5iCY', // SONA 2024 highlights from ANC
    thumbnail: 'https://img.youtube.com/vi/smBAliz5iCY/hqdefault.jpg',
    duration: '15:32',
    views: '2.1M',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    channel: 'ANC 24/7'
  },
  {
    id: 'video2',
    title: 'SC declares Articles of Impeachment vs VP Sara Duterte as unconstitutional',
    description: 'Breaking news coverage of the Supreme Court\'s declaration regarding the Articles of Impeachment against Vice President Sara Duterte.',
    videoId: '_zCam-VGggA', // GMA Integrated News - SC impeachment ruling
    thumbnail: 'https://img.youtube.com/vi/_zCam-VGggA/hqdefault.jpg',
    duration: '22:45',
    views: '856K',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    channel: 'GMA Integrated News'
  },
  {
    id: 'video3',
    title: 'Iglesia ni Cristo National Rally for Peace - Full Coverage',
    description: 'Complete coverage of the massive National Rally for Peace held at Quirino Grandstand, with 1.5 million attendees expressing their stance on current political issues.',
    videoId: 'VRnpcXdDbz8', // INC National Rally for Peace 2025
    thumbnail: 'https://img.youtube.com/vi/VRnpcXdDbz8/hqdefault.jpg',
    duration: '45:18',
    views: '3.2M',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    channel: 'GMA News'
  }
];

// NewsGrid component starts here
const NewsGrid: React.FC = () => {
  // State for managing news articles
  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch news data on component mount
  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);
        const articles = await fetchMixedNews();
        setNewsArticles(articles);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError('Failed to load news. Using fallback data.');
        // Fallback to mock data if real news fails
        const mockArticles = getMockNewsData();
        setNewsArticles(mockArticles);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  const refreshNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const articles = await fetchMixedNews();
      setNewsArticles(articles);
    } catch (err) {
      console.error('Failed to refresh news:', err);
      setError('Failed to refresh news. Using fallback data.');
      const mockArticles = getMockNewsData();
      setNewsArticles(mockArticles);
    } finally {
      setLoading(false);
    }
  };

  const handleReadMore = (article: Article) => {
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading latest news...</p>
        </div>
      </div>
    );
  }

  if (error && newsArticles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={refreshNews}
            className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (newsArticles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No articles found.</p>
          <button 
            onClick={refreshNews}
            className="bg-red-600 text-white px-4 py-2 hover:bg-red-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 p-4">
            <div className="flex justify-between items-center">
              <p className="text-yellow-800">{error}</p>
              <button 
                onClick={refreshNews}
                className="bg-yellow-600 text-white px-3 py-1 text-sm hover:bg-yellow-700 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        <BreakingNewsSection articles={newsArticles} onReadMore={handleReadMore} />
        <BusinessSection articles={newsArticles} onReadMore={handleReadMore} />
        <TechnologySection articles={newsArticles} onReadMore={handleReadMore} />
        <SportsSection articles={newsArticles} onReadMore={handleReadMore} />
        <LifestyleSection articles={newsArticles} onReadMore={handleReadMore} />
        <FeaturedVideosSection videos={youtubeVideos} />

        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </div>
  );
};

export default NewsGrid;