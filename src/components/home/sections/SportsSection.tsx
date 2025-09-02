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
  priority: 'featured' | 'standard' | 'compact';
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
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'standard' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'standard' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'standard' },
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
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'standard' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'standard' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'standard' },
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

const BREAKPOINT_PREFIXES: Record<Breakpoint, string> = {
  base: '',
  md: 'md:',
  lg: 'lg:',
  xl: 'xl:'
};

interface SportsSectionProps {
  articles: Article[];
  onReadMore?: (article: Article) => void;
  onEdit?: (article: Article) => void;
}

export function SportsSection({ articles, onReadMore, onEdit }: SportsSectionProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && session.user.role === 'ADMIN';
  const sportsNews = articles
    .filter(article => article.category === 'Sports')
    .filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    )
    .slice(0, 12);

  // Layout editor state
  const [editingLayout, setEditingLayout] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(LAYOUT_TEMPLATES[0]);
  const [itemCount, setItemCount] = useState(6);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  // Breakpoint detection
  const [bp, setBp] = useState<Breakpoint>('lg');
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1280) setBp('xl');
      else if (width >= 1024) setBp('lg');
      else if (width >= 768) setBp('md');
      else setBp('base');
    };
    
    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  // Memoized calculations
  const gridMetrics = useMemo(() => {
    const cols = selectedTemplate.config[bp];
    const totalItems = Math.min(itemCount, sportsNews.length);
    const rows = Math.ceil(totalItems / cols);
    return { cols, rows, totalItems };
  }, [selectedTemplate, bp, itemCount, sportsNews.length]);

  const gridClass = useMemo(() => {
    const baseClasses = ['grid', 'gap-0', 'items-stretch'];
    const responsiveClasses = Object.entries(selectedTemplate.config)
      .map(([breakpoint, cols]) => {
        const prefix = BREAKPOINT_PREFIXES[breakpoint as Breakpoint];
        return `${prefix}${COLS_CLASS[cols]}`;
      });
    return cn(baseClasses, responsiveClasses);
  }, [selectedTemplate]);

  // Layout editor functions
  const startEditing = useCallback(() => {
    setEditingLayout(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingLayout(false);
    setHasUnsavedChanges(false);
    // Reset to original state if needed
  }, []);

  const saveChanges = useCallback(() => {
    if (hasUnsavedChanges) {
      // Here you would typically save to a backend or local storage
      console.log('Saving layout changes:', { selectedTemplate, itemCount });
      setHasUnsavedChanges(false);
      setEditingLayout(false);
    }
  }, [hasUnsavedChanges, selectedTemplate, itemCount]);

  const applyTemplate = useCallback((template: LayoutTemplate) => {
    setSelectedTemplate(template);
    setItemCount(template.itemCount);
    setHasUnsavedChanges(true);
  }, []);



  // GridItem component interface
  interface GridItemProps {
    article: Article;
    onReadMore?: (article: Article) => void;
    onEdit?: (article: Article) => void;
    isAdmin: boolean;
    editingLayout: boolean;
    itemLayout?: ItemLayout;
    currentBreakpoint: Breakpoint;
    templateName: string;
  }

  // GridItem component for individual article rendering
  const GridItem = ({ article, onReadMore, onEdit, isAdmin, editingLayout, itemLayout, currentBreakpoint, templateName }: GridItemProps) => {
    const colSpanClass = itemLayout ? COL_SPAN_CLASS[itemLayout.colSpan[currentBreakpoint]] : '';
    const isFeatured = itemLayout?.priority === 'featured';
    const isCompact = itemLayout?.priority === 'compact';
    
    return (
      <div className={cn(
        'cursor-pointer h-full',
        colSpanClass,
        editingLayout && 'ring-1 ring-blue-200 ring-opacity-50'
      )} onClick={() => onReadMore?.(article)}>
        {isAdmin && onEdit && !editingLayout && (
          <div className="w-full flex justify-end mb-2">
            <button
              type="button"
              className="px-2 py-1 text-xs font-semibold bg-black text-white"
              onClick={(e) => { e.stopPropagation(); onEdit(article); }}
              aria-label={`Edit ${article.title}`}
            >
              Edit
            </button>
          </div>
        )}
        <div className="space-y-3 p-6 h-full flex flex-col" style={{backgroundColor: 'var(--card)'}}>
          <div className={cn(
            'relative w-full',
            isFeatured ? 'aspect-[16/10]' : isCompact ? 'aspect-[4/3]' : 'aspect-[4/3]'
          )}>
            <ProgressiveImage
              src={article.imageUrl}
              alt={article.title}
              width={400}
              height={300}
              className="w-full h-full"
              quality={95}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
          <div className="space-y-2 flex-1 flex flex-col">
            <span className="inline-block px-2 py-1 text-xs font-semibold bg-blue-600 text-white" style={{borderRadius: '0px'}}>
              {article.category}
            </span>
            <h3 className={cn(
              'font-semibold line-clamp-2 news-title',
              isFeatured ? 'text-lg' : isCompact ? 'text-xs' : 'text-sm'
            )}>
              {article.title}
            </h3>
            <p className={cn(
              'line-clamp-2 news-content',
              isFeatured ? 'text-sm' : 'text-xs'
            )}>
              {article.excerpt}
            </p>
            <div className="text-xs news-meta mt-auto">
              {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-12">
      <div id="sports" className="py-4">
        <div className="px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-4 h-1 mr-3" style={{backgroundColor: '#000057'}}></div>
              <h2 className="text-xl font-black uppercase tracking-wide text-left text-deep-blue news-title">Sports</h2>
            </div>
            {isAdmin && (
              <button
                type="button"
                className="px-4 py-2 text-xs font-medium bg-blue-600 text-white border-none shadow-none hover:bg-blue-700 transition-colors"
                onClick={() => {
                  // Handle add new sports article
                  console.log('Add new sports article');
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
          <div className="px-6 py-4" style={{backgroundColor: 'var(--card)'}}>
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
                    COLS_CLASS[selectedTemplate.config[bp]]
                  )}>
                    {selectedTemplate.itemLayouts ? (
                      // Custom layouts with priorities
                      selectedTemplate.itemLayouts.slice(0, Math.min(selectedTemplate.itemCount, 9)).map((layout, index) => {
                        const colSpan = layout.colSpan[bp];
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
                  <div className="text-xs text-gray-500 text-center">
                    {selectedTemplate.itemLayouts ? (
                      '⭐ Featured • 📄 Standard • 📰 Compact'
                    ) : (
                      `📄 ${selectedTemplate.itemCount} uniform articles in ${selectedTemplate.config[bp]}-column grid`
                    )}
                  </div>
                </div>

                {/* Preview Controls */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-none">
                      {gridMetrics.cols} × {gridMetrics.rows} grid • {gridMetrics.totalItems} articles
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="relative">
          <div ref={gridRef} className={cn(gridClass, 'w-full')}>
            {sportsNews.slice(0, itemCount).map((article, index) => {
              const itemLayout = selectedTemplate.itemLayouts?.[index];
              return (
                <GridItem
                  key={article.id}
                  article={article}
                  onReadMore={onReadMore}
                  onEdit={onEdit}
                  isAdmin={isAdmin}
                  editingLayout={editingLayout}
                  itemLayout={itemLayout}
                  currentBreakpoint={bp}
                  templateName={selectedTemplate.name}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}