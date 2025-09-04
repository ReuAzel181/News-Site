'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  BarChart3,
  Menu,
  X,
  LogOut,
  Home,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { cn } from '@/utils/cn';

interface StatItem {
  name: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string; size?: number }>;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, badge: null },
  { name: 'Articles', href: '/admin/articles', icon: FileText, badge: null },
  { name: 'Categories', href: '/admin/categories', icon: BarChart3, badge: null },
  { name: 'Users', href: '/admin/users', icon: Users, badge: null },
  { name: 'Settings', href: '/admin/settings', icon: Settings, badge: null },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [stats, setStats] = useState<StatItem[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // Fetch admin statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    if (session?.user?.role === 'ADMIN') {
      fetchStats();
    }
  }, [session]);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user?.role !== 'ADMIN') {
      router.push('/auth/signin');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session || session.user?.role !== 'ADMIN') {
    return null;
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 dark:border-gray-700',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white bg-opacity-20 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <p className="text-xs text-blue-100">News Management</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-white hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Stats */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Quick Overview
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {statsLoading ? (
              <div className="col-span-2 text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
              </div>
            ) : (
              stats.slice(0, 4).map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.name}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className={cn(
                    'text-xs font-medium',
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-500'
                  )}>
                    {stat.change}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    setCurrentPath(item.href);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    'group flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                  )}
                >
                  <div className="flex items-center">
                    <Icon
                      className={cn(
                        'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                      )}
                    />
                    {item.name}
                  </div>
                  {item.badge && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 dark:bg-red-900 dark:text-red-300">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-1">
              <Link
                href="/"
                className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
              >
                <Home className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                Back to Site
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full group flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        {/* User info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {session.user?.email?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {session.user?.email}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white lg:hidden">
              Admin Panel
            </h1>
            
            {/* Desktop header content */}
            <div className="hidden lg:flex lg:flex-1 lg:gap-x-4">
              {/* Search Bar */}
              <div className="relative flex flex-1 max-w-md">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search articles, users..."
                  className="block w-full border-0 py-1.5 pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-gray-50 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 rounded-md"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-x-3">
              {/* Search - Mobile only */}
              <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors lg:hidden">
                <Search className="w-5 h-5" />
              </button>
              {/* Notifications */}
              <button className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>
              {/* Profile */}
              <div className="hidden lg:flex lg:items-center lg:gap-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {session?.user?.name || session?.user?.email || 'Admin'}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Administrator
                  </div>
                </div>
                <button className="flex items-center gap-x-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-md">
                  <div className="h-8 w-8 bg-blue-600 text-white flex items-center justify-center font-semibold text-sm rounded-full">
                    {session?.user?.name?.charAt(0) || session?.user?.email?.[0]?.toUpperCase() || 'A'}
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>
              </div>
              {/* Mobile Profile */}
              <button className="flex items-center gap-x-2 lg:hidden">
                <div className="h-6 w-6 bg-blue-600 text-white flex items-center justify-center text-xs font-semibold rounded-full">
                  {session?.user?.email?.[0]?.toUpperCase()}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
