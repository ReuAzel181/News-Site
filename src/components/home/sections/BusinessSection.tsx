'use client';

import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Article } from '../types';
import { useSession } from 'next-auth/react';
import { cn } from '@/utils/cn';

// Breakpoint type
type BP = 'base' | 'md' | 'lg' | 'xl';

// Grid configuration for breakpoints
interface GridConfig {
  base: number;
  md: number;
  lg: number;
  xl: number;
}

// Layout template definitions with flexible item configurations
interface ItemLayout {
  colSpan: { base: number; md: number; lg: number; xl: number };
  priority: 'featured' | 'normal' | 'compact';
}

interface LayoutTemplate {
  name: string;
  description: string;
  config: GridConfig;
  itemCount: number;
  itemLayouts?: ItemLayout[];
}

// Predefined layout templates with flexible configurations
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

// Utility: map numeric column count to Tailwind class names (keep strings static for safelisting)
const COLS_CLASS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

// Rows mapping (needed for dynamic grid-rows-* classes)
const ROWS_CLASS: Record<number, string> = {
  1: 'grid-rows-1',
  2: 'grid-rows-2',
  3: 'grid-rows-3',
  4: 'grid-rows-4',
  5: 'grid-rows-5',
  6: 'grid-rows-6',
};

// Utility: map numeric span to Tailwind classes
const COL_SPAN_CLASS: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6',
};

const ROW_SPAN_CLASS: Record<number, string> = {
  1: 'row-span-1',
  2: 'row-span-2',
  3: 'row-span-3',
  4: 'row-span-4',
  5: 'row-span-5',
  6: 'row-span-6',
};

// Removed unused constants for simplified interface

interface BusinessSectionProps {
  articles: Article[];
  onReadMore?: (article: Article) => void;
  onEdit?: (article: Article) => void;
}

export function BusinessSection({ articles, onReadMore, onEdit }: BusinessSectionProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && session.user.role === 'ADMIN';
  console.log('BusinessSection received articles:', articles.length);
  console.log('Business articles before filtering:', articles.filter(a => a.category === 'Business' || a.category === 'Finance'));
  
  const businessNews = useMemo(() => (
    articles
      .filter(article => 
        article.category === 'Business' || article.category === 'Finance'
      )
      .filter((article, index, self) => 
        index === self.findIndex(a => a.id === article.id)
      )
      .slice(0, 12)
  ), [articles]);
  
  console.log('BusinessSection filtered articles:', businessNews.length, businessNews);

  // Layout editor state (admin only)
  const [editingLayout, setEditingLayout] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(LAYOUT_TEMPLATES[0]);
  const [originalTemplate, setOriginalTemplate] = useState<LayoutTemplate>(LAYOUT_TEMPLATES[0]);
  const [gridCols, setGridCols] = useState<GridConfig>(LAYOUT_TEMPLATES[0].config);
  const [itemCount, setItemCount] = useState<number>(LAYOUT_TEMPLATES[0].itemCount);
  const [showGridLines, setShowGridLines] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Determine current breakpoint for preview
  const [bp, setBp] = useState<BP>('base');
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      if (w >= 1280) setBp('xl');
      else if (w >= 1024) setBp('lg');
      else if (w >= 768) setBp('md');
      else setBp('base');
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const applyTemplate = useCallback((template: LayoutTemplate) => {
    setSelectedTemplate(template);
    setGridCols(template.config);
    setItemCount(template.itemCount);
    setHasUnsavedChanges(true);
  }, []);

  const startEditing = useCallback(() => {
    setOriginalTemplate(selectedTemplate);
    setEditingLayout(true);
    setHasUnsavedChanges(false);
  }, [selectedTemplate]);

  const cancelEditing = useCallback(() => {
    setSelectedTemplate(originalTemplate);
    setGridCols(originalTemplate.config);
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

  // Grid visualization
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Calculate grid metrics for current breakpoint
  const gridMetrics = useMemo(() => {
    const cols = gridCols[bp];
    const totalItems = Math.min(businessNews.length, itemCount);
    const rows = Math.ceil(totalItems / cols);
    return { cols, rows, totalItems };
  }, [gridCols, bp, businessNews.length, itemCount]);

  // Compute responsive grid classes based on editor state
  const gridClass = useMemo(() => {
    return cn(
      'grid items-start auto-rows-min w-full',
      editingLayout && showGridLines ? 'gap-1' : 'gap-2',
      COLS_CLASS[gridCols.base],
      gridCols.md ? `md:${COLS_CLASS[gridCols.md]}` : undefined,
      gridCols.lg ? `lg:${COLS_CLASS[gridCols.lg]}` : undefined,
      gridCols.xl ? `xl:${COLS_CLASS[gridCols.xl]}` : undefined,
    );
  }, [gridCols, editingLayout, showGridLines]);

  // Grid overlay for visual representation
  const GridOverlay = memo(() => {
    if (!editingLayout || !showGridLines || !gridRef.current) return null;
    
    const { cols } = gridMetrics;
    const overlayItems: React.ReactElement[] = [];
    
    // Create overlay items that match the actual grid items
    businessNews.slice(0, itemCount).forEach((_, index) => {
      const itemLayout = selectedTemplate.itemLayouts?.[index];
      const colSpan = itemLayout?.colSpan[bp] || 1;
      const priority = itemLayout?.priority || 'normal';
      
      overlayItems.push(
        <div
          key={index}
          className={cn(
            'border-2 border-dashed rounded-none min-h-[200px] flex items-center justify-center text-xs font-medium',
            priority === 'featured' ? 'border-blue-400 bg-blue-50/40 text-blue-700' :
            priority === 'compact' ? 'border-gray-400 bg-gray-50/40 text-gray-600' :
            'border-green-400 bg-green-50/40 text-green-700',
            COL_SPAN_CLASS[colSpan]
          )}
        >
          <div className="text-center">
              <div className="font-semibold">{priority === 'featured' ? '⭐ Featured' : priority === 'compact' ? '📰 Compact' : '📄 Standard'}</div>
              <div className="text-xs opacity-75">Item {index + 1} • Span {colSpan}</div>
            </div>
          </div>
      );
    });
    
    return (
      <div className={cn('absolute inset-0 pointer-events-none', gridClass)}>
        {overlayItems}
      </div>
    );
  });

  return (
    <div className="mt-12">
      <div id="business-finance" className="py-4">
        <div className="px-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-4 h-1 mr-3" style={{backgroundColor: '#000057'}}></div>
              <h2 className="text-xl font-black uppercase tracking-wide text-left text-deep-blue news-title">Business & Finance</h2>
            </div>
            {isAdmin && (
              <button
                type="button"
                className="px-4 py-2 text-xs font-medium bg-green-600 text-white border-none shadow-none hover:bg-green-700 transition-colors"
                onClick={() => {
                  // Handle add new business article
                  console.log('Add new business article');
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

                {/* Advanced Settings - Hidden for simplified interface */}

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
              </div>
            )}
          </div>
        </div>
      )}

      <div className="w-full">
        <div className="relative">
          <div ref={gridRef} className={cn(gridClass, 'w-full')}>
            {businessNews.slice(0, itemCount).map((article, index) => {
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
          <GridOverlay />
        </div>
      </div>
    </div>
  );
}

interface GridItemProps {
  article: Article;
  onReadMore?: (article: Article) => void;
  onEdit?: (article: Article) => void;
  isAdmin: boolean;
  editingLayout: boolean;
  itemLayout?: ItemLayout;
  currentBreakpoint: BP;
  templateName: string; // Add template name to differentiate styling
}

const GridItem = memo(function GridItem({ article, onReadMore, onEdit, isAdmin, editingLayout, itemLayout, currentBreakpoint, templateName }: GridItemProps) {

  const handleReadMore = useCallback(() => {
    onReadMore?.(article);
  }, [article, onReadMore]);

  const handleEdit = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onEdit?.(article);
  }, [article, onEdit]);

  // Calculate column span classes based on item layout
  const colSpanClasses = useMemo(() => {
    if (!itemLayout) return '';
    
    const spans = itemLayout.colSpan;
    return cn(
      COL_SPAN_CLASS[spans.base],
      spans.md ? `md:${COL_SPAN_CLASS[spans.md]}` : undefined,
      spans.lg ? `lg:${COL_SPAN_CLASS[spans.lg]}` : undefined,
      spans.xl ? `xl:${COL_SPAN_CLASS[spans.xl]}` : undefined
    );
  }, [itemLayout]);

  // Determine styling based on priority and template
  const priorityStyles = useMemo(() => {
    if (!itemLayout) return { aspectRatio: '4/3', titleSize: 'text-sm', excerptLines: 'line-clamp-2' };
    
    // Template-specific styling differences
    const isEditorial = templateName === 'Editorial Focus';
    const isSplitScreen = templateName === 'Split Screen';
    
    switch (itemLayout.priority) {
      case 'featured':
        return {
          aspectRatio: isEditorial ? '5/3' : isSplitScreen ? '3/2' : '16/9', // Split Screen uses 3:2 for better balance
          titleSize: isEditorial ? 'text-lg md:text-xl font-bold' : isSplitScreen ? 'text-base md:text-lg font-semibold' : 'text-lg md:text-xl font-semibold',
          excerptLines: isEditorial ? 'line-clamp-3' : isSplitScreen ? 'line-clamp-2' : 'line-clamp-3'
        };
      case 'compact':
        return {
          aspectRatio: isEditorial ? '4/3' : isSplitScreen ? '3/2' : '4/3', // Split Screen uses 3:2 for compact items
          titleSize: isEditorial ? 'text-xs font-medium' : isSplitScreen ? 'text-xs font-medium' : 'text-xs font-normal',
          excerptLines: 'line-clamp-1'
        };
      default:
        return {
          aspectRatio: isEditorial ? '4/3' : '3/2', // Consistent aspect ratios
          titleSize: isEditorial ? 'text-sm font-semibold' : 'text-sm font-medium',
          excerptLines: isEditorial ? 'line-clamp-2' : 'line-clamp-2'
        };
    }
  }, [itemLayout, templateName]);

  return (
    <div 
      className={cn(
        'cursor-pointer',
        colSpanClasses,
        editingLayout && 'ring-1 ring-gray-200 ring-inset'
      )} 
      onClick={handleReadMore}
    >
      {isAdmin && onEdit && (
        <div className="w-full flex justify-end mb-2">
          <button
            type="button"
            className="px-2 py-1 text-xs font-semibold bg-black text-white rounded-none shadow-none border-none"
            onClick={handleEdit}
            aria-label={`Edit ${article.title}`}
          >
            Edit
          </button>
        </div>
      )}
      <div className={cn(
        'flex flex-col rounded-none shadow-none ring-0 outline-none border-none',
        // Optimized template-specific padding - reduced for better space utilization
        templateName === 'Editorial Focus' ? (
          itemLayout?.priority === 'featured' ? 'p-4' : itemLayout?.priority === 'compact' ? 'p-2' : 'p-3'
        ) : templateName === 'Split Screen' ? (
          itemLayout?.priority === 'featured' ? 'p-3' : itemLayout?.priority === 'compact' ? 'p-1.5' : 'p-2'
        ) : (
          itemLayout?.priority === 'featured' ? 'p-3' : itemLayout?.priority === 'compact' ? 'p-1.5' : 'p-2'
        ),
      )} style={{backgroundColor: 'var(--card)'}}>
        {/* Removed all borders and dividers for flat design */}
        <div className={cn(
          'relative w-full rounded-none',
          itemLayout?.priority === 'featured' ? 'mb-3' : itemLayout?.priority === 'compact' ? 'mb-1.5' : 'mb-2'
        )} style={{aspectRatio: priorityStyles.aspectRatio}}>
          <ProgressiveImage
            src={article.imageUrl}
            alt={article.title}
            width={itemLayout?.priority === 'featured' ? 800 : 400}
            height={itemLayout?.priority === 'featured' ? 450 : 300}
            className="w-full h-full rounded-none"
            quality={95}
            fill
            sizes={itemLayout?.priority === 'featured' ? '(max-width: 768px) 100vw, 80vw' : '(max-width: 768px) 100vw, 33vw'}
          />
        </div>
        <div className={cn(
          'flex flex-col',
          templateName === 'Editorial Focus' ? (
            itemLayout?.priority === 'featured' ? 'space-y-2' : 'space-y-1.5'
          ) : (
            itemLayout?.priority === 'featured' ? 'space-y-1.5' : 'space-y-1'
          )
        )}>
          <span className={cn(
            'inline-block font-semibold text-white rounded-none w-fit',
            // Template-specific category badge styling
            templateName === 'Editorial Focus' ? (
              itemLayout?.priority === 'featured' ? 'bg-blue-600 px-4 py-2 text-base' : 
              itemLayout?.priority === 'compact' ? 'bg-gray-600 px-2 py-1 text-xs' : 
              'bg-green-600 px-3 py-1.5 text-sm'
            ) : (
              itemLayout?.priority === 'featured' ? 'bg-green-600 px-3 py-2 text-sm' : 
              itemLayout?.priority === 'compact' ? 'bg-green-600 px-1.5 py-0.5 text-xs' : 
              'bg-green-600 px-2 py-1 text-xs'
            )
          )}>
            {article.category}
          </span>
          <h3 className={cn(
            'font-semibold news-title',
            priorityStyles.titleSize,
            itemLayout?.priority === 'featured' ? 'line-clamp-3' : 'line-clamp-2'
          )}>
            {article.title}
          </h3>
          {itemLayout?.priority !== 'compact' && (
            <p className={cn(
              'news-content',
              priorityStyles.excerptLines,
              itemLayout?.priority === 'featured' ? 'text-sm' : 'text-xs'
            )}>
              {article.excerpt}
            </p>
          )}
          <div className={cn(
            'news-meta',
            itemLayout?.priority === 'featured' ? 'text-sm mt-2' : 'text-xs mt-1'
          )}>
            {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    </div>
  );
});