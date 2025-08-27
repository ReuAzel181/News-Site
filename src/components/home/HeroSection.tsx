'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, User, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';

// Real Philippine news articles with optimized content for better readability
const featuredArticles = [
  {
    id: '1',
    title: 'Philippines Achieves Record Renewable Energy Growth',
    excerpt: 'The Department of Energy reports unprecedented 794.34 MW of renewable energy capacity added in 2024, marking a historic milestone that surpasses the combined achievements of the previous three years as the nation accelerates its ambitious clean energy transition.',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
    category: 'Technology',
    author: 'Department of Energy',
    publishedAt: new Date('2024-01-15T10:00:00Z'),
    views: 25420,
    slug: 'philippines-record-renewable-energy-2024'
  },
  {
    id: '2',
    title: 'UAE Giant Masdar Enters Philippine Market',
    excerpt: 'International renewable energy leader Masdar has officially signed a comprehensive implementation agreement to develop an impressive 1 GW portfolio of solar, wind and advanced battery storage systems by 2030, directly supporting the Philippines ambitious Energy Transition Program goals.',
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
    category: 'Environment',
    author: 'Energy News Asia',
    publishedAt: new Date('2024-01-15T08:00:00Z'),
    views: 18750,
    slug: 'masdar-philippines-renewable-energy-deal'
  },
  {
    id: '3',
    title: 'Philippines Sets Bold Clean Energy Targets',
    excerpt: 'The government has unveiled ambitious plans to dramatically increase solar power share to 5.6% and quadruple wind power capacity to 11.7% by 2030, positioning the Philippines to potentially achieve one of the cleanest and most sustainable energy grids in Southeast Asia.',
    imageUrl: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400&q=80',
    category: 'Business',
    author: 'Mylene Capongcol',
    publishedAt: new Date('2024-01-15T06:00:00Z'),
    views: 22150,
    slug: 'philippines-solar-wind-power-goals-2030'
  }
];

const categoryColors = {
  Technology: 'bg-blue-500',
  Environment: 'bg-green-500',
  Business: 'bg-purple-500',
  Politics: 'bg-red-500',
  Sports: 'bg-orange-500',
  Entertainment: 'bg-pink-500'
};

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-advance slides with smoother timing
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
    }, 6000); // Increased to 6 seconds for better readability

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentArticle = featuredArticles[currentSlide];

  return (
    <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-gray-900 mb-4 sm:mb-8 md:mb-12 lg:mb-16 xl:mb-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            <Image
              src={currentArticle.imageUrl}
              alt={currentArticle.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-7xl mx-auto pl-0 pr-4 sm:pr-6 lg:pr-8 w-full h-full">
          <div className="relative h-full flex flex-col max-w-5xl ml-4 sm:ml-6 lg:ml-8">
            
            {/* Fixed Category Badge Section */}
            <div className="flex-shrink-0 pt-16 sm:pt-20 md:pt-24">
              <span
                className={cn(
                  'inline-block px-3 py-1 text-xs font-semibold text-white',
                  categoryColors[featuredArticles[currentSlide].category as keyof typeof categoryColors] || 'bg-gray-500'
                )}
              >
                {featuredArticles[currentSlide].category}
              </span>
            </div>

            {/* Flexible Content Section */}
            <div className="flex-1 flex flex-col justify-center py-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 60, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 0.95 }}
                  transition={{ 
                    duration: 0.8, 
                    ease: [0.25, 0.46, 0.45, 0.94],
                    opacity: { duration: 0.6 },
                    scale: { duration: 0.8 }
                  }}
                  className="space-y-4"
                >
                  {/* Title with fixed height and clamping */}
                  <div className="h-[6rem] sm:h-[7.5rem] md:h-[9rem] lg:h-[10.5rem] xl:h-[12rem] flex items-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-white leading-[1.2] sm:leading-[1.25] md:leading-[1.3] lg:leading-[1.35] xl:leading-[1.4] max-w-full">
                      {currentArticle.title}
                    </h1>
                  </div>

                  {/* Excerpt with fixed height and clamping */}
                  <div className="h-[4rem] sm:h-[5rem] md:h-[6rem] flex items-start">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-4xl">
                      {currentArticle.excerpt}
                    </p>
                  </div>

                  {/* Meta Information with fixed height */}
                  <div className="h-[2rem] flex items-center py-2 sm:py-3 md:py-4">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate max-w-[120px] sm:max-w-none">{currentArticle.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap">
                          {mounted ? formatDistanceToNow(currentArticle.publishedAt, { addSuffix: true }) : 'Loading...'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap">
                          {mounted ? `${currentArticle.views.toLocaleString()} views` : 'Loading...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Fixed CTA Button Section */}
            <div className="flex-shrink-0 pb-16 sm:pb-20 md:pb-24 pt-6 sm:pt-8 md:pt-10">
              <Link
                href={`/article/${featuredArticles[currentSlide].slug}`}
                className="inline-flex items-center px-6 py-3 sm:px-8 sm:py-4 bg-blue-600 text-white text-sm sm:text-base font-semibold"
              >
                Read Full Story
              </Link>
            </div>
            
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-2 sm:left-4 flex items-center z-20">
        <div className="flex items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={prevSlide}
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
            className="p-2 bg-black/40 text-white/80 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4" />
          </motion.button>
          

        </div>
      </div>

      <div className="absolute inset-y-0 right-2 sm:right-4 flex items-center z-20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={nextSlide}
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          className="p-2 bg-black/40 text-white/80 backdrop-blur-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {featuredArticles.map((_, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.2 }}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              className={cn(
                'w-3 h-3',
                index === currentSlide
                  ? 'bg-white'
                  : 'bg-white/50'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <motion.div
          className="h-full bg-blue-500"
          initial={{ width: '0%' }}
          animate={{ width: isAutoPlaying ? '100%' : '0%' }}
          transition={{ duration: 5, ease: 'linear' }}
          key={currentSlide}
        />
      </div>
    </section>
  );
}