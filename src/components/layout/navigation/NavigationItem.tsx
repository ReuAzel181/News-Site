'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { NavItem } from './navigationConfig';
import { cn } from '@/utils/cn';

interface NavigationItemProps {
  item: NavItem;
  index?: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  isActive?: boolean;
  variant?: 'desktop' | 'mobile';
  className?: string;
}

export function NavigationItem({ 
  item, 
  index = 0, 
  onClick, 
  isActive = false, 
  variant = 'desktop',
  className 
}: NavigationItemProps) {
  const baseClasses = {
    desktop: "px-2 py-3 text-xs font-normal text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ease-in-out focus:outline-none cursor-pointer relative",
    mobile: "flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ease-in-out cursor-pointer relative"
  };

  const activeClasses = {
    desktop: "text-blue-600 dark:text-blue-400 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600 dark:after:bg-blue-400 after:rounded-full",
    mobile: "text-blue-600 dark:text-blue-400 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-600 dark:before:bg-blue-400 before:rounded-r-full"
  };

  if (variant === 'desktop') {
    return (
      <motion.div
        key={`nav-${item.href}-${index}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3, ease: "easeOut" }}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        <a
          href={item.href}
          role="menuitem"
          onClick={(e) => {
            e.preventDefault();
            onClick?.(e, item.href);
          }}
          className={cn(
            baseClasses.desktop,
            isActive && activeClasses.desktop,
            className
          )}
        >
          {item.name}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.a
      key={`mobile-nav-${item.href}`}
      href={item.href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e, item.href);
      }}
      className={cn(
        baseClasses.mobile,
        isActive && activeClasses.mobile,
        className
      )}
      whileHover={{ x: 4 }}
      whileTap={{ x: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {item.icon}
      <span>{item.name}</span>
    </motion.a>
  );
}