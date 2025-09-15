'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Article } from '@/types';
import { useSession } from 'next-auth/react';
import { useArticles } from '@/hooks/useArticles';
import { GridItem } from '@/components/ui/GridItem';

import { cn } from '@/utils/cn';
import {
  LAYOUT_TEMPLATES,
  COLS_CLASS,
  COL_SPAN_CLASS,
  getDefaultLayoutTemplate,
  LayoutEditor,
  type Breakpoint,
  type GridConfig,
  type ItemLayout,
  type LayoutTemplate
} from '../layouts/layoutTemplates';

// Helper function to get responsive grid classes
const getGridClasses = (config: GridConfig) => {
  return `${COLS_CLASS[config.base]} md:${COLS_CLASS[config.md]} lg:${COLS_CLASS[config.lg]} xl:${COLS_CLASS[config.xl]}`;
};

interface BreakingNewsSectionProps {
  onReadMore?: (article: Article) => void;
  onEdit?: (article: Article) => void;
  onEditBreaking?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
}

export function BreakingNewsSection({
  onReadMore,
  onEdit,
  onEditBreaking,
  onDelete
}: BreakingNewsSectionProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && session.user.role === 'ADMIN';

  // Use custom hook for article fetching
  const { articles, loading } = useArticles();

  // Layout management state
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(
    getDefaultLayoutTemplate()
  );
  const [currentBreakpoint, setCurrentBreakpoint] =
    useState<Breakpoint>('base');
  const [editingLayout, setEditingLayout] = useState(false);
  const [originalTemplate, setOriginalTemplate] =
    useState<LayoutTemplate>(getDefaultLayoutTemplate());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loadingLayout, setLoadingLayout] = useState(false);
  const [itemCount, setItemCount] = useState(6);

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
  const displayArticles = articles.slice(
    0,
    Math.min(itemCount, articles.length)
  );

  // Calculate grid metrics for current breakpoint
  const gridMetrics = useMemo(() => {
    const cols = activeTemplate.config[currentBreakpoint];
    const totalItems = Math.min(articles.length, itemCount);
    const rows = Math.ceil(totalItems / cols);
    return { cols, rows, totalItems };
  }, [activeTemplate, currentBreakpoint, articles.length, itemCount]);

  const gridClasses = useMemo(() => {
    return getGridClasses(activeTemplate.config);
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
  }, [originalTemplate]);

  const saveChanges = useCallback(async () => {
    try {
      setLoadingLayout(true);

      const response = await fetch('/api/layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          template: selectedTemplate,
          itemCount: itemCount
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save layout');
      }

      setEditingLayout(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving layout:', error);
    } finally {
      setLoadingLayout(false);
    }
  }, [selectedTemplate, itemCount]);

  // Template selection function
  const applyTemplate = useCallback((template: LayoutTemplate) => {
    setSelectedTemplate(template);
    setItemCount(template.itemCount);
    setHasUnsavedChanges(true);
  }, []);

  return (
    <section>
      <div>
        <div id="breaking-news">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div
                  className="w-3 h-1 mr-2"
                  style={{ backgroundColor: '#000057' }}
                ></div>
                <h2 className="text-lg font-black uppercase tracking-wide text-left news-title">
                  Breaking News
                </h2>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white border-none shadow-none"
                  style={{ borderRadius: '0px' }}
                >
                  Add New
                </button>
              )}
            </div>
          </div>
          <div className="w-full h-0.5 mt-1.5 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-solid border-gray-800 dark:border-gray-300"></div>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-6">
            <div className="px-4 py-3" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Layout Editor</span>
                {!editingLayout ? (
                  <button
                    type="button"
                    className="px-3 py-1.5 text-xs bg-blue-600 text-white rounded-none border-none shadow-none"
                    onClick={startEditing}
                  >
                    Customize Layout
                  </button>
                ) : (
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs bg-gray-500 text-white rounded-none border-none shadow-none"
                      onClick={cancelEditing}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className={cn(
                        'px-3 py-1.5 text-xs rounded-none border-none shadow-none',
                        hasUnsavedChanges && !loadingLayout
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      )}
                      onClick={saveChanges}
                      disabled={!hasUnsavedChanges || loadingLayout}
                    >
                      {loadingLayout ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>

              {editingLayout && (
                <LayoutEditor
                  templates={LAYOUT_TEMPLATES}
                  selectedTemplate={selectedTemplate}
                  onApplyTemplate={applyTemplate}
                />
              )}
            </div>
          </div>
        )}

        <div className="pt-4 px-4 pb-4">
          <div className="relative">
            <div className="w-full relative flex flex-col">
              {(() => {
                const articles = displayArticles;
                const rows: Array<
                  Array<{ article: Article; itemLayout?: ItemLayout; index: number }>
                > = [];
                let currentRow: Array<{
                  article: Article;
                  itemLayout?: ItemLayout;
                  index: number;
                }> = [];
                let currentRowSpan = 0;

                articles.forEach((article, index) => {
                  const itemLayout = activeTemplate.itemLayouts?.[index];
                  const colSpan =
                    itemLayout?.colSpan?.[currentBreakpoint] || 1;

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
                      const colSpan =
                        itemLayout?.colSpan?.[currentBreakpoint] || 1;
                      const widthPercentage =
                        (colSpan / gridMetrics.cols) * 100;

                      return (
                        <div
                          key={article.id}
                          className="relative"
                          style={{ width: `${widthPercentage}%` }}
                        >
                          <GridItem
                            article={article}
                            onReadMore={onReadMore}
                            onEdit={(a) => (onEditBreaking ?? onEdit)?.(a)} // ✅ Always pass edit handler
                            onDelete={onDelete}
                            isAdmin={isAdmin}
                            editingLayout={editingLayout}
                            itemLayout={itemLayout}
                            currentBreakpoint={currentBreakpoint}
                            index={index}
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
      </div>
    </section>
  );
}
