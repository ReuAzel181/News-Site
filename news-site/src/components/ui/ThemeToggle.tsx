'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/utils/cn';

interface ThemeToggleProps {
  variant?: 'icon' | 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ThemeToggle({ 
  variant = 'icon', 
  size = 'md', 
  className 
}: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme, actualTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={cn(
        'rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse',
        size === 'sm' && 'w-8 h-8',
        size === 'md' && 'w-10 h-10',
        size === 'lg' && 'w-12 h-12'
      )} />
    );
  }

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }[size];

  const buttonSize = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3'
  }[size];

  const getThemeIcon = (themeType: string) => {
    switch (themeType) {
      case 'light':
        return <Sun className={iconSize} />;
      case 'dark':
        return <Moon className={iconSize} />;
      case 'system':
        return <Monitor className={iconSize} />;
      default:
        return <Sun className={iconSize} />;
    }
  };

  const getCurrentIcon = () => {
    if (actualTheme === 'system') {
      return <Monitor className={iconSize} />;
    }
    return theme === 'dark' ? <Sun className={iconSize} /> : <Moon className={iconSize} />;
  };

  if (variant === 'icon') {
    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleTheme}
        className={cn(
          'rounded-lg text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          buttonSize,
          className
        )}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {getCurrentIcon()}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  }

  if (variant === 'button') {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={toggleTheme}
        className={cn(
          'flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
          className
        )}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {getCurrentIcon()}
          </motion.div>
        </AnimatePresence>
        <span className="capitalize">
          {actualTheme === 'system' ? 'Auto' : theme}
        </span>
      </motion.button>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
            className
          )}
          aria-label="Theme options"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={actualTheme}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              {getThemeIcon(actualTheme || 'light')}
            </motion.div>
          </AnimatePresence>
          <span className="capitalize">
            {actualTheme === 'system' ? 'Auto' : actualTheme}
          </span>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
            >
              {['light', 'dark', 'system'].map((themeOption) => (
                <motion.button
                  key={themeOption}
                  whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                  onClick={() => {
                    setTheme(themeOption);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'flex items-center space-x-3 w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-150',
                    actualTheme === themeOption && 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                  )}
                >
                  {getThemeIcon(themeOption)}
                  <span className="capitalize">
                    {themeOption === 'system' ? 'Auto' : themeOption}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
    );
  }

  return null;
}