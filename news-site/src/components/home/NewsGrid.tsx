'use client';


import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/utils/cn';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';

// Mock data for news articles
const newsArticles = [
  {
    id: '1',
    title: 'Artificial Intelligence Revolutionizes Healthcare Diagnostics',
    excerpt: 'New AI-powered diagnostic tools are showing unprecedented accuracy in early disease detection, potentially saving millions of lives.',
    imageUrl: '/api/placeholder/400/250',
    category: 'Technology',
    author: 'Dr. Emily Watson',
    publishedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    views: 8420,
    slug: 'ai-revolutionizes-healthcare-diagnostics',
    featured: true
  },
  {
    id: '2',
    title: 'Global Renewable Energy Adoption Reaches Record High',
    excerpt: 'Countries worldwide are accelerating their transition to clean energy, with solar and wind power leading the charge.',
    imageUrl: '/api/placeholder/400/250',
    category: 'Environment',
    author: 'Mark Thompson',
    publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    views: 12150,
    slug: 'renewable-energy-adoption-record-high',
    featured: false
  },
  {
    id: '3',
    title: 'Space Tourism Industry Takes Off with Successful Missions',
    excerpt: 'Private space companies are making space travel accessible to civilians, marking a new era in space exploration.',
    imageUrl: '/api/placeholder/400/250',
    category: 'Science',
    author: 'Sarah Chen',
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    views: 9750,
    slug: 'space-tourism-industry-takes-off',
    featured: false
  },
  {
    id: '4',
    title: 'Cryptocurrency Market Shows Signs of Stabilization',
    excerpt: 'After months of volatility, digital currencies are showing more stable patterns, attracting institutional investors.',
    imageUrl: '/api/placeholder/400/250',
    category: 'Finance',
    author: 'Robert Kim',
    publishedAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
    views: 15300,
    slug: 'cryptocurrency-market-stabilization',
    featured: false
  },
  {
    id: '5',
    title: 'Revolutionary Gene Therapy Shows Promise for Rare Diseases',
    excerpt: 'Clinical trials demonstrate breakthrough results in treating previously incurable genetic conditions.',
    imageUrl: '/api/placeholder/400/250',
    category: 'Health',
    author: 'Dr. Lisa Rodriguez',
    publishedAt: new Date(Date.now() - 9 * 60 * 60 * 1000), // 9 hours ago
    views: 6890,
    slug: 'gene-therapy-rare-diseases',
    featured: false
  },
  {
    id: '6',
    title: 'Quantum Computing Breakthrough Promises Faster Processing',
    excerpt: 'Scientists achieve new milestone in quantum computing, potentially revolutionizing data processing capabilities.',
    imageUrl: '/api/placeholder/400/250',
    category: 'Technology',
    author: 'Prof. David Lee',
    publishedAt: new Date(Date.now() - 11 * 60 * 60 * 1000), // 11 hours ago
    views: 11200,
    slug: 'quantum-computing-breakthrough',
    featured: false
  }
];

const categoryColors = {
  Technology: 'bg-blue-500',
  Environment: 'bg-green-500',
  Science: 'bg-purple-500',
  Finance: 'bg-yellow-500',
  Health: 'bg-red-500',
  Politics: 'bg-indigo-500',
  Sports: 'bg-orange-500',
  Entertainment: 'bg-pink-500'
};

interface NewsCardProps {
  article: typeof newsArticles[0];
  index: number;
  featured?: boolean;
}

function NewsCard({ article, index, featured = false }: NewsCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}

      className={cn(
        'bg-white dark:bg-gray-800 border-r border-b border-gray-300 dark:border-gray-600 p-4',
        featured && 'md:col-span-2 lg:col-span-2'
      )}
    >
      <Link 
         href={`/article/${article.slug}`} 
         className="block"
         aria-label={`Read article: ${article.title}`}
         tabIndex={0}
       >
        {/* Image */}
        <motion.div 
          className={cn(
            'relative overflow-hidden',
            featured ? 'h-64 md:h-80' : 'h-48'
          )}
        >
          <ProgressiveImage
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority={featured && index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span
              className={cn(
                'inline-block px-3 py-1 text-xs font-semibold text-white rounded-full',
                categoryColors[article.category as keyof typeof categoryColors] || 'bg-gray-500'
              )}
            >
              {article.category}
            </span>
          </div>

          {/* Featured Badge */}
          {featured && (
            <div className="absolute top-4 right-4">
              <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-full">
                Featured
              </span>
            </div>
          )}
        </motion.div>

        {/* Content */}
        <div className={cn(
          'pt-4',
          featured && 'md:pt-6'
        )}>
          {/* Title */}
          <h3 className={cn(
            'font-bold text-gray-900 dark:text-white mb-2 line-clamp-3 leading-tight',
            featured ? 'text-lg md:text-xl' : 'text-sm md:text-base'
          )}>
            {article.title}
          </h3>

          {/* Excerpt */}
          <p className={cn(
            'text-gray-600 dark:text-gray-300 mb-3 line-clamp-2 leading-snug',
            featured ? 'text-sm' : 'text-xs'
          )}>
            {article.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3 border-t border-gray-200 dark:border-gray-700 pt-2">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{article.views.toLocaleString()}</span>
            </div>
          </div>

          {/* Read More */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 font-medium">
            <span className="text-sm">Read More →</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function NewsGrid() {

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = newsArticles.filter(article => !article.featured);

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <div className="border-b-4 border-gray-900 dark:border-gray-100 pb-2 mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              Latest News
            </h2>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-3xl italic">
            Stay informed with our comprehensive coverage of breaking news, analysis, and insights from around the world.
          </p>

        </div>

        {/* News Grid */}
        {newsArticles.length > 0 ? (
          <section aria-label="News articles" role="main">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 border-t-2 border-gray-900 dark:border-gray-100">
              {/* Featured Article */}
              {featuredArticle && (
                <NewsCard
                  article={featuredArticle}
                  index={0}
                  featured={true}
                />
              )}

              {/* Regular Articles */}
              {regularArticles.map((article, index) => (
                <NewsCard
                  key={article.id}
                  article={article}
                  index={featuredArticle ? index + 1 : index}
                />
              ))}
            </div>
          </section>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 text-gray-400">📰</div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                No articles available at the moment.
              </p>
            </div>
          </motion.div>
        )}

        {/* Load More Button */}
        <div className="text-center mt-16 pt-8 border-t border-gray-300 dark:border-gray-600">
          <button className="inline-flex items-center px-6 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium text-sm uppercase tracking-wider">
            Load More Articles
          </button>
        </div>
      </div>
    </section>
  );
}