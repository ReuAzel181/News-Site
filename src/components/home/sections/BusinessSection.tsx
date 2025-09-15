'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { Article } from '@/types';
import { useSession } from 'next-auth/react';
import { cn } from '@/utils/cn';
import { useLayoutPersistence } from '@/hooks/useLayoutPersistence';
import { GridItem } from '@/components/ui/GridItem';

import { 
  LAYOUT_TEMPLATES, 
  COL_SPAN_CLASS, 
  getDefaultLayoutTemplate,
  getLayoutTemplateByName,
  type Breakpoint, 
  type ItemLayout, 
  type LayoutTemplate 
} from '../layouts/layoutTemplates';

interface BusinessSectionProps {
  articles: Article[];
  onReadMore?: (article: Article) => void;
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
}

export function BusinessSection({ articles, onReadMore, onEdit, onDelete }: BusinessSectionProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && session.user.role === 'ADMIN';
  
  const businessNews = useMemo(() => (
    articles
      .filter(article => 
        article.category?.name === 'Business' || article.category?.name === 'Finance'
      )
      .filter((article, index, self) => 
        index === self.findIndex(a => a.id === article.id)
      )
      .slice(0, 12)
  ), [articles]);

  const {
    selectedTemplate,
    itemCount,
    isLoaded,
    applyTemplate: applyPersistentTemplate
  } = useLayoutPersistence('business-section', getDefaultLayoutTemplate(), LAYOUT_TEMPLATES);

  // Layout editor state
  const [editingLayout, setEditingLayout] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showGridLines, setShowGridLines] = useState(false);
  const [loadingLayout, setLoadingLayout] = useState(false);
  const [bp, setBp] = useState<Breakpoint>('base');

  const displayArticles = businessNews.slice(0, itemCount);

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

  const activeTemplate = useMemo(() => selectedTemplate, [selectedTemplate]);

  const gridMetrics = useMemo(() => {
    const cols = activeTemplate.config[bp];
    const totalItems = displayArticles.length;
    const rows = Math.ceil(totalItems / cols);
    return { cols, rows, totalItems };
  }, [activeTemplate.config, bp, displayArticles.length]);

  const startEditing = useCallback(() => {
    setEditingLayout(true);
    setShowGridLines(true);
    setHasUnsavedChanges(false);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingLayout(false);
    setShowGridLines(false);
    setHasUnsavedChanges(false);
  }, []);

  const saveChanges = useCallback(async () => {
    try {
      setLoadingLayout(true);
      // persist layout config (mock API call, you can connect to backend)
      await new Promise(res => setTimeout(res, 1000));
      setEditingLayout(false);
      setShowGridLines(false);
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving layout:', error);
    } finally {
      setLoadingLayout(false);
    }
  }, []);

  const applyTemplate = useCallback((templateName: string) => {
    const template = getLayoutTemplateByName(templateName);
    if (template) {
      applyPersistentTemplate(template);
      setHasUnsavedChanges(true);
    }
  }, [applyPersistentTemplate]);

  if (!isLoaded || businessNews.length === 0) {
    return null;
  }

  return (
    <section>
      <div>
        <div id="business-finance">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="w-3 h-1 mr-2" style={{backgroundColor: '#a855f7'}}></div>
                <h2 className="text-lg font-black uppercase tracking-wide text-left news-title">Business & Finance</h2>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white border-none shadow-none"
                  onClick={() => console.log('Add new business article')}
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
            <div className="px-4 py-3" style={{backgroundColor: 'var(--card)'}}>
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
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {LAYOUT_TEMPLATES.map((template) => {
                      const isActive = selectedTemplate.name === template.name;
                      return (
                        <div
                          key={template.name}
                          className={cn(
                            'p-3 border cursor-pointer transition-all duration-200',
                            isActive
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                          )}
                           onClick={() => applyTemplate(template.name)} 
                        >
                          {isActive && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-1.5">✓ ACTIVE</div>
                          )}
                          <div className="font-medium text-sm text-gray-900 dark:text-white">{template.name}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{template.description}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-4 px-4 pb-4">
          <div className="relative">
            <div className="relative w-full flex flex-col">
              {(() => {
                const rows: Array<Array<{ article: Article; itemLayout?: ItemLayout; index: number }>> = [];
                let currentRow: Array<{ article: Article; itemLayout?: ItemLayout; index: number }> = [];
                let currentRowSpan = 0;
                
                displayArticles.forEach((article, index) => {
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
                
                if (currentRow.length > 0) rows.push(currentRow);
                
                return rows.map((row, rowIndex) => (
                  <div key={rowIndex} className="flex w-full relative">
                    {row.map(({ article, itemLayout, index }, colIndex) => {
                      const colSpan = itemLayout?.colSpan?.[bp] || 1;
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
                            editingLayout={editingLayout}
                            itemLayout={itemLayout}
                            currentBreakpoint={bp}
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
