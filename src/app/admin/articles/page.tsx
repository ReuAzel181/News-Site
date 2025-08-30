'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  // Filter, // remove unused
  Eye,
  // Calendar, // remove unused
  User,
  // Tag, // remove unused
  MoreVertical,
  Star,
  Clock,
  Globe,
  FileText
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';

// Mock data for articles
const mockArticles = [
  {
    id: '1',
    title: 'Artificial Intelligence Revolutionizes Healthcare Diagnostics',
    slug: 'ai-revolutionizes-healthcare-diagnostics',
    excerpt: 'New AI systems are transforming how doctors diagnose diseases, leading to faster and more accurate results.',
    category: 'Technology',
    tags: ['AI', 'Healthcare', 'Innovation'],
    author: 'Dr. Emily Watson',
    status: 'published',
    featured: true,
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
    views: 8420,
    likes: 234,
    comments: 45
  },
  {
    id: '2',
    title: 'Global Renewable Energy Adoption Reaches Record High',
    slug: 'global-renewable-energy-record-high',
    excerpt: 'Countries worldwide are accelerating their transition to renewable energy sources.',
    category: 'Environment',
    tags: ['Renewable Energy', 'Climate', 'Sustainability'],
    author: 'Mark Thompson',
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    views: 12150,
    likes: 567,
    comments: 89
  },
  {
    id: '3',
    title: 'Space Tourism Industry Takes Off with Successful Missions',
    slug: 'space-tourism-industry-takes-off',
    excerpt: 'Private companies are making space travel accessible to civilians.',
    category: 'Science',
    tags: ['Space', 'Tourism', 'Technology'],
    author: 'Sarah Chen',
    status: 'draft',
    featured: false,
    publishedAt: null,
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    views: 0,
    likes: 0,
    comments: 0
  },
  {
    id: '4',
    title: 'Cryptocurrency Market Shows Signs of Stabilization',
    slug: 'cryptocurrency-market-stabilization',
    excerpt: 'After months of volatility, crypto markets are showing more stable patterns.',
    category: 'Finance',
    tags: ['Cryptocurrency', 'Finance', 'Markets'],
    author: 'Robert Kim',
    status: 'published',
    featured: false,
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    views: 15300,
    likes: 423,
    comments: 156
  },
  {
    id: '5',
    title: 'Revolutionary Gene Therapy Shows Promise in Clinical Trials',
    slug: 'gene-therapy-clinical-trials-promise',
    excerpt: 'New gene therapy treatments are showing remarkable results in treating genetic disorders.',
    category: 'Science',
    tags: ['Gene Therapy', 'Medicine', 'Research'],
    author: 'Dr. Lisa Park',
    status: 'scheduled',
    featured: true,
    publishedAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
    views: 0,
    likes: 0,
    comments: 0
  }
];

const statusColors = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

const statusIcons = {
  published: Globe,
  draft: Edit,
  scheduled: Clock,
  archived: Eye
};

export default function ArticlesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
  // const [viewMode, setViewMode] = useState<'table' | 'grid'>('table'); // remove unused state

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
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

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on articles:`, selectedArticles);
    // Implement bulk actions here
    setSelectedArticles([]);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Articles Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, edit, and manage your news articles
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </motion.button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles, authors, or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Environment">Environment</option>
                <option value="Science">Science</option>
                <option value="Finance">Finance</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedArticles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              {selectedArticles.length} article(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('publish')}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-md hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                Publish
              </button>
              <button
                onClick={() => handleBulkAction('draft')}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 rounded-md hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
              >
                Draft
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Articles Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Articles ({filteredArticles.length})
            </h2>
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
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Article
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
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredArticles.map((article) => {
                const StatusIcon = statusIcons[article.status as keyof typeof statusIcons];
                
                return (
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
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {article.title}
                            </p>
                            {article.featured && (
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {article.tags.slice(0, 3).map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                            {article.tags.length > 3 && (
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                +{article.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        {article.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {article.author}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                        statusColors[article.status as keyof typeof statusColors]
                      )}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {article.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {article.publishedAt ? (
                          <>
                            <div>{formatDistanceToNow(article.publishedAt, { addSuffix: true })}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Updated {formatDistanceToNow(article.updatedAt, { addSuffix: true })}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500 dark:text-gray-400">Not published</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Eye className="w-4 h-4 text-gray-400 mr-1" />
                            <span>{article.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-gray-400 mr-1" />
                            <span>{article.likes}</span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {article.comments} comments
                        </div>
                      </div>
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
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No articles found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}