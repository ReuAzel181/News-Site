'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { getGridWithSeparators } from '@/components/ui/GridSeparators';
import { Article } from '@/types';
import { useSession } from 'next-auth/react';
import { cn } from '@/utils/cn';
import ArticleManagement from '@/components/ArticleManagement';
import { 
  LAYOUT_TEMPLATES, 
  COLS_CLASS, 
  COL_SPAN_CLASS, 
  type Breakpoint, 
  type GridConfig, 
  type ItemLayout, 
  type LayoutTemplate 
} from '../layouts/layoutTemplates';

// All layout templates and types are now imported from the centralized file
// Using imported Breakpoint type instead of local BP type
type BP = Breakpoint;

// Helper function to get responsive grid classes
const getGridClasses = (config: GridConfig): string => {
  return `${COLS_CLASS[config.base]} md:${COLS_CLASS[config.md]} lg:${COLS_CLASS[config.lg]} xl:${COLS_CLASS[config.xl]}`;
};

// Helper function to get responsive column span classes
const getColSpanClasses = (colSpan: { base: number; md: number; lg: number; xl: number }): string => {
  const classes = [];
  if (colSpan.base > 1) classes.push(COL_SPAN_CLASS[colSpan.base]);
  if (colSpan.md > 1) classes.push(`md:${COL_SPAN_CLASS[colSpan.md]}`);
  if (colSpan.lg > 1) classes.push(`lg:${COL_SPAN_CLASS[colSpan.lg]}`);
  if (colSpan.xl > 1) classes.push(`xl:${COL_SPAN_CLASS[colSpan.xl]}`);
  return classes.join(' ');
};

// Helper function to get default item layout based on priority
const getDefaultItemLayout = (index: number, totalItems: number): ItemLayout => {
  if (index === 0) {
    return { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'featured' };
  } else if (index < totalItems / 2) {
    return { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' };
  } else {
    return { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' };
  }
};

interface TechnologySectionProps {
  articles: Article[];
  className?: string;
  onReadMore?: (article: Article) => void;
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
}

export function TechnologySection({ articles, className, onReadMore, onEdit, onDelete }: TechnologySectionProps) {
  const { data: session } = useSession();
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(LAYOUT_TEMPLATES[0]);
  const [isLayoutSelectorOpen, setIsLayoutSelectorOpen] = useState(false);
  const [editingLayout, setEditingLayout] = useState(false);
  const [showGridLines, setShowGridLines] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [bp, setBp] = useState<Breakpoint>('base');
  const selectorRef = useRef<HTMLDivElement>(null);
  const isAdmin = session?.user;

  // Breakpoint detection
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

  // Close layout selector when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setIsLayoutSelectorOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Memoized filtered and limited articles
  const displayArticles = useMemo(() => {
    return articles.slice(0, selectedTemplate.itemCount);
  }, [articles, selectedTemplate.itemCount]);

  const activeTemplate = useMemo(() => {
    return selectedTemplate;
  }, [selectedTemplate]);

  const gridMetrics = useMemo(() => {
    const cols = activeTemplate.config[bp];
    const totalItems = displayArticles.length;
    const rows = Math.ceil(totalItems / cols);
    return { cols, rows, totalItems };
  }, [activeTemplate.config, bp, displayArticles.length]);

  // Memoized grid with separators
  const gridWithSeparators = useMemo(() => {
    return displayArticles.map((article, index) => ({
      type: 'article' as const,
      article,
      originalIndex: index
    }));
  }, [displayArticles]);

  const handleTemplateSelect = useCallback((template: LayoutTemplate) => {
    setSelectedTemplate(template);
    setIsLayoutSelectorOpen(false);
  }, []);

  const GridOverlay = React.memo(() => {
    if (!editingLayout || !showGridLines) return null;

    const overlayItems: React.ReactNode[] = [];
    const gridClasses = cn(
      'grid gap-4',
      `grid-cols-${gridMetrics.cols}`
    );

    displayArticles.forEach((_, index) => {
      const itemLayout = selectedTemplate.itemLayouts?.[index];
      const colSpanClasses = itemLayout ? `col-span-${itemLayout.colSpan[bp] || 1}` : 'col-span-1';
      const priority = itemLayout?.priority || 'normal';
      
      overlayItems.push(
        <div
          key={index}
          className={cn(
            'border-2 border-dashed min-h-[140px] flex items-center justify-center text-xs font-medium',
            colSpanClasses,
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
        'grid gap-4',
        gridClasses
      )}>
        {overlayItems}
      </div>
    );
  });
  GridOverlay.displayName = 'GridOverlay';

  const startEditing = useCallback(() => {
    setEditingLayout(true);
    setShowGridLines(true);
    setHasUnsavedChanges(false);
  }, []);

  const cancelChanges = useCallback(() => {
    setEditingLayout(false);
    setShowGridLines(false);
    setHasUnsavedChanges(false);
  }, []);

  const saveChanges = useCallback(() => {
    setEditingLayout(false);
    setShowGridLines(false);
    setHasUnsavedChanges(false);
  }, []);

  const applyTemplate = useCallback((template: LayoutTemplate) => {
    setSelectedTemplate(template);
    setHasUnsavedChanges(false);
  }, []);

  return (
    <section>
      <div>
        <div id="technology">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-3 h-1 mr-2" style={{backgroundColor: '#000057'}}></div>
                <h2 className="text-lg font-black uppercase tracking-wide text-left news-title">Technology</h2>
              </div>
              {isAdmin && (
                 <button
                   type="button"
                   onClick={() => setIsLayoutSelectorOpen(!isLayoutSelectorOpen)}
                   className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                   style={{borderRadius: '0px'}}
                 >
                   Layout: {selectedTemplate.name}
                 </button>
               )}
             </div>
           </div>
        </div>

        {/* Layout Editor Panel */}
        {isAdmin && isLayoutSelectorOpen && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-4" style={{borderRadius: '0px'}}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Layout Editor</h3>
                <div className="flex gap-2">
                  <button
                    onClick={cancelChanges}
                    className="px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    style={{borderRadius: '0px'}}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveChanges}
                    className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700"
                    style={{borderRadius: '0px'}}
                  >
                    Save
                  </button>
                </div>
              </div>

              {/* Template Selection */}
              <div className="mb-4">
                <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-300">Layout Templates</div>
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUT_TEMPLATES.map((template) => {
                    const isSelected = selectedTemplate.name === template.name;
                    return (
                      <button
                        key={template.name}
                        onClick={() => applyTemplate(template)}
                        className={cn(
                          'p-3 text-left border transition-colors',
                          isSelected
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        )}
                        style={{borderRadius: '0px'}}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{template.name}</div>
                          <div className="flex gap-0.5">
                            {Object.values(template.config).map((cols, idx) => (
                              <div key={idx} className="w-2 h-2 bg-gray-300" style={{borderRadius: '0px'}}></div>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Layout Preview */}
              <div className="bg-white p-3 border border-gray-200">
                <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-300">Layout Preview</div>
                <div className={cn(
                  'grid gap-1 mb-2',
                  getGridClasses(selectedTemplate.config)
                )}>
                  {selectedTemplate.itemLayouts ? (
                    selectedTemplate.itemLayouts.slice(0, Math.min(selectedTemplate.itemCount, 9)).map((layout, index) => {
                      const colSpanClasses = getColSpanClasses(layout.colSpan);
                      return (
                        <div
                          key={index}
                          className={cn(
                            'h-8 flex items-center justify-center text-xs font-medium',
                            layout.priority === 'featured' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                            layout.priority === 'compact' ? 'bg-gray-100 text-gray-600 border border-gray-200' :
                            'bg-green-100 text-green-700 border border-green-200',
                            colSpanClasses
                          )}
                        >
                          {layout.priority === 'featured' ? '⭐' : layout.priority === 'compact' ? '📰' : '📄'}
                        </div>
                      );
                    })
                  ) : (
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
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={showGridLines}
                      onChange={(e) => setShowGridLines(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded-none focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Show layout guide</span>
                  </label>
                  <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-none">
                    {gridMetrics.cols} × {gridMetrics.rows} grid • {gridMetrics.totalItems} articles
                  </div>
                </div>
                {showGridLines && (
                  <div className="mt-1.5 text-xs text-gray-500">
                    💡 The guide shows where each article will appear in your layout
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 text-center">
                {selectedTemplate.itemLayouts ? (
                  '⭐ Featured • 📄 Normal • 📰 Compact'
                ) : (
                  `📄 ${selectedTemplate.itemCount} uniform articles in ${selectedTemplate.config[bp]}-column grid`
                )}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 px-4 pb-4">
          <div className="relative">
            <div className="relative w-full">
              <div className="w-full relative flex flex-col">
                <GridOverlay />
                {(() => {
                  const articles = displayArticles;
                  const rows: Array<Array<{ article: Article; itemLayout?: ItemLayout; index: number }>> = [];
                  let currentRow: Array<{ article: Article; itemLayout?: ItemLayout; index: number }> = [];
                  let currentRowSpan = 0;
                  
                  articles.forEach((article, index) => {
                    const itemLayout = activeTemplate.itemLayouts?.[index];
                    const colSpan = itemLayout?.colSpan?.[bp] || 1;
                    
                    if (currentRowSpan + colSpan > gridMetrics.cols) {
                      if (currentRow.length > 0) {
                        rows.push([...currentRow]);
                        currentRow = [];
                        currentRowSpan = 0;
                      }
                    }
                    
                    currentRow.push({ article, itemLayout, index });
                    currentRowSpan += colSpan;
                    
                    if (currentRowSpan >= gridMetrics.cols) {
                      rows.push([...currentRow]);
                      currentRow = [];
                      currentRowSpan = 0;
                    }
                  });
                  
                  if (currentRow.length > 0) {
                    rows.push(currentRow);
                  }
                  
                  return rows.map((row, rowIndex) => {
                    const totalColSpan = row.reduce((sum, { itemLayout }) => {
                      return sum + (itemLayout?.colSpan?.[bp] || 1);
                    }, 0);
                    
                    return (
                      <div key={rowIndex} className="relative flex w-full">
                        {row.map(({ article, itemLayout, index }, colIndex) => {
                          const colSpan = itemLayout?.colSpan?.[bp] || 1;
                          const widthPercentage = (colSpan / totalColSpan) * 100;
                          
                          return (
                            <div
                              key={article.id}
                              className="relative"
                              style={{ width: `${widthPercentage}%` }}
                            >
                              <GridItem
                                article={article}
                                priority={itemLayout?.priority || 'normal'}
                                className=""
                                onEdit={onEdit}
                                onDelete={onDelete}
                              />
                              {colIndex < row.length - 1 && (
                                <div className="absolute top-0 right-0 w-px h-full bg-gray-200 dark:bg-gray-700" />
                              )}
                            </div>
                          );
                        })}
                        {rowIndex < rows.length - 1 && (
                          <div className="absolute bottom-0 left-4 right-4 h-px bg-gray-200 dark:bg-gray-700" />
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface GridItemProps {
  article: Article;
  priority: 'featured' | 'normal' | 'compact';
  className?: string;
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
}

function GridItem({ article, priority, className, onEdit, onDelete }: GridItemProps) {
  const { data: session } = useSession();
  const isAdmin = session?.user;
  const getImageHeight = () => {
    switch (priority) {
      case 'featured':
        return 'h-64 md:h-80';
      case 'normal':
        return 'h-48';
      case 'compact':
        return 'h-32';
      default:
        return 'h-48';
    }
  };

  const getTitleSize = () => {
    switch (priority) {
      case 'featured':
        return 'text-xl md:text-2xl font-bold';
      case 'normal':
        return 'text-lg font-semibold';
      case 'compact':
        return 'text-base font-medium';
      default:
        return 'text-lg font-semibold';
    }
  };

  const showExcerpt = priority !== 'compact';
  const showAuthor = priority === 'featured';

  return (
    <article className={cn('cursor-pointer', className)}>
      <div className="bg-white dark:bg-gray-900">
        <div className={cn('relative overflow-hidden', getImageHeight())}>
          <ProgressiveImage
            src={article.imageUrl || '/placeholder-image.jpg'}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2">
            <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-600 text-white" style={{borderRadius: '0px'}}>
              {article.category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <time className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
            </time>
          </div>
          
          <h3 className={cn(
            'text-gray-900 dark:text-white mb-2 line-clamp-3',
            getTitleSize()
          )}>
            {article.title}
          </h3>
          
          {showExcerpt && article.excerpt && (
            <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 mb-3">
              {article.excerpt}
            </p>
          )}
          
          {showAuthor && article.author && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <span>By {article.author}</span>
            </div>
          )}
          
          {isAdmin && (onEdit || onDelete) && (
            <div className="mt-3">
              <ArticleManagement
                article={article}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default TechnologySection;