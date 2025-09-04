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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    
    // Immediately update active section for instant visual feedback
    setActiveSection(href);
    
    if (href === '#') {
      // Smooth scroll to top with custom easing
      const scrollToTop = () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 0) {
          window.requestAnimationFrame(scrollToTop);
          window.scrollTo(0, currentScroll - (currentScroll / 8));
        }
      };
      scrollToTop();
    } else {
      const element = document.querySelector(href);
      if (element) {
        const headerHeight = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - headerHeight;
        
        // Enhanced smooth scrolling with custom easing
        const startPosition = window.pageYOffset;
        const distance = offsetPosition - startPosition;
        const duration = Math.min(Math.abs(distance) / 2, 800); // Dynamic duration based on distance
        let start: number | null = null;
        
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          
          // Easing function for smoother animation
          const easeInOutCubic = (t: number) => {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
          };
          
          const easedProgress = easeInOutCubic(progress);
          window.scrollTo(0, startPosition + (distance * easedProgress));
          
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        
        window.requestAnimationFrame(step);
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
          ? 'backdrop-blur-md'
          : ''
      )}
      style={{
        backgroundColor: isScrolled ? 'rgba(var(--background-rgb), 0.95)' : 'var(--background)',
        boxShadow: 'none',
        border: 'none',
        outline: 'none'
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
  
      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" role="navigation" aria-label="Main navigation">
        <div className="flex justify-between items-center h-20">
          {/* Enhanced Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="flex items-center group">
              <motion.span 
                className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                Veritas Bulletin
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <DesktopNavigation 
            onNavigationClick={handleSmoothScroll}
            activeSection={activeSection}
          />

          {/* Right side actions */}
          <div className="flex items-center space-x-6">
            {/* Search Button */}
            <Link href="/search">
              <motion.button
                whileHover={{ scale: 1.08, y: -1 }}
                whileTap={{ scale: 0.95 }}
                className="p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                style={{ borderRadius: '0px', border: 'none', outline: 'none' }}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </motion.button>
            </Link>

            {/* Theme Toggle */}
            <ThemeToggle variant="icon" size="md" />

            {/* User Menu */}
            {session ? (
              <div 
                className="relative"
                onMouseEnter={() => setIsDropdownOpen(true)}
                onMouseLeave={() => setIsDropdownOpen(false)}
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -1 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                  style={{ borderRadius: '0px', border: 'none', outline: 'none' }}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block text-sm font-medium">
                    {session?.user?.name || 'User'}
                  </span>
                </motion.button>

                {/* Dropdown Menu */}
                <div 
                  className={`absolute right-0 mt-1 w-52 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 z-50 ${
                    isDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  {session?.user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      className="flex items-center space-x-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-200 dark:border-gray-700"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsDropdownOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-5 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <motion.button
                onClick={() => setIsSignInModalOpen(true)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-all duration-200"
                style={{ borderRadius: '0px', border: 'none', outline: 'none' }}
              >
                Sign In
              </motion.button>
            )}

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className="md:hidden p-3 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 focus:outline-none"
              style={{ borderRadius: '0px', border: 'none', outline: 'none' }}
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

Header.displayName = 'Header';