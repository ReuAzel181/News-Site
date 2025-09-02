'use client';

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Article } from '../types';
import { useSession } from 'next-auth/react';
import { cn } from '@/utils/cn';

// Breakpoint types
type Breakpoint = 'base' | 'md' | 'lg' | 'xl';

// Grid configuration interfaces
interface GridConfig {
  base: number;
  md: number;
  lg: number;
  xl: number;
}

interface ItemLayout {
  colSpan: GridConfig;
  priority: 'featured' | 'normal' | 'compact';
}

interface LayoutTemplate {
  name: string;
  description: string;
  config: GridConfig;
  itemCount: number;
  itemLayouts?: ItemLayout[];
}

// Layout template definitions
const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    name: 'Featured Hero',
    description: 'One full-width featured story with smaller articles below',
    config: { base: 1, md: 2, lg: 3, xl: 3 },
    itemCount: 7,
    itemLayouts: [
      { colSpan: { base: 1, md: 2, lg: 3, xl: 3 }, priority: 'featured' }, // Full width hero
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' }
    ]
  },
  {
    name: 'Editorial Focus',
    description: 'Single hero story with sidebar articles for editorial emphasis',
    config: { base: 1, md: 2, lg: 3, xl: 3 },
    itemCount: 7,
    itemLayouts: [
      { colSpan: { base: 1, md: 2, lg: 2, xl: 2 }, priority: 'featured' }, // Large hero story
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' }
    ]
  },
  {
    name: 'Balanced Grid',
    description: 'Perfect for general news browsing with equal-sized articles',
    config: { base: 1, md: 2, lg: 3, xl: 3 },
    itemCount: 9
  },
  {
    name: 'News Feed',
    description: 'Shows more articles at once for quick scanning',
    config: { base: 2, md: 3, lg: 4, xl: 6 },
    itemCount: 12
  },
  {
    name: 'Split Screen',
    description: 'Two equal featured stories with compact news grid below',
    config: { base: 1, md: 2, lg: 4, xl: 4 },
    itemCount: 10,
    itemLayouts: [
      { colSpan: { base: 1, md: 1, lg: 2, xl: 2 }, priority: 'featured' }, // Left featured
      { colSpan: { base: 1, md: 1, lg: 2, xl: 2 }, priority: 'featured' }, // Right featured
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' }
    ]
  }
];

// Utility mappings for Tailwind CSS classes
const COLS_CLASS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6'
};

const COL_SPAN_CLASS: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6'
};

interface BreakingNewsSectionProps {
  articles: Article[];
  onReadMore?: (article: Article) => void;
  onEdit?: (article: Article) => void;
  onEditBreaking?: (article: Article) => void;
}

export function BreakingNewsSection({ articles, onReadMore, onEdit, onEditBreaking }: BreakingNewsSectionProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && (session.user as any).role === 'ADMIN';
  
  // Get featured articles first, then fill with recent articles from priority categories
  const featuredArticles = articles.filter(article => article.featured);
  const priorityCategories = ['Politics', 'National Security', 'National', 'International', 'Legal'];
  const priorityArticles = articles.filter(article => 
    !article.featured && priorityCategories.includes(article.category)
  );
  const otherArticles = articles.filter(article => 
    !article.featured && !priorityCategories.includes(article.category)
  );
  
  const breakingNews = [...featuredArticles, ...priorityArticles, ...otherArticles]
    .filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    );

  // Layout editor state (admin only)
  const [editingLayout, setEditingLayout] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(LAYOUT_TEMPLATES[0]);
  const [originalTemplate, setOriginalTemplate] = useState<LayoutTemplate>(LAYOUT_TEMPLATES[0]);
  const [itemCount, setItemCount] = useState<number>(LAYOUT_TEMPLATES[0].itemCount);
  const [showGridLines, setShowGridLines] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');

  // Breakpoint detection
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1280) setCurrentBreakpoint('xl');
      else if (width >= 1024) setCurrentBreakpoint('lg');
      else if (width >= 768) setCurrentBreakpoint('md');
      else setCurrentBreakpoint('base');
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Memoized calculations
  const activeTemplate = selectedTemplate;
  const displayArticles = breakingNews.slice(0, Math.min(itemCount, breakingNews.length));
  
  // Calculate grid metrics for current breakpoint
  const gridMetrics = useMemo(() => {
    const cols = activeTemplate.config[currentBreakpoint];
    const totalItems = Math.min(breakingNews.length, itemCount);
    const rows = Math.ceil(totalItems / cols);
    return { cols, rows, totalItems };
  }, [activeTemplate, currentBreakpoint, breakingNews.length, itemCount]);
  
  const gridClasses = useMemo(() => {
    const config = activeTemplate.config;
    return [
      COLS_CLASS[config.base],
      `md:${COLS_CLASS[config.md]}`,
      `lg:${COLS_CLASS[config.lg]}`,
      `xl:${COLS_CLASS[config.xl]}`
    ].join(' ');
  }, [activeTemplate]);

  // Layout editor functions
  const startEditing = useCallback(() => {
    setOriginalTemplate(selectedTemplate);
    setEditingLayout(true);
    setHasUnsavedChanges(false);
  }, [selectedTemplate]);

  const cancelEditing = useCallback(() => {
    setSelectedTemplate(originalTemplate);
    setItemCount(originalTemplate.itemCount);
    setEditingLayout(false);
    setHasUnsavedChanges(false);
    setShowGridLines(false);
  }, [originalTemplate]);

  const saveChanges = useCallback(() => {
    setEditingLayout(false);
    setHasUnsavedChanges(false);
    setShowGridLines(false);
    // Here you could save to localStorage or backend
  }, []);

  // Template selection function
  const applyTemplate = useCallback((template: LayoutTemplate) => {
    setSelectedTemplate(template);
    setItemCount(template.itemCount);
    setHasUnsavedChanges(true);
  }, []);

  // Grid overlay for visual representation
  const GridOverlay = React.memo(() => {
    if (!editingLayout || !showGridLines) return null;
    
    const { cols } = gridMetrics;
    const overlayItems: React.ReactElement[] = [];
    
    // Create overlay items that match the actual grid items
    displayArticles.forEach((_, index) => {
      const itemLayout = selectedTemplate.itemLayouts?.[index];
      const colSpan = itemLayout?.colSpan[currentBreakpoint] || 1;
      const priority = itemLayout?.priority || 'normal';
      
      overlayItems.push(
        <div
          key={index}
          className={cn(
            'border-2 border-dashed rounded-none min-h-[200px] flex items-center justify-center text-xs font-medium',
            `col-span-${colSpan}`,
            priority === 'featured' ? 'border-blue-400 bg-blue-50/50 text-blue-700' :
            priority === 'compact' ? 'border-gray-400 bg-gray-50/50 text-gray-600' :
            'border-green-400 bg-green-50/50 text-green-700'
          )}
        >
          <div className="text-center">
            <div className="font-semibold">{priority === 'featured' ? '⭐ Featured' : priority === 'compact' ? '📰 Compact' : '📄 Normal'}</div>
            <div className="text-xs opacity-75">Article {index + 1}</div>
          </div>
        </div>
      );
    });
    
    return (
      <div className={cn(
        'absolute inset-0 pointer-events-none z-10',
        'grid gap-8',
        gridClasses
      )}>
        {overlayItems}
      </div>
    );
  });

  return (
    <section className="mt-12 mb-16">
      <div className="max-w-7xl mx-auto">
        <div id="breaking-news" className="py-4">
          <div className="px-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-4 h-1 mr-3" style={{backgroundColor: '#000057'}}></div>
                <h2 className="text-xl font-black uppercase tracking-wide text-left text-deep-blue news-title">Breaking News</h2>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-medium bg-red-600 text-white border-none shadow-none hover:bg-red-700 transition-colors"
                  onClick={() => {
                    // Handle add new breaking news
                    console.log('Add new breaking news article');
                  }}
                  style={{ borderRadius: '0px' }}
                >
                  Add New
                </button>
              )}
            </div>
          </div>
          <div className="w-full h-px bg-gradient-to-r from-gray-400 via-gray-300 to-transparent mt-2"></div>
        </div>

        {isAdmin && (
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-8">
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-y border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Layout Editor</span>
                {!editingLayout ? (
                  <button
                    type="button"
                    className="px-4 py-2 text-xs bg-blue-600 text-white rounded-none border-none shadow-none hover:bg-blue-700 transition-colors"
                    onClick={startEditing}
                  >
                    Customize Layout
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-xs bg-gray-500 text-white rounded-none border-none shadow-none hover:bg-gray-600 transition-colors"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'px-4 py-2 text-xs rounded-none border-none shadow-none transition-colors',
                        hasUnsavedChanges
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      )}
                      onClick={saveChanges}
                      disabled={!hasUnsavedChanges}
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {editingLayout && (
                <div className="mt-4 space-y-6">
                  {/* Layout Templates */}
                  <div>
                    <div className="text-sm font-semibold mb-4 text-gray-800">Choose Your Layout Style</div>
                    <div className="w-full -mx-3">
                      <div className="flex flex-wrap gap-3 justify-stretch px-3">
                        {LAYOUT_TEMPLATES.map(template => {
                          const isActive = selectedTemplate.name === template.name;
                          const hasFlexibleLayout = !!template.itemLayouts;
                          return (
                            <button
                              key={template.name}
                              type="button"
                              className={cn(
                                'p-3 text-left rounded-none border-2 shadow-none transition-all duration-200 relative flex-1 min-w-0',
                                isActive
                                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                              )}
                              onClick={() => applyTemplate(template)}
                            >
                              {isActive && (
                                <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 flex items-center justify-center" style={{borderRadius: '0px'}}>
                  <div className="w-1.5 h-1.5 bg-white" style={{borderRadius: '0px'}}></div>
                                </div>
                              )}
                              <div className="text-sm font-semibold mb-1 mt-2">{template.name}</div>
                              <div className="text-xs text-gray-600 mb-2 leading-tight line-clamp-2">{template.description}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">{template.itemCount} articles</span>
                                <div className="flex gap-1">
                                  {hasFlexibleLayout ? (
                                    <div className="flex items-center gap-1">
                                      <div className="w-3 h-2 bg-blue-400" style={{borderRadius: '0px'}}></div>
                  <div className="w-2 h-2 bg-green-400" style={{borderRadius: '0px'}}></div>
                  <div className="w-1.5 h-2 bg-gray-400" style={{borderRadius: '0px'}}></div>
                                    </div>
                                  ) : (
                                    Object.values(template.config).map((cols, idx) => (
                                      <div key={idx} className="w-2 h-2 bg-gray-300" style={{borderRadius: '0px'}}></div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Layout Preview */}
                  <div className="bg-white p-4 rounded-none border border-gray-200">
                    <div className="text-sm font-semibold mb-3 text-gray-800">Layout Preview</div>
                    <div className={cn(
                      'grid gap-1 mb-3',
                      COLS_CLASS[selectedTemplate.config[currentBreakpoint]]
                    )}>
                      {selectedTemplate.itemLayouts ? (
                        // Custom layouts with priorities
                        selectedTemplate.itemLayouts.slice(0, Math.min(selectedTemplate.itemCount, 9)).map((layout, index) => {
                          const colSpan = layout.colSpan[currentBreakpoint];
                          return (
                            <div
                              key={index}
                              className={cn(
                                'h-8 flex items-center justify-center text-xs font-medium',
                                layout.priority === 'featured' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                layout.priority === 'compact' ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                                'bg-green-100 text-green-700 border border-green-200',
                                COL_SPAN_CLASS[colSpan]
                              )}
                            >
                              {layout.priority === 'featured' ? '⭐' : layout.priority === 'compact' ? '📰' : '📄'}
                            </div>
                          );
                        })
                      ) : (
                        // Uniform grid layouts (Balanced Grid, News Feed)
                        Array.from({ length: Math.min(selectedTemplate.itemCount, 12) }).map((_, index) => (
                          <div
                            key={index}
                            className="h-8 flex items-center justify-center text-xs font-medium bg-green-100 text-green-700 border border-green-200"
                          >
                            📄
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Preview Controls */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-3 text-sm">
                        <input
                          type="checkbox"
                          checked={showGridLines}
                          onChange={(e) => setShowGridLines(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded-none focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Show layout guide</span>
                      </label>
                      <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-none">
                        {gridMetrics.cols} × {gridMetrics.rows} grid • {gridMetrics.totalItems} articles
                      </div>
                    </div>
                    {showGridLines && (
                      <div className="mt-2 text-xs text-gray-500">
                        💡 The guide shows where each article will appear in your layout
                      </div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    {selectedTemplate.itemLayouts ? (
                      '⭐ Featured • 📄 Normal • 📰 Compact'
                    ) : (
                      `📄 ${selectedTemplate.itemCount} uniform articles in ${selectedTemplate.config[currentBreakpoint]}-column grid`
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-8 px-6 pb-8">
          <div className="relative">
            <div className={cn('grid gap-8 max-h-[650px] overflow-hidden', gridClasses)}>
              {displayArticles.map((article, index) => {
                const itemLayout = activeTemplate.itemLayouts?.[index];
                return (
                  <GridItem
                    key={article.id}
                    article={article}
                    onReadMore={onReadMore}
                    onEdit={onEdit}
                    onEditBreaking={onEditBreaking}
                    isAdmin={isAdmin}
                    editingLayout={editingLayout}
                    itemLayout={itemLayout}
                    currentBreakpoint={currentBreakpoint}
                    templateName={activeTemplate.name}
                    index={index}
                  />
                );
              })}
            </div>
            <GridOverlay />
          </div>
        </div>
      </div>
    </section>
  );

  // GridItem component for rendering individual articles
  function GridItem({
    article,
    onReadMore,
    onEdit,
    onEditBreaking,
    isAdmin,
    editingLayout,
    itemLayout,
    currentBreakpoint,
    templateName,
    index
  }: {
    article: Article;
    onReadMore?: (article: Article) => void;
    onEdit?: (article: Article) => void;
    onEditBreaking?: (article: Article) => void;
    isAdmin: boolean;
    editingLayout: boolean;
    itemLayout?: ItemLayout;
    currentBreakpoint: Breakpoint;
    templateName: string;
    index: number;
  }) {
    const colSpanClasses = useMemo(() => {
      if (!itemLayout) return '';
      
      const spans = itemLayout.colSpan;
      return [
        COL_SPAN_CLASS[spans.base],
        `md:${COL_SPAN_CLASS[spans.md]}`,
        `lg:${COL_SPAN_CLASS[spans.lg]}`,
        `xl:${COL_SPAN_CLASS[spans.xl]}`
      ].join(' ');
    }, [itemLayout]);

    const isFeatured = itemLayout?.priority === 'featured';
    const isCompact = itemLayout?.priority === 'compact';

    return (
      <div 
        className={cn(
          'cursor-pointer h-full',
          colSpanClasses
        )} 
        onClick={() => onReadMore?.(article)}
      >
        {isAdmin && onEdit && (
          <div className="w-full flex justify-end mb-2">
            <button
              type="button"
              className="px-2 py-1 text-xs font-semibold bg-black text-white"
              onClick={(e) => { e.stopPropagation(); (onEditBreaking ?? onEdit)(article); }}
              aria-label={`Edit ${article.title}`}
            >
              Edit
            </button>
          </div>
        )}
        <div className={cn(
          'space-y-3 p-6 h-full flex flex-col',
          isFeatured && 'bg-blue-50',
          isCompact && 'bg-gray-50',
          !itemLayout && 'bg-white'
        )} style={{backgroundColor: itemLayout ? undefined : 'var(--card)', borderRadius: '0px', boxShadow: 'none', border: 'none', outline: 'none'}}>
          <div className={cn(
            'relative w-full rounded-none',
            isFeatured ? 'aspect-[16/9]' : isCompact ? 'aspect-[4/3]' : 'aspect-[3/2]'
          )}>
            <ProgressiveImage
              src={article.imageUrl || ''}
              alt={article.title}
              className="w-full h-full rounded-none"
              fill
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className={cn(
                'font-bold leading-tight mb-2 rounded-none',
                isFeatured ? 'text-xl' : isCompact ? 'text-sm' : 'text-base'
              )}>
                {article.title}
              </h3>
              {!isCompact && (
                <p className={cn(
                  'text-gray-600 mb-3 line-clamp-3 rounded-none',
                  isFeatured ? 'text-base' : 'text-sm'
                )}>
                  {article.excerpt}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium" style={{borderRadius: '0px'}}>
                {article.category}
              </span>
              <time>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</time>
            </div>
          </div>
        </div>
      </div>
    );
  }
}