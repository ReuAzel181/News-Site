'use client';

import React, { useState, useEffect } from 'react';
import { ArticleModal } from '@/components/ui/ArticleModal';
import { EditVideoModal } from '@/components/ui/EditVideoModal';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import {
  BreakingNewsSection,
  BusinessSection,
  SportsSection,
  LifestyleSection,
  TechnologySection,
  FeaturedVideosSection
} from './sections';
import { Article } from '@/types';
import { fetchMixedNews, getMockNewsData } from '@/services/newsService';
import articleActions from '@/services/articleActions';

interface ContentPayload {
  breakingNews: string[];
  availableTags: string[];
  articleOverrides: Record<string, Partial<Article>>;
}

interface Video {
  id: string;
  title: string;
  description: string;
  videoId: string;
  thumbnail: string;
  duration: string;
  views: string;
  publishedAt: Date;
  channel: string;
}

// Mock YouTube videos
const youtubeVideos = [
  {
    id: 'video1',
    title: 'President Marcos SONA 2024 Highlights',
    description:
      "Key highlights from President Ferdinand Marcos Jr.'s 2024 State of the Nation Address covering economic recovery, infrastructure, and governance reforms.",
    videoId: 'smBAliz5iCY',
    thumbnail: 'https://img.youtube.com/vi/smBAliz5iCY/hqdefault.jpg',
    duration: '15:32',
    views: '2.1M',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    channel: 'ANC 24/7'
  },
  {
    id: 'video2',
    title:
      'SC declares Articles of Impeachment vs VP Sara Duterte as unconstitutional',
    description:
      "Breaking news coverage of the Supreme Court's declaration regarding the Articles of Impeachment against Vice President Sara Duterte.",
    videoId: '_zCam-VGggA',
    thumbnail: 'https://img.youtube.com/vi/_zCam-VGggA/hqdefault.jpg',
    duration: '8:45',
    views: '1.3M',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    channel: 'GMA Integrated News'
  },
  {
    id: 'video3',
    title: 'Senate hearing: PNP chief on illegal gambling crackdown',
    description:
      'Highlights from the Senate hearing where the PNP chief discussed actions against illegal gambling operations across the country.',
    videoId: 'qJZ8oQ9VxXk',
    thumbnail: 'https://img.youtube.com/vi/qJZ8oQ9VxXk/hqdefault.jpg',
    duration: '12:10',
    views: '850K',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    channel: 'Rappler'
  }
];

const NewsGrid: React.FC = () => {
  const { data: session } = useSession();

  const [newsArticles, setNewsArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [isVideoEditOpen, setIsVideoEditOpen] = useState(false);
  const [videos, setVideos] = useState(youtubeVideos);

  useEffect(() => {
    const loadNews = async () => {
      try {
        setLoading(true);
        setError(null);

        const contentRes = await fetch('/api/content', {
          cache: 'no-store'
        })
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null);

        const content: ContentPayload | null = contentRes?.data || null;
        if (content?.availableTags) setAvailableTags(content.availableTags);

        const mockData = getMockNewsData();
        const withOverrides = content?.articleOverrides
          ? mockData.map((a) => ({
              ...a,
              ...(content.articleOverrides[a.id] || {})
            }))
          : mockData;

        setNewsArticles(withOverrides);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError('Failed to load news. Using fallback data.');
        setNewsArticles(getMockNewsData());
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
      setNewsArticles(getMockNewsData());
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

  const handleEditVideo = (video: Video) => {
    if (session?.user && (session as Session).user?.role === 'ADMIN') {
      setEditingVideo(video);
      setIsVideoEditOpen(true);
    }
  };

  const handleAddVideo = (newVideo: Video) => {
    if (session?.user && (session as Session).user?.role === 'ADMIN') {
      setVideos((prev) => [...prev, newVideo]);
      setEditingVideo(newVideo);
      setIsVideoEditOpen(true);
    }
  };

  const handleSaveVideo = (updatedVideo: Video) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === updatedVideo.id ? updatedVideo : v))
    );
    setIsVideoEditOpen(false);
    setEditingVideo(null);
  };

  const handleDeleteVideo = (videoId: string) => {
    if (session?.user && (session as Session).user?.role === 'ADMIN') {
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
      if (editingVideo && editingVideo.id === videoId) {
        setIsVideoEditOpen(false);
        setEditingVideo(null);
      }
    }
  };

  const handleDelete = async (articleId: string | number) => {
    if (session?.user && (session as Session).user?.role === 'ADMIN') {
      try {
        await articleActions.deleteArticle(typeof articleId === 'string' ? parseInt(articleId) : articleId);
        setNewsArticles((prev) => prev.filter((a) => a.id !== articleId.toString()));
        if (selectedArticle && selectedArticle.id === articleId.toString()) {
          setIsModalOpen(false);
          setSelectedArticle(null);
        }
      } catch (error) {
        console.error('Failed to delete article:', error);
      }
    }
  };

  const handleEdit = (article: Article) => {
    // For now, we'll open the article modal for editing
    // This can be enhanced to open a dedicated edit modal
    setSelectedArticle(article);
    setIsModalOpen(true);
  };

  const handleUpdate = (updatedArticle: any) => {
    setNewsArticles((prev) => 
      prev.map((article) => 
        article.id === updatedArticle.id ? { ...article, ...updatedArticle } : article
      )
    );
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: 'var(--background)' }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-4 h-3 w-24"
            style={{ backgroundColor: 'var(--muted)' }}
          ></div>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Loading latest news...
          </p>
        </div>
      </div>
    );
  }

  if (error && newsArticles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshNews}
            className="bg-red-600 text-white px-4 py-2 focus:outline-none"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (newsArticles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No articles found.</p>
          <button
            onClick={refreshNews}
            className="bg-red-600 text-white px-4 py-2 focus:outline-none"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-[1200px] mx-[264px]">
        {error && (
          <div className="mb-6 p-4" style={{ backgroundColor: 'var(--muted)' }}>
            <div className="flex justify-between items-center">
              <p className="text-yellow-800">{error}</p>
              <button
                onClick={refreshNews}
                className="bg-yellow-600 text-white px-3 py-1 text-sm focus:outline-none"
              >
                Refresh
              </button>
            </div>
          </div>
        )}

        <BreakingNewsSection
          articles={newsArticles}
          onReadMore={handleReadMore}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <BusinessSection
          articles={newsArticles}
          onReadMore={handleReadMore}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <TechnologySection
          articles={newsArticles}
          onReadMore={handleReadMore}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <SportsSection
          articles={newsArticles}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <LifestyleSection
          articles={newsArticles}
          onReadMore={handleReadMore}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <FeaturedVideosSection
          videos={videos}
          isAdmin={session?.user && (session as Session).user?.role === 'ADMIN'}
          onEdit={handleEditVideo}
          onAdd={handleAddVideo}
          onDelete={handleDeleteVideo}
        />

        {selectedArticle && (
          <ArticleModal
            article={selectedArticle}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}

        {editingVideo && session?.user && (session as Session).user?.role === 'ADMIN' && (
          <EditVideoModal
            isOpen={isVideoEditOpen}
            video={editingVideo}
            onClose={() => {
              setIsVideoEditOpen(false);
              setEditingVideo(null);
            }}
            onSave={(video: Video) => handleSaveVideo(video)}
          />
        )}
      </div>
    </div>
  );
};

export default NewsGrid;
