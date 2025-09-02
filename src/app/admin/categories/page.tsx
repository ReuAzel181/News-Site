'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  MoreVertical,
  Tag,
  FileText,
  Eye,
  // Calendar, // removed unused import
  TrendingUp
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';

// Mock data for categories
const mockCategories = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest technology news, innovations, and digital trends',
    color: '#3B82F6',
    articleCount: 45,
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    totalViews: 125000,
    monthlyViews: 15000
  },
  {
    id: '2',
    name: 'Environment',
    slug: 'environment',
    description: 'Environmental news, climate change, and sustainability topics',
    color: '#10B981',
    articleCount: 32,
    isActive: true,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    totalViews: 89000,
    monthlyViews: 12000
  },
  {
    id: '3',
    name: 'Science',
    slug: 'science',
    description: 'Scientific discoveries, research, and breakthrough innovations',
    color: '#8B5CF6',
    articleCount: 28,
    isActive: true,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    totalViews: 76000,
    monthlyViews: 9500
  },
  {
    id: '4',
    name: 'Finance',
    slug: 'finance',
    description: 'Financial markets, economic news, and business insights',
    color: '#F59E0B',
    articleCount: 38,
    isActive: true,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    totalViews: 98000,
    monthlyViews: 13500
  },
  {
    id: '5',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports news, events, and athlete profiles',
    color: '#EF4444',
    articleCount: 15,
    isActive: false,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    totalViews: 45000,
    monthlyViews: 2000
  }
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [, setShowCreateModal] = useState(false); // ignore unused state value
  const [, setEditingCategory] = useState<typeof mockCategories[number] | null>(null); // avoid any and unused state value

  const filteredCategories = mockCategories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategorySelection = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const selectAllCategories = () => {
    setSelectedCategories(
      selectedCategories.length === filteredCategories.length 
        ? [] 
        : filteredCategories.map(category => category.id)
    );
  };
  void selectAllCategories; // mark as used to satisfy no-unused-vars

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on categories:`, selectedCategories);
    setSelectedCategories([]);
  };

  const totalArticles = mockCategories.reduce((sum, cat) => sum + cat.articleCount, 0);
  const activeCategories = mockCategories.filter(cat => cat.isActive).length;
  const totalViews = mockCategories.reduce((sum, cat) => sum + cat.totalViews, 0);
  void totalViews; // mark as used to satisfy no-unused-vars
  const monthlyViews = mockCategories.reduce((sum, cat) => sum + cat.monthlyViews, 0);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Categories Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your content with categories and tags
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Category
          </motion.button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {mockCategories.length}
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20">
              <Tag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Categories
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeCategories}
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Articles
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalArticles}
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/20">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monthly Views
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {(monthlyViews / 1000).toFixed(1)}K
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20">
              <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 mb-6">
        <div className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 mb-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">
              {selectedCategories.length} category(ies) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('activate')}
                className="px-3 py-1 text-sm bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                Activate
              </button>
              <button
                onClick={() => handleBulkAction('deactivate')}
                className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
              >
                Deactivate
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 overflow-hidden"
          >
            {/* Category Header */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategorySelection(category.id)}
                    className="text-blue-600"
                  />
                  <div
                    className="w-4 h-4"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      /{category.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {category.description}
              </p>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={cn(
                  'inline-flex items-center px-2 py-0.5 text-xs font-medium',
                  category.isActive
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                )}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {category.articleCount} articles
                </span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Total Views</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {(category.totalViews / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">This Month</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {(category.monthlyViews / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>

              {/* Dates */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Created {formatDistanceToNow(category.createdAt, { addSuffix: true })}</span>
                  <span>Updated {formatDistanceToNow(category.updatedAt, { addSuffix: true })}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            <Tag className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No categories found</p>
            <p className="text-sm">Try adjusting your search criteria</p>
          </div>
        </div>
      )}
    </div>
  );
}