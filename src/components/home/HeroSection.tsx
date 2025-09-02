'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, User, Globe } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/utils/cn';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';

// Default featured articles used when no custom slides are saved yet
const defaultSlides = [
  {
    id: '1',
    title: 'Philippines Achieves Record Renewable Energy Growth',
    excerpt: 'The Department of Energy reports unprecedented 794.34 MW of renewable energy capacity added in 2024, marking a historic milestone that surpasses the combined achievements of the previous three years as the nation accelerates its ambitious clean energy transition.',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=90',
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
    imageUrl: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=90',
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
    imageUrl: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=90',
    category: 'Business',
    author: 'Mylene Capongcol',
    publishedAt: new Date('2024-01-15T06:00:00Z'),
    views: 22150,
    slug: 'philippines-solar-wind-power-goals-2030'
  }
];

// Keep a local type for client-side use
type HeroSlide = {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  author: string;
  publishedAt: string | Date;
  views: number;
  slug: string;
  source?: string;
};

const categoryColors = {
  Technology: 'bg-blue-500',
  Environment: 'bg-green-500',
  Business: 'bg-purple-500',
  Politics: 'bg-red-500',
  Sports: 'bg-orange-500',
  Entertainment: 'bg-pink-500'
};

export function HeroSection() {
  const { data: session, status: sessionStatus } = useSession();
  const isAdmin = sessionStatus === 'authenticated' && !!session?.user && (session as Session).user?.role === 'ADMIN';

  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [draftSlides, setDraftSlides] = useState<HeroSlide[]>([]);
  const [saving, setSaving] = useState(false);
  const [localFiles, setLocalFiles] = useState<Record<string, File | undefined>>({});
  // Track visibility of per-slide details to avoid cramped layouts
  const [detailsOpen, setDetailsOpen] = useState<Record<string, boolean>>({});

  useEffect(() => { setMounted(true); }, []);

  // Load saved slides from server
  useEffect(() => {
    let isCancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/content', { cache: 'no-store' });
        const json = await res.json();
        const serverSlides: HeroSlide[] = Array.isArray(json?.data?.heroSlides) ? json.data.heroSlides : [];
        if (!isCancelled && serverSlides.length) {
          // Normalize dates
          const normalized = serverSlides.map((s) => ({ ...s, publishedAt: s.publishedAt ? new Date(s.publishedAt) : new Date('2024-01-01') }));
          setSlides(normalized);
        }
      } catch {
        // silent fail, keep defaults
      }
    }
    load();
    return () => { isCancelled = true; };
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying || editMode) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, editMode, slides.length]);

  const currentSlides = editMode ? draftSlides : slides;
  const currentArticle = currentSlides[currentSlide];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % currentSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + currentSlides.length) % currentSlides.length);
  const goToSlide = (index: number) => setCurrentSlide(index);

  const startEdit = () => {
    setDraftSlides(slides.map(s => ({ ...s })));
    setEditMode(true);
    setIsAutoPlaying(false);
  };
  const cancelEdit = () => {
    setEditMode(false);
    setDraftSlides([]);
  };
  const updateDraft = (index: number, field: keyof HeroSlide, value: string | number | Date) => {
    setDraftSlides(prev => prev.map((s, i) => {
      if (i !== index) return s;
      const next = { ...s, [field]: value } as HeroSlide;
      if (field === 'title') {
        const slugify = (str: string) => str
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        next.slug = slugify(String(value || '')) || next.slug;
      }
      return next;
    }));
  };
  const addSlide = () => {
    const id = `slide-${Math.floor(Math.random() * 1000000)}-${slides.length}`;
    const slugify = (str: string) => str
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    const title = 'New Slide';
    setDraftSlides(prev => [...prev, {
      id,
      title,
      excerpt: '',
      imageUrl: '',
      category: 'General',
      author: 'Unknown',
      publishedAt: new Date('2024-01-01'),
      views: 0,
      slug: `new-${slugify(title)}-${id}`,
      source: ''
    }]);
  };
  const removeSlide = (index: number) => {
    setDraftSlides(prev => prev.filter((_, i) => i !== index));
  };

  const saveSlides = async () => {
    setSaving(true);
    try {
      // Upload any locally selected images first
      const uploadedSlides = await Promise.all(draftSlides.map(async (s) => {
        const file = localFiles[s.id];
        let imageUrl = s.imageUrl;
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData });
            if (res.ok) {
              const json = await res.json();
              if (json?.url) imageUrl = json.url as string;
            }
          } catch (e) {
            console.error('Upload failed', e);
          }
        }
        // Always ensure slug is generated from title silently
        const slugify = (str: string) => str
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
        return { ...s, imageUrl, slug: slugify(String(s.title || '')) } as HeroSlide;
      }));

      const payload = { op: 'setHeroSlides', slides: uploadedSlides.map(s => { const p = s.publishedAt; const normalized = p instanceof Date ? (isNaN(p.getTime()) ? '' : p.toISOString()) : p; return ({ ...s, publishedAt: normalized }); }) };
      const res = await fetch('/api/content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Failed to save');
      setSlides(uploadedSlides);
      setEditMode(false);
      setLocalFiles({});
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const toggleDetails = (id: string) => {
    setDetailsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const IndicatorButton = ({ index }: { index: number }) => (
    <button
      key={index}
      onClick={() => goToSlide(index)}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
      className={cn('w-3 h-3', index === currentSlide ? 'bg-white' : 'bg-white/50')}
      aria-label={`Go to slide ${index + 1}`}
      style={{ borderRadius: 0 }}
    />
  );
  IndicatorButton.displayName = 'IndicatorButton';

  const indicatorButtons = useMemo(() => currentSlides.map((_, index) => (
    <IndicatorButton key={index} index={index} />
  )), [currentSlides, currentSlide]);

  return (
    <section className="relative h-[85vh] min-h-[650px] overflow-hidden mb-4 sm:mb-8 md:mb-12 lg:mb-16 xl:mb-20">
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
            {currentArticle && (
              <>
                <ProgressiveImage
                  src={currentArticle.imageUrl}
                  alt={currentArticle.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.3))' }} />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Admin controls */}
      {mounted && isAdmin && (
        <div className="absolute top-4 right-4 z-30 flex gap-2">
          {!editMode ? (
            <button type="button" onClick={startEdit} className="px-3 py-1 bg-black text-white" style={{ borderRadius: 0 }}>Edit Hero</button>
          ) : (
            <>
              <button type="button" onClick={cancelEdit} className="px-3 py-1 bg-gray-200" style={{ borderRadius: 0 }}>Cancel</button>
              <button type="button" onClick={saveSlides} disabled={saving} className="px-3 py-1 bg-black text-white" style={{ borderRadius: 0 }}>{saving ? 'Saving…' : 'Save'}</button>
            </>
          )}
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-7xl mx-auto pl-0 pr-4 sm:pr-6 lg:pr-8 w-full h-full">
          <div className="relative h-full flex flex-col max-w-5xl ml-4 sm:ml-6 lg:ml-8">
            {/* Category badge */}
            <div className="flex-shrink-0 pt-16 sm:pt-20 md:pt-24">
              {currentArticle && (
                <span className={cn('inline-block px-3 py-1 text-xs font-semibold text-white', categoryColors[currentArticle.category as keyof typeof categoryColors] || 'bg-gray-500')}>
                  {currentArticle.category}
                </span>
              )}
            </div>

            {/* Flexible Content Section */}
            <div className="flex-1 flex flex-col justify-center py-8 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 60, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -60, scale: 0.95 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], opacity: { duration: 0.6 }, scale: { duration: 0.8 } }}
                  className="space-y-4"
                >
                  {/* Title */}
                  <div className="h-[6rem] sm:h-[7.5rem] md:h-[9rem] lg:h-[10.5rem] xl:h-[12rem] flex items-center">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-semibold text-white leading-[1.2] sm:leading-[1.25] md:leading-[1.3] lg:leading-[1.35] xl:leading-[1.4] max-w-full">
                      {currentArticle?.title}
                    </h1>
                  </div>

                  {/* Excerpt */}
                  <div className="h-[4.5rem] sm:h-[5.5rem] md:h-[6.5rem] flex items-start mb-4">
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-200 leading-relaxed max-w-4xl line-clamp-3">
                      {currentArticle?.excerpt}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="h-[3rem] flex items-center py-2 sm:py-3 md:py-4 mt-2 px-2 sm:px-3 md:px-4">
                    <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300">
                      <div className="flex items-center space-x-1">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="truncate max-w-[120px] sm:max-w-none">{currentArticle?.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="whitespace-nowrap">{mounted && currentArticle ? (() => { const d = new Date(currentArticle.publishedAt as string | Date); return isNaN(d.getTime()) ? 'N/A' : formatDistanceToNow(d, { addSuffix: true }); })() : 'Loading...'}</span>
                      </div>
                      {currentArticle?.source && (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="whitespace-nowrap">{currentArticle.source}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 pb-16 sm:pb-20 md:pb-24 pt-6 sm:pt-8 md:pt-10">
              {currentArticle && (
                <Link href={`/article/${currentArticle.slug}`} className="inline-flex items-center px-4 py-2 sm:px-5 sm:py-2.5 bg-deep-blue text-white text-xs sm:text-sm font-semibold">
                  Read Full Story
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-2 sm:left-4 flex items-center z-20">
        <div className="flex items-center">
          <button onClick={prevSlide} onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)} className="p-2 bg-black/40 text-white/80" aria-label="Previous slide" style={{ borderRadius: 0 }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="absolute inset-y-0 right-2 sm:right-4 flex items-center z-20">
        <button onClick={nextSlide} onMouseEnter={() => setIsAutoPlaying(false)} onMouseLeave={() => setIsAutoPlaying(true)} className="p-2 bg-black/40 text-white/80" aria-label="Next slide" style={{ borderRadius: 0 }}>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {indicatorButtons}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30">
        <motion.div className="h-full bg-blue-500" initial={{ width: '0%' }} animate={{ width: isAutoPlaying && !editMode ? '100%' : '0%' }} transition={{ duration: 5, ease: 'linear' }} key={currentSlide} />
      </div>

      {/* Edit panel */}
      {mounted && isAdmin && editMode && (
        <div className="absolute inset-x-0 bottom-0 z-30 bg-white/95 text-black p-4 overflow-y-auto max-h-[50vh]" style={{ backdropFilter: 'none' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold">Edit Hero Slides</h3>
            <div className="flex items-center gap-3">
              {/* Order badges for quick visual ordering */}
              <div className="hidden md:flex items-center gap-1">
                {draftSlides.map((_, i) => (
                  <div key={i} className="px-2 py-1 text-xs font-bold bg-gray-200 text-black" style={{ borderRadius: 0 }}>{i + 1}</div>
                ))}
              </div>
              <button type="button" onClick={addSlide} className="px-3 py-1 bg-gray-200" style={{ borderRadius: 0 }}>Add Slide</button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {draftSlides.map((s, idx) => (
              <div key={s.id} className="p-3" style={{ backgroundColor: 'var(--card)' }}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase">Slide {idx + 1}</div>
                    <button type="button" onClick={() => removeSlide(idx)} className="px-2 py-1 bg-red-600 text-white" style={{ borderRadius: 0 }}>Remove</button>
                    </div>
                    
                    {/* Image preview */}
                    <div className="relative w-full overflow-hidden bg-gray-200" style={{ aspectRatio: '16/9' }}>
                      {s.imageUrl ? (
                        <ProgressiveImage src={s.imageUrl} alt={s.title} fill className="object-contain" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600 text-xs select-none">No image</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Hidden file input controlled by label button */}
                      <input
                        id={`file-${s.id}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const url = URL.createObjectURL(file);
                          setLocalFiles(prev => ({ ...prev, [s.id]: file }));
                          updateDraft(idx, 'imageUrl', url);
                        }}
                        className="hidden"
                      />
                      <label htmlFor={`file-${s.id}`} className="px-2 py-1 bg-gray-200 text-black cursor-pointer select-none" style={{ borderRadius: 0 }}>Replace Image</label>
                      <button type="button" onClick={() => toggleDetails(s.id)} className="px-2 py-1 bg-gray-200 text-black" style={{ borderRadius: 0 }}>
                        {detailsOpen[s.id] ? 'Hide Details' : 'Show Details'}
                      </button>
                    </div>
                    {detailsOpen[s.id] && (
                      <div className="space-y-2">
                        <label className="text-xs font-semibold block">Title</label>
                        <input value={s.title} onChange={(e) => updateDraft(idx, 'title', e.target.value)} className="w-full px-2 py-1 bg-white text-black border-0 rounded-none shadow-none focus:outline-none focus:ring-0" />

                        <label className="text-xs font-semibold block">Excerpt</label>
                        <textarea value={s.excerpt} onChange={(e) => updateDraft(idx, 'excerpt', e.target.value)} className="w-full min-h-[72px] px-2 py-1 bg-white text-black border-0 rounded-none shadow-none focus:outline-none focus:ring-0" />

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-semibold block">Category</label>
                            <input value={s.category} onChange={(e) => updateDraft(idx, 'category', e.target.value)} className="w-full px-2 py-1 bg-white text-black border-0 rounded-none shadow-none focus:outline-none focus:ring-0" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold block">Author</label>
                            <input value={s.author} onChange={(e) => updateDraft(idx, 'author', e.target.value)} className="w-full px-2 py-1 bg-white text-black border-0 rounded-none shadow-none focus:outline-none focus:ring-0" />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs font-semibold block">Published At</label>
                            <input type="datetime-local" value={(() => { const dt = s.publishedAt ? new Date(s.publishedAt as string | Date) : null; return dt && !isNaN(dt.getTime()) ? dt.toISOString().slice(0,16) : ''; })()} onChange={(e) => { const v = e.target.value; updateDraft(idx, 'publishedAt', v ? new Date(v) : ''); }} className="w-full px-2 py-1 bg-white text-black border-0 rounded-none shadow-none focus:outline-none focus:ring-0" />
                          </div>
                          <div>
                            <label className="text-xs font-semibold block">Source</label>
                            <input value={s.source || ''} onChange={(e) => updateDraft(idx, 'source', e.target.value)} placeholder="e.g., Reuters, BBC, Official" className="w-full px-2 py-1 bg-white text-black border-0 rounded-none shadow-none focus:outline-none focus:ring-0" />
                          </div>
                        </div>
                        <div className="text-[11px] text-gray-600">Recommended: 1920×1080. Upload to replace the current image.</div>
                      </div>
                    )}
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </section>
  );
}

HeroSection.displayName = 'HeroSection';