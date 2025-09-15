'use client';

import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
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

// --- Tailwind Grid Helpers ---
const getGridClasses = (config: GridConfig) =>
  `${COLS_CLASS[config.base]} md:${COLS_CLASS[config.md]} lg:${COLS_CLASS[config.lg]} xl:${COLS_CLASS[config.xl]}`;
const getColSpanClasses = (colSpan: GridConfig) =>
  `${COL_SPAN_CLASS[colSpan.base]} md:${COL_SPAN_CLASS[colSpan.md]} lg:${COL_SPAN_CLASS[colSpan.lg]} xl:${COL_SPAN_CLASS[colSpan.xl]}`;

// --- Component ---
interface SportsSectionProps {
  articles: Article[];
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
}

export function SportsSection({ articles, onEdit, onDelete }: SportsSectionProps) {
  const { data: session } = useSession();
  const isAdmin = !!session?.user && session.user.role === 'ADMIN';

  const defaultTemplate: LayoutTemplate = LAYOUT_TEMPLATES[0];

  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(defaultTemplate);
  const [originalTemplate, setOriginalTemplate] = useState<LayoutTemplate>(defaultTemplate);
  const [itemCount, setItemCount] = useState<number>(defaultTemplate.itemCount);
  const [editingLayout, setEditingLayout] = useState(false);
  const [showGridLines, setShowGridLines] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');
  const [loadingLayout, setLoadingLayout] = useState(false);
  const [justSaved, setJustSaved] = useState(false); 

  const gridRef = useRef<HTMLDivElement>(null);
  
  // Computed values
  const displayArticles = useMemo(() => {
    return articles.slice(0, itemCount);
  }, [articles, itemCount]);
  
  const gridClasses = useMemo(() => {
    return getGridClasses(selectedTemplate.config);
  }, [selectedTemplate.config]);

  // --- Load saved layout ---
  useEffect(() => {
    const loadLayout = async () => {
      try {
        setLoadingLayout(true);
        const res = await fetch('/api/layout?sports=true');
        const data = await res.json();
        if (data.layout) {
          const savedTemplate = LAYOUT_TEMPLATES.find(t => t.name === data.layout.template);
          if (savedTemplate) {
            setSelectedTemplate(savedTemplate);
            setOriginalTemplate(savedTemplate);
            setItemCount(data.layout.itemCount);
          }
        }
      } catch (err) {
        console.error('Failed to load layout:', err);
      } finally {
        setLoadingLayout(false);
      }
    };
    loadLayout();
  }, []);

  // --- Breakpoint detection ---
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1280) setCurrentBreakpoint('xl');
      else if (w >= 1024) setCurrentBreakpoint('lg');
      else if (w >= 768) setCurrentBreakpoint('md');
      else setCurrentBreakpoint('base');
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);



  // --- Layout Editor Actions ---
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

  const saveChanges = useCallback(async () => {
    try {
      const res = await fetch('/api/layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template: selectedTemplate.name, itemCount })
      });
      if (!res.ok) throw new Error('Failed to save layout');
      setEditingLayout(false);
      setHasUnsavedChanges(false);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1500);
    } catch (err) {
      console.error('Save failed:', err);
    }
  }, [selectedTemplate, itemCount]);

  const applyTemplate = useCallback((t: LayoutTemplate) => {
    setSelectedTemplate(t);
    setItemCount(t.itemCount);
    setHasUnsavedChanges(true);
  }, []);

  // --- Grid Overlay ---
  const GridOverlay = React.memo(() => {
    if (!editingLayout || !showGridLines) return null;
    return (
      <div className={cn('absolute inset-0 pointer-events-none z-10 grid gap-4', gridClasses)}>
        {displayArticles.map((_, i) => {
          const l = selectedTemplate.itemLayouts?.[i];
          const span = l ? getColSpanClasses(l.colSpan) : 'col-span-1';
          const pr = l?.priority || 'normal';
          return (
            <div
              key={i}
              className={cn(
                'border-2 border-dashed min-h-[140px] flex items-center justify-center text-xs font-medium',
                span,
                pr === 'featured'
                  ? 'border-blue-400 bg-blue-50/50 text-blue-700'
                  : pr === 'compact'
                  ? 'border-gray-400 bg-gray-50/50 text-gray-600'
                  : 'border-green-400 bg-green-50/50 text-green-700'
              )}
            >
              {pr === 'featured' ? '⭐ Featured' : pr === 'compact' ? '📰 Compact' : '📄 Normal'}
            </div>
          );
        })}
      </div>
    );
  });
  GridOverlay.displayName = 'GridOverlay';

  return (
    <section>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sports
          </h2>
        </div>
        
        <div className={cn('grid gap-4 relative', getGridClasses(selectedTemplate.config))}>
          <GridOverlay />
          {displayArticles.map((article, index) => {
            const itemLayout = selectedTemplate.itemLayouts?.[index];
            return (
              <div
                key={article.id}
                className={itemLayout ? getColSpanClasses(itemLayout.colSpan) : 'col-span-1'}
              >
                <GridItem
                  article={article}
                  isAdmin={isAdmin}
                  itemLayout={itemLayout}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- Grid Item ---
function GridItem({ article, isAdmin, itemLayout, onEdit, onDelete }: { 
  article: Article; 
  isAdmin: boolean; 
  itemLayout?: ItemLayout;
  onEdit?: (article: Article) => void;
  onDelete?: (articleId: string) => void;
}) {
  const isFeatured = itemLayout?.priority === 'featured';
  const isCompact = itemLayout?.priority === 'compact';
  return (
    <div className="p-4">
      {isAdmin && (onEdit || onDelete) && (
        <div className="flex justify-end mb-2">
          <ArticleManagement
            article={article}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      )}
      <div className={cn('relative w-full overflow-hidden', isFeatured ? 'aspect-[16/9]' : isCompact ? 'aspect-[4/3]' : 'aspect-[3/2]')}>
        <ProgressiveImage src={article.imageUrl || ''} alt={article.title} className="w-full h-full object-cover" fill />
      </div>
      <h3 className={cn('font-bold mt-2', isFeatured ? 'text-xl' : isCompact ? 'text-sm' : 'text-base')}>{article.title}</h3>
      {!isCompact && <p className="text-sm text-gray-600 line-clamp-2">{article.excerpt}</p>}
      <div className="flex justify-between text-xs mt-2 text-gray-500">
        <span>{article.author || 'Staff'}</span>
        <time>{formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}</time>
      </div>
    </div>
  );
}
