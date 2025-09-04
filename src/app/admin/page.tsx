'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  MoreVertical,
  Eye,
  Calendar,
  User,
  TrendingUp,
  Newspaper
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';
// import { fetchMixedNews } from '@/services/newsService';
// import { Article } from '@/components/home/types';

interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  status: 'published' | 'draft' | 'archived';
  publishedAt: Date | null;
  views: number;
  featured: boolean;
}

// Mock data for articles (using real-like data structure)
const mockArticles = [
  {
    id: '1',
    title: 'Artificial Intelligence Revolutionizes Healthcare Diagnostics',
    category: 'Technology',
    author: 'Dr. Emily Watson',
    status: 'published' as const,
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    views: 8420,
    featured: true
  },
  {
    id: '2',
    title: 'Global Renewable Energy Adoption Reaches Record High',
    category: 'Environment',
    author: 'Mark Thompson',
    status: 'published' as const,
    publishedAt: new Date('2024-01-15T08:00:00Z'),
    views: 12150,
    featured: false
  },
  {
    id: '3',
    title: 'Space Tourism Industry Takes Off with Successful Missions',
    category: 'Science',
    author: 'Sarah Chen',
    status: 'draft' as const,
    publishedAt: null,
    views: 0,
    featured: false
  },
  {
    id: '4',
    title: 'Cryptocurrency Market Shows Signs of Stabilization',
    category: 'Finance',
    author: 'Robert Kim',
    status: 'published' as const,
    publishedAt: new Date('2024-01-15T04:00:00Z'),
    views: 15300,
    featured: false
  },
  {
    id: '5',
    title: 'Climate Change Summit Reaches Historic Agreement',
    category: 'Environment',
    author: 'Lisa Rodriguez',
    status: 'published' as const,
    publishedAt: new Date('2024-01-15T06:00:00Z'),
    views: 9876,
    featured: true
  }
];

const statusColors = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

interface StatItem {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

// Fetch statistics from API
const fetchStats = async (): Promise<StatItem[]> => {
  try {
    const response = await fetch('/api/admin/stats');
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    const data = await response.json();
    
    return [
      {
        name: 'Total Articles',
        value: data.totalArticles.toString(),
        change: data.totalArticlesChange,
        changeType: data.totalArticlesChangeType,
        icon: Newspaper
      },
      {
        name: 'Published Today',
        value: data.publishedToday.toString(),
        change: data.publishedTodayChange,
        changeType: data.publishedTodayChangeType,
        icon: Calendar
      },
      {
        name: 'Total Views',
        value: data.totalViews,
        change: data.totalViewsChange,
        changeType: data.totalViewsChangeType,
        icon: Eye
      },
      {
        name: 'Active Authors',
        value: data.activeAuthors.toString(),
        change: data.activeAuthorsChange,
        changeType: data.activeAuthorsChangeType,
        icon: User
      }
    ];
  } catch (error) {
    console.error('Error fetching stats:', error);
    // Fallback to mock data if API fails
    return [
      {
        name: 'Total Articles',
        value: '5',
        change: '+12%',
        changeType: 'positive',
        icon: Newspaper
      },
      {
        name: 'Published Today',
        value: '4',
        change: '+5%',
        changeType: 'positive',
        icon: Calendar
      },
      {
        name: 'Total Views',
        value: '45.7K',
        change: '+18%',
        changeType: 'positive',
        icon: Eye
      },
      {
        name: 'Active Authors',
        value: '5',
        change: '+2%',
        changeType: 'positive',
        icon: User
      }
    ];
  }
};

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);

  // Load articles and statistics on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setStatsLoading(true);
      
      // Load articles (simulate loading delay)
      setTimeout(() => {
        setArticles(mockArticles);
        setLoading(false);
      }, 500);
      
      // Load statistics from API
      try {
        const statsData = await fetchStats();
        setStats(statsData);
      } catch (error) {
        console.error('Failed to load statistics:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || article.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const toggleArticleSelection = (articleId: string) => {
    setSelectedArticles(prev => 
      prev.includes(articleId) 
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const selectAllArticles = () => {
    setSelectedArticles(
      selectedArticles.length === filteredArticles.length 
        ? [] 
        : filteredArticles.map(article => article.id)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold" style={{color: '#000057'}}>
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your news content and monitor performance
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              style={{ borderRadius: '0px', border: 'none', outline: 'none' }}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Article
            </motion.button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsLoading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 animate-pulse"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 mb-2 w-20"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 w-16"></div>
                  </div>
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="mt-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 w-24"></div>
                </div>
              </div>
            ))
          ) : (
            stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.name}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <TrendingUp className={cn(
                      "w-4 h-4 mr-1",
                      stat.changeType === 'positive' ? 'text-green-500' :
                      stat.changeType === 'negative' ? 'text-red-500' : 'text-gray-500'
                    )} />
                    <span className={cn(
                      "text-sm font-medium",
                      stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                      stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                    )}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      from last month
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    style={{ borderRadius: '0px' }}
                  />
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Environment">Environment</option>
                <option value="Science">Science</option>
                <option value="Finance">Finance</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Articles ({loading ? 'Loading...' : filteredArticles.length})
              </h2>
              {selectedArticles.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedArticles.length} selected
                  </span>
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedArticles.length === filteredArticles.length && filteredArticles.length > 0}
                      onChange={selectAllArticles}
                      className="border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Views
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      Loading articles...
                    </td>
                  </tr>
                ) : filteredArticles.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No articles found
                    </td>
                  </tr>
                ) : filteredArticles.map((article) => (
                  <motion.tr
                    key={article.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedArticles.includes(article.id)}
                        onChange={() => toggleArticleSelection(article.id)}
                        className="border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {article.title}
                          </div>
                          {article.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                              Featured
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {article.author}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 text-xs font-medium',
                        statusColors[article.status as keyof typeof statusColors]
                      )}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {article.publishedAt 
                        ? formatDistanceToNow(article.publishedAt, { addSuffix: true })
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {article.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}