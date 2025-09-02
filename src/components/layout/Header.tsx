'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  User, 
  LogOut, 
  Settings
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { SignInModal } from '@/components/ui/SignInModal';
import { cn } from '@/utils/cn';
import { DesktopNavigation, MobileNavigation } from './navigation';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('#');
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      // Detect active section based on scroll position
      const sections = ['#', '#breaking-news', '#business-finance', '#technology', '#sports', '#lifestyle', '#featured-videos'];
      const headerHeight = 80;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section === '#') {
          if (window.scrollY < 100) {
            setActiveSection('#');
            break;
          }
        } else {
          const element = document.querySelector(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.pageYOffset - headerHeight;
            if (window.pageYOffset >= elementTop - 100) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.querySelector(href);
      if (element) {
        const headerHeight = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsMenuOpen(false); // Close mobile menu after clicking
  };



  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <motion.header
      id="navigation"
      role="banner"
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'backdrop-blur-md shadow-xl border-b'
          : 'shadow-md border-b'
      )}
      style={{
        backgroundColor: isScrolled ? 'rgba(var(--background-rgb), 0.95)' : 'var(--background)',
        borderColor: 'var(--border)'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
  
      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                Veritas Bulletin
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <DesktopNavigation 
            onNavigationClick={handleSmoothScroll}
            activeSection={activeSection}
          />

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Link href="/search">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-deep-blue dark:hover:text-deep-blue hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle variant="icon" size="md" />

            {/* User Menu */}
            {session ? (
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-deep-blue dark:hover:text-deep-blue hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-medium">
                    {session?.user?.name || 'User'}
                  </span>
                </motion.button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {session?.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-lg"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsSignInModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-2 text-gray-600 dark:text-gray-400 hover:text-deep-blue dark:hover:text-deep-blue hover:bg-gray-100 dark:hover:bg-gray-800 border-2 border-transparent hover:border-deep-blue dark:hover:border-deep-blue transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigation 
           isOpen={isMenuOpen}
           onNavigationClick={handleSmoothScroll}
           activeSection={activeSection}
           onSignInClick={() => setIsSignInModalOpen(true)}
         />
      </nav>
      
      {/* Sign In Modal */}
      <SignInModal 
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={() => {
          setIsSignInModalOpen(false);
          // Optionally show a success toast or refresh the page
          window.location.reload();
        }}
      />
    </motion.header>
  );
}