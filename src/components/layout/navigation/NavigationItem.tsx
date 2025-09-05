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
    desktop: "px-2 py-3 text-xs font-normal text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200 ease-out focus:outline-none cursor-pointer relative whitespace-nowrap",
    mobile: "flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 ease-out cursor-pointer relative"
  };

  const activeClasses = {
    desktop: "text-blue-600 dark:text-blue-400 font-semibold scale-105 -translate-y-0.5 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-blue-600 dark:after:bg-blue-400 after:transition-all after:duration-200 after:ease-out",
    mobile: "text-blue-600 dark:text-blue-400 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-blue-600 dark:before:bg-blue-400 before:transition-all before:duration-200 before:ease-out"
  };

  if (variant === 'desktop') {
    return (
      <div tabIndex={0}>
        <a
          href={item.href}
          role="menuitem"
          onClick={(e) => onClick?.(e, item.href)}
          className={cn(
            baseClasses.desktop,
            isActive && activeClasses.desktop,
            className
          )}
        >
          {item.name}
        </a>
      </div>
    );
  }

  return (
    <motion.a
      key={`mobile-nav-${item.href}`}
      href={item.href}
      onClick={(e) => onClick?.(e, item.href)}
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