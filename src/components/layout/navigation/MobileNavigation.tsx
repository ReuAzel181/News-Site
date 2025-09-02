'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Settings } from 'lucide-react';
import Link from 'next/link';
import { NavigationItem } from './NavigationItem';
import { navigation } from './navigationConfig';

interface MobileNavigationProps {
  isOpen: boolean;
  onNavigationClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
  activeSection?: string;
  onSignInClick?: () => void;
}

export function MobileNavigation({ isOpen, onNavigationClick, activeSection, onSignInClick }: MobileNavigationProps) {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

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
            
            {/* Authentication Section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
              {session ? (
                <div className="space-y-1">
                  <div className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                    <User className="w-4 h-4 mr-3" />
                    <span className="font-medium">{session.user?.name || session.user?.email}</span>
                  </div>
                  
                  {session?.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={onSignInClick}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors mx-2"
                >
                  <User className="w-4 h-4 mr-3" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}