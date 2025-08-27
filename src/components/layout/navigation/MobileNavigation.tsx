'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationItem } from './NavigationItem';
import { navigation } from './navigationConfig';

interface MobileNavigationProps {
  isOpen: boolean;
  onNavigationClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  activeSection?: string;
}

export function MobileNavigation({ isOpen, onNavigationClick, activeSection }: MobileNavigationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden border-t border-gray-200 dark:border-gray-700"
          role="menu"
          aria-label="Mobile navigation"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <NavigationItem
                key={item.name}
                item={item}
                onClick={onNavigationClick}
                isActive={activeSection === item.href}
                variant="mobile"
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}