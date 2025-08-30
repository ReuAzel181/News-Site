'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  X,
  Calendar,
  User,
  Eye,
  Tag
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/utils/cn';
import { Header } from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Mock data for search results
const mockArticles = [
  {
    id: '1',
    title: 'Revolutionary AI Technology Transforms Healthcare Industry',
    slug: 'ai-technology-healthcare-transformation',
    excerpt: 'Artificial intelligence is revolutionizing healthcare with breakthrough diagnostic tools and treatment protocols that are saving lives worldwide.',
    content: 'The healthcare industry is experiencing a revolutionary transformation through artificial intelligence technology. Machine learning algorithms are now capable of diagnosing diseases with unprecedented accuracy, often surpassing human specialists in detecting early-stage cancers and other critical conditions.',
    category: 'Technology',
    author: 'Dr. Emily Watson',
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    views: 8420,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=250&fit=crop',
    tags: ['AI', 'Healthcare', 'Technology', 'Innovation']
  },
  {
    id: '2',
    title: 'Global Renewable Energy Adoption Reaches Record High',
    slug: 'renewable-energy-record-adoption',
    excerpt: 'Countries worldwide are accelerating their transition to renewable energy sources, setting new installation records and reducing carbon emissions.',
    content: 'The global renewable energy sector has achieved unprecedented growth this year, with solar and wind installations reaching record highs across multiple continents. This surge represents a critical step toward achieving international climate goals.',
    category: 'Environment',
    author: 'Mark Thompson',
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    views: 12150,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=250&fit=crop',
    tags: ['Renewable Energy', 'Environment', 'Climate', 'Sustainability']
  },
  {
    id: '3',
    title: 'Space Tourism Industry Takes Off with Successful Missions',
    slug: 'space-tourism-successful-missions',
    excerpt: 'Private space companies are making space tourism a reality with successful commercial flights carrying civilian passengers to the edge of space.',
    content: 'The space tourism industry has reached a new milestone with multiple successful civilian flights. Companies like SpaceX, Blue Origin, and Virgin Galactic are pioneering accessible space travel for non-astronauts.',
    category: 'Science',
    author: 'Sarah Chen',
    publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    views: 9800,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=250&fit=crop',
    tags: ['Space', 'Tourism', 'Technology', 'Innovation']
  },
  {
    id: '4',
    title: 'Cryptocurrency Market Shows Signs of Stabilization',
    slug: 'cryptocurrency-market-stabilization',
    excerpt: 'After months of volatility, the cryptocurrency market is showing signs of stabilization and maturity with institutional adoption increasing.',
    content: 'The cryptocurrency market has entered a new phase of stability after experiencing significant volatility throughout the year. Institutional investors are showing renewed confidence in digital assets.',
    category: 'Finance',
    author: 'Robert Kim',
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    views: 15300,
    featured: false,
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=250&fit=crop',
    tags: ['Cryptocurrency', 'Finance', 'Investment', 'Blockchain']
  },
  {
    id: '5',
    title: 'Breakthrough in Quantum Computing Research',
    slug: 'quantum-computing-breakthrough',
    excerpt: 'Scientists achieve new milestone in quantum computing that could revolutionize data processing and solve complex computational problems.',
    content: 'Researchers have made a significant breakthrough in quantum computing, developing new quantum processors that maintain coherence for longer periods and perform calculations exponentially faster than classical computers.',
    category: 'Technology',
    author: 'Dr. James Wilson',
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    views: 11200,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=250&fit=crop',
    tags: ['Quantum Computing', 'Technology', 'Research', 'Innovation']
  },
  {
    id: '6',
    title: 'Climate Change Summit Reaches Historic Agreement',
    slug: 'climate-change-summit-agreement',
    excerpt: 'World leaders unite at the latest climate summit to establish binding commitments for carbon neutrality and environmental protection.',
    content: 'The international climate summit has concluded with a historic agreement among 195 countries to implement binding carbon reduction targets and accelerate the transition to sustainable energy sources.',
    category: 'Environment',
    author: 'Maria Rodriguez',
    publishedAt: new Date(Date.now() - 16 * 60 * 60 * 1000),
    views: 18500,
    featured: true,
    imageUrl: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=400&h=250&fit=crop',
    tags: ['Climate Change', 'Environment', 'Politics', 'Sustainability']
  }
];

const categories = ['All', 'Technology', 'Environment', 'Science', 'Finance', 'Politics', 'Sports', 'Entertainment'];
const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'views-desc', label: 'Most Viewed' },
  { value: 'views-asc', label: 'Least Viewed' }
];

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Simulate loading state when search changes
  useEffect(() => {
    if (debouncedSearchQuery) {
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [debouncedSearchQuery]);

  // Filter and sort articles based on search criteria
  const filteredAndSortedArticles = useMemo(() => {
    let filtered = mockArticles;

    // Filter by search query
    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.author.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Sort articles
    switch (sortBy) {
      case 'date-desc':
        filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
        break;
      case 'date-asc':
        filtered.sort((a, b) => a.publishedAt.getTime() - b.publishedAt.getTime());
        break;
      case 'views-desc':
        filtered.sort((a, b) => b.views - a.views);
        break;
      case 'views-asc':
        filtered.sort((a, b) => a.views - b.views);
        break;
      case 'relevance':
      default:
        // For relevance, prioritize featured articles and then by views
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.views - a.views;
        });
        break;
    }

    return filtered;
  }, [debouncedSearchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortBy('relevance');
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'All' || sortBy !== 'relevance';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Search Articles
            </motion.h1>
            
            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative max-w-2xl"
            >
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for articles, authors, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </motion.div>
          </div>

          {/* Filters and Results Info */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex flex-wrap items-center gap-4">
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors",
                  showFilters
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                    : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </button>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="flex items-center space-x-2">
                  {selectedCategory !== 'All' && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300">
                      <Tag className="w-3 h-3 mr-1" />
                      {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className="ml-2 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span>Searching...</span>
                </div>
              ) : (
                <span>
                  {filteredAndSortedArticles.length} result{filteredAndSortedArticles.length !== 1 ? 's' : ''}
                  {debouncedSearchQuery && ` for "${debouncedSearchQuery}"`}
                </span>
              )}
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {sortOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Search Results */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 p-6 animate-pulse">
                      <div className="flex space-x-4">
                        <div className="w-24 h-24 bg-white dark:bg-gray-600"></div>
                        <div className="flex-1 space-y-3">
                          <div className="h-4 bg-white dark:bg-gray-600 w-3/4"></div>
                          <div className="h-3 bg-white dark:bg-gray-600 w-1/2"></div>
                          <div className="h-3 bg-white dark:bg-gray-600 w-full"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : filteredAndSortedArticles.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {filteredAndSortedArticles.map((article, index) => (
                    <motion.article
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 p-6"
                    >
                      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
                        {/* Article Image */}
                        <div className="md:w-48 flex-shrink-0">
                          <Link href={`/articles/${article.slug}`}>
                            <div className="relative w-full" style={{aspectRatio: '4/3'}}>
                              <Image
                                src={article.imageUrl}
                                alt={article.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </Link>
                        </div>

                        {/* Article Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <Link href={`/articles/${article.slug}`}>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2">
                                  {article.title}
                                  {article.featured && (
                                    <span className="ml-2 inline-flex items-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                      Featured
                                    </span>
                                  )}
                                </h2>
                              </Link>
                              
                              <p className="mt-2 text-gray-600 dark:text-gray-400 line-clamp-2">
                                {article.excerpt}
                              </p>

                              {/* Article Meta */}
                              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <User className="w-4 h-4" />
                                  <span>{article.author}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-4 h-4" />
                                  <span>{article.views.toLocaleString()} views</span>
                                </div>
                                <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                  {article.category}
                                </span>
                              </div>

                              {/* Tags */}
                              <div className="mt-3 flex flex-wrap gap-2">
                                {article.tags.slice(0, 3).map(tag => (
                                  <span
                                    key={tag}
                                    className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.article>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-12"
                >
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No articles found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {debouncedSearchQuery
                      ? `No results found for "${debouncedSearchQuery}". Try adjusting your search terms or filters.`
                      : 'Enter a search term to find articles.'}
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}