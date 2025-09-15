'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { getGridWithSeparators } from '@/components/ui/GridSeparators';
import { Article } from '@/types';
import { useSession } from 'next-auth/react';
import { cn } from '@/utils/cn';
import ArticleManagement from '@/components/ArticleManagement';
import { useLayoutPersistence } from '@/hooks/useLayoutPersistence';
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



interface LifestyleSectionProps {
  articles: Article[];
  onReadMore: (article: Article) => void;
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
}

export function LifestyleSection({ articles, onReadMore, onEdit, onDelete }: LifestyleSectionProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && session.user.role === 'ADMIN';
  const lifestyleNews = articles
    .filter(article => 
      article.category === 'Lifestyle' || article.category === 'Entertainment'
    )
    .filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    )
    .slice(0, 8);

  // Layout persistence hook
  const {
    selectedTemplate,
    itemCount,
    isLoaded,
    applyTemplate: applyPersistentTemplate
  } = useLayoutPersistence('lifestyle', LAYOUT_TEMPLATES[0], LAYOUT_TEMPLATES);

  // Layout editor state (admin only)
  const [editingLayout, setEditingLayout] = useState(false);
  const [originalTemplate, setOriginalTemplate] = useState<LayoutTemplate>(selectedTemplate);
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
  const displayArticles = lifestyleNews.slice(0, Math.min(itemCount, lifestyleNews.length));
  
  // Calculate grid metrics for current breakpoint
  const gridMetrics = useMemo(() => {
    const cols = activeTemplate.config[currentBreakpoint];
    const totalItems = Math.min(lifestyleNews.length, itemCount);
    const rows = Math.ceil(totalItems / cols);
    return { cols, rows, totalItems };
  }, [activeTemplate, currentBreakpoint, lifestyleNews.length, itemCount]);
  
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

  const cancelChanges = useCallback(() => {
    applyPersistentTemplate(originalTemplate);
    setEditingLayout(false);
    setHasUnsavedChanges(false);
    setShowGridLines(false);
  }, [originalTemplate, applyPersistentTemplate]);

  const saveChanges = useCallback(() => {
    setEditingLayout(false);
    setHasUnsavedChanges(false);
    setShowGridLines(false);
    // Template is already saved via applyPersistentTemplate
  }, []);

  // Template selection function
  const applyTemplate = useCallback((template: LayoutTemplate) => {
    applyPersistentTemplate(template);
    // No need to set hasUnsavedChanges since the hook handles persistence automatically
  }, [applyPersistentTemplate]);

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
        'grid gap-0',
        gridClasses
      )}>
        {overlayItems}
      </div>
    );
  });
  GridOverlay.displayName = 'GridOverlay';



  return (
    <section>
      <div>
        <div id="lifestyle">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-4 h-1 mr-3" style={{backgroundColor: '#000057'}}></div>
              <h2 className="text-xl font-black uppercase tracking-wide text-left news-title">Lifestyle & Entertainment</h2>
            </div>
            {isAdmin && (
              <button
                type="button"
                className="px-4 py-2 text-xs font-medium bg-pink-600 text-white border-none shadow-none"
                onClick={() => {
                  // Handle add new lifestyle article
                  console.log('Add new lifestyle article');
                }}
                style={{ borderRadius: '0px' }}
              >
                Add New
              </button>
            )}
          </div>
        </div>
        <div className="w-full h-0.5 mt-2 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t-2 border-solid border-gray-800 dark:border-gray-300"></div>
          </div>
        </div>
      </div>



      {isAdmin && (
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-8">
          <div className="px-6 py-4" style={{backgroundColor: 'var(--card)'}}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Layout Editor</span>
              {!editingLayout ? (
                <button
                  type="button"
                  className="px-4 py-2 text-xs bg-blue-600 text-white rounded-none border-none shadow-none"
                  onClick={startEditing}
                >
                  Customize Layout
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 text-xs bg-gray-500 text-white rounded-none border-none shadow-none"
                    onClick={cancelChanges}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'px-4 py-2 text-xs rounded-none border-none shadow-none',
                      hasUnsavedChanges
                        ? 'bg-green-600 text-white'
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
                  <div className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-300">Choose Your Layout Style</div>
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
                  <div className="text-xs text-gray-500 text-center">
                     {selectedTemplate.itemLayouts ? (
                       '⭐ Featured • 📄 Normal • 📰 Compact'
                     ) : (
                       `📄 ${selectedTemplate.itemCount} uniform articles in ${selectedTemplate.config[currentBreakpoint]}-column grid`
                     )}
                   </div>
                </div>

                {/* Layout Preview */}
                <div className="bg-white p-4 rounded-none border border-gray-200">
                  <div className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-300">Layout Preview</div>
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
              </div>
            )}
          </div>
        </div>
      )}

      <div className="pt-8 px-6">
        <div className="relative">
          <div className="w-full relative flex flex-col">
            {(() => {
              const articles = displayArticles;
              const rows: Array<Array<{ article: Article; itemLayout?: ItemLayout; index: number }>> = [];
            let currentRow: Array<{ article: Article; itemLayout?: ItemLayout; index: number }> = [];
            let currentRowSpan = 0;
              
              articles.forEach((article, index) => {
                const itemLayout = activeTemplate.itemLayouts?.[index];
                const colSpan = itemLayout?.colSpan?.[currentBreakpoint] || 1;
                
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
              
              return rows.map((row, rowIndex) => (
                <div key={rowIndex} className="flex w-full relative">
                  {row.map(({ article, itemLayout, index }, colIndex) => {
                    const colSpan = itemLayout?.colSpan?.[currentBreakpoint] || 1;
                    const widthPercentage = (colSpan / gridMetrics.cols) * 100;
                    
                    return (
                      <div
                        key={article.id}
                        className="relative"
                        style={{ width: `${widthPercentage}%` }}
                      >
                        <GridItem
                          article={article}
                          onReadMore={onReadMore}
                          onEdit={onEdit}
                          onDelete={onDelete}
                          isAdmin={isAdmin}
                          itemLayout={itemLayout}
                          currentBreakpoint={currentBreakpoint}
                          templateName={activeTemplate.name}
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
              ));
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}

// GridItem component for rendering individual articles
function GridItem({
    article,
    onReadMore,
    onEdit,
    onDelete,
    isAdmin,
    itemLayout,
    currentBreakpoint,
    templateName
  }: {
    article: Article;
    onReadMore?: (article: Article) => void;
    onEdit?: (article: Article) => void;
    onDelete?: (articleId: string) => void;
    isAdmin: boolean;
    itemLayout?: ItemLayout;
    currentBreakpoint: Breakpoint;
    templateName: string;
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
          'transition-none h-full',
          colSpanClasses
        )} 
        onClick={() => onReadMore?.(article)}
      >
        {isAdmin && (onEdit || onDelete) && (
          <div className="w-full flex justify-end mb-3">
            <ArticleManagement
              article={article}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        )}
        <div className={cn(
          'space-y-3 p-6 h-full flex flex-col rounded-none shadow-none ring-0 outline-none',
          isFeatured && 'space-y-4',
          isCompact && 'space-y-2 p-4',
          ''
        )}>
          <div className={cn(
            'relative w-full rounded-none overflow-hidden',
            isFeatured ? 'aspect-[16/10]' : isCompact ? 'aspect-[4/3]' : 'aspect-[4/3]'
          )}>
            <ProgressiveImage
              src={article.imageUrl}
              alt={article.title}
              width={isFeatured ? 600 : 400}
              height={isFeatured ? 375 : 300}
              className="w-full h-full rounded-none transition-none"
              quality={95}
              fill
              sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 33vw"}
            />
            {/* Category overlay */}
            <div className="absolute top-2 left-2 z-10">
              <span 
                className="px-2 py-1 text-xs font-bold text-white uppercase tracking-wider"
                style={{
                  background: 'linear-gradient(90deg, #ec4899, #db2777)'
                }}
              >
                {article.category}
              </span>
            </div>
          </div>
          <div className="space-y-2 flex-1 flex flex-col">
            <h3 className={cn(
              'font-semibold line-clamp-2 news-title',
              isFeatured ? 'text-lg' : isCompact ? 'text-xs' : 'text-sm'
            )}>
              {article.title}
            </h3>
            <p className={cn(
              'line-clamp-2 news-content text-gray-500 font-sans',
              isFeatured ? 'text-sm' : 'text-xs'
            )}>
              {article.excerpt}
            </p>
            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {article.tags.slice(0, 3).map((tag) => (
                  <span 
                    key={tag}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div className="text-xs news-meta mt-auto">
              {formatDistanceToNow(article.publishedAt, { addSuffix: true })}
            </div>
          </div>
        </div>
      </div>
    );
  }