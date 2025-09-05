'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { getGridWithSeparators } from '@/components/ui/GridSeparators';
import { cn } from '@/utils/cn';

type Breakpoint = 'base' | 'md' | 'lg' | 'xl';

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

const GRID_CLASS: Record<number, string> = {
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

const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    name: 'Cinema Hero',
    description: 'Large cinematic video player with thumbnail playlist below',
    config: { base: 1, md: 2, lg: 4, xl: 4 },
    itemCount: 8,
    itemLayouts: [
      { colSpan: { base: 1, md: 2, lg: 4, xl: 4 }, priority: 'featured' }, // Full width cinema player
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' }
    ]
  },
  {
    name: 'Video Spotlight',
    description: 'Main video with sidebar playlist for focused viewing',
    config: { base: 1, md: 3, lg: 3, xl: 3 },
    itemCount: 6,
    itemLayouts: [
      { colSpan: { base: 1, md: 2, lg: 2, xl: 2 }, priority: 'featured' }, // Main video player
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' }
    ]
  },
  {
    name: 'Video Gallery',
    description: 'Equal-sized video thumbnails for browsing multiple videos',
    config: { base: 2, md: 3, lg: 4, xl: 4 },
    itemCount: 12
  },
  {
    name: 'Dual Feature',
    description: 'Two featured videos side-by-side with related videos below',
    config: { base: 1, md: 2, lg: 4, xl: 4 },
    itemCount: 10,
    itemLayouts: [
      { colSpan: { base: 1, md: 1, lg: 2, xl: 2 }, priority: 'featured' }, // Left featured video
      { colSpan: { base: 1, md: 1, lg: 2, xl: 2 }, priority: 'featured' }, // Right featured video
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' }
    ]
  },
  {
    name: 'Playlist View',
    description: 'Compact video list optimized for sequential viewing',
    config: { base: 1, md: 2, lg: 3, xl: 6 },
    itemCount: 15
  }
];

interface Video {
  id: string;
  videoId: string;
  title: string;
  description: string;
  channel: string;
  views: string;
  publishedAt: Date;
  thumbnail: string;
  duration: string;
}

interface FeaturedVideosSectionProps {
  videos: Video[];
  isAdmin?: boolean;
  onEdit?: (video: Video) => void;
  onAdd?: (video: Video) => void;
  onDelete?: (videoId: string) => void;
}

export function FeaturedVideosSection({ videos, isAdmin = false, onEdit, onAdd, onDelete }: FeaturedVideosSectionProps) {
  // Layout state
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(LAYOUT_TEMPLATES[0]);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');
  
  // Layout editor state
  const [editingLayout, setEditingLayout] = useState(false);
  const [originalTemplate, setOriginalTemplate] = useState<LayoutTemplate | null>(null);
  const [itemCount, setItemCount] = useState(selectedTemplate.itemCount);
  const [showGridLines, setShowGridLines] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
  const displayVideos = videos.slice(0, Math.min(activeTemplate.itemCount, videos.length));
  
  const gridClasses = useMemo(() => {
    const config = activeTemplate.config;
    return [
      GRID_CLASS[config.base],
      `md:${GRID_CLASS[config.md]}`,
      `lg:${GRID_CLASS[config.lg]}`,
      `xl:${GRID_CLASS[config.xl]}`
    ].join(' ');
  }, [activeTemplate]);

  // Layout editor functions
  const startEditing = useCallback(() => {
    setOriginalTemplate(selectedTemplate);
    setEditingLayout(true);
    setShowGridLines(true);
    setHasUnsavedChanges(false);
  }, [selectedTemplate]);

  const cancelEditing = useCallback(() => {
    if (originalTemplate) {
      setSelectedTemplate(originalTemplate);
      setItemCount(originalTemplate.itemCount);
    }
    setEditingLayout(false);
    setOriginalTemplate(null);
    setShowGridLines(false);
    setHasUnsavedChanges(false);
  }, [originalTemplate]);

  const saveChanges = useCallback(() => {
    setEditingLayout(false);
    setOriginalTemplate(null);
    setShowGridLines(false);
    setHasUnsavedChanges(false);
  }, []);

  // Template selection function
  const applyTemplate = useCallback((template: LayoutTemplate) => {
    setSelectedTemplate(template);
    setItemCount(template.itemCount);
    setHasUnsavedChanges(true);
  }, []);

  // Grid metrics calculation
  const gridMetrics = useMemo(() => {
    const config = selectedTemplate.config;
    const cols = config[currentBreakpoint];
    const totalItems = Math.min(itemCount, videos.length);
    const rows = Math.ceil(totalItems / cols);
    return {
      cols,
      rows,
      totalItems
    };
  }, [selectedTemplate, currentBreakpoint, itemCount, videos.length]);

  // Grid overlay for visual representation
  const GridOverlay = React.memo(() => {
    if (!editingLayout || !showGridLines) return null;
    
    const { cols } = gridMetrics;
    const overlayItems: React.ReactElement[] = [];
    
    // Create overlay items that match the actual grid items
    displayVideos.forEach((_, index) => {
      const itemLayout = selectedTemplate.itemLayouts?.[index];
      const colSpan = itemLayout?.colSpan || { base: 1, md: 1, lg: 1, xl: 1 };
      const priority = itemLayout?.priority || 'normal';
      const isFeatured = priority === 'featured';
      const isCompact = priority === 'compact';
      
      // Use the same colSpan calculation as VideoItem
      const colSpanClasses = [
        COL_SPAN_CLASS[colSpan.base],
        `md:${COL_SPAN_CLASS[colSpan.md]}`,
        `lg:${COL_SPAN_CLASS[colSpan.lg]}`,
        `xl:${COL_SPAN_CLASS[colSpan.xl]}`
      ].join(' ');
      
      overlayItems.push(
        <div
          key={index}
          className={cn('h-full', colSpanClasses)}
        >
          {/* Match the Edit button space when admin */}
          {isAdmin && (
            <div className="w-full flex justify-end mb-2">
              <div className="px-2 py-1 text-xs font-semibold bg-black/20 text-transparent border border-dashed border-gray-400">
                Edit
              </div>
            </div>
          )}
          {/* Match the VideoItem card structure */}
          <div className={cn(
            'border-2 border-dashed h-full flex flex-col',
            priority === 'featured' ? 'border-red-400 bg-red-50/30' :
            priority === 'compact' ? 'border-gray-400 bg-gray-50/30' :
            'border-green-400 bg-green-50/30'
          )}>
            {/* Match the video iframe area */}
            <div className={cn(
              'relative w-full bg-gray-200/50 border border-dashed border-gray-300 flex items-center justify-center',
              isFeatured ? 'aspect-[16/9]' : isCompact ? 'aspect-[4/3]' : 'aspect-[3/2]'
            )}>
              <div className="text-center text-xs font-medium text-gray-600">
                <div className="font-semibold">{priority === 'featured' ? 'Featured Video' : priority === 'compact' ? 'Compact Video' : 'Normal Video'}</div>
                <div className="opacity-75">Video {index + 1}</div>
              </div>
            </div>
            {/* Match the content area */}
            <div className="flex-1 p-6 border border-dashed border-gray-300 bg-white/50">
              <div className="text-xs text-gray-500 text-center">
                Content Area
              </div>
            </div>
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
  GridOverlay.displayName = 'GridOverlay';

  return (
    <section className="mt-12 mb-16" id="featured-videos">
      <div className="max-w-7xl mx-auto">
        <div className="py-4">
          <div className="px-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <div className="w-4 h-1 mr-3" style={{backgroundColor: '#000057'}}></div>
                <h2 className="text-xl font-black uppercase tracking-wide text-left news-title">Featured Videos</h2>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-medium bg-orange-600 text-white border-none rounded-none shadow-none"
                  onClick={() => {
                    // Create a new video object with placeholder data
                    const newVideo: Video = {
                      id: `new-video-${Date.now()}`,
                      videoId: 'dQw4w9WgXcQ', // Rick Roll as placeholder - will be replaced by user
                      title: 'New Video Title - Click Edit to Customize',
                      description: 'Add your video description here. Click the Edit button to customize this video with your content.',
                      channel: 'Your Channel Name',
                      views: '0',
                      publishedAt: new Date(),
                      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
                      duration: '3:32'
                    };
                    
                    // Call the onAdd handler if provided for immediate visual feedback
                    if (onAdd) {
                      onAdd(newVideo);
                    } else if (onEdit) {
                      // Fallback to onEdit if onAdd is not provided
                      onEdit(newVideo);
                    } else {
                      // Fallback: provide helpful guidance
                      console.warn('Add New Video: No add or edit handler provided. Video created but cannot be added.');
                      alert('Video created successfully! However, no add handler is configured. Please contact your administrator to enable video adding functionality.');
                    }
                  }}
                  title="Add a new video to the featured videos section"
                >
                  Add New Video
                </button>
              )}
            </div>
          </div>
          <div className="w-full h-px bg-gray-300 mt-2"></div>
        </div>

        {isAdmin && (
          <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] mb-8">
            <div className="px-6 py-4 bg-gray-50 border-y border-gray-200">
              {!editingLayout ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-semibold">Video Layout Editor</span>
                    <span className="text-xs text-gray-600">Current: {selectedTemplate.name}</span>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium"
                    onClick={startEditing}
                    style={{ borderRadius: '0px' }}
                  >
                    Customize Layout
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-semibold">Video Layout Templates</span>
                      <label className="flex items-center space-x-2 text-xs">
                        <input
                          type="checkbox"
                          checked={showGridLines}
                          onChange={(e) => setShowGridLines(e.target.checked)}
                          className="rounded-none"
                        />
                        <span>Show grid overlay</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      {hasUnsavedChanges && (
                        <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
                      )}
                      <button
                        type="button"
                        className="px-3 py-1 text-xs border border-gray-300 rounded-none shadow-none"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded-none shadow-none"
                        onClick={saveChanges}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm font-semibold mb-4 text-gray-800 dark:text-gray-300">Choose Your Video Layout Style</div>
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
                                'p-3 text-left border-2 relative flex-1 min-w-0',
                                isActive
                                  ? 'border-blue-500 bg-blue-50 text-blue-900'
                                  : 'border-gray-200 bg-white',
                                'rounded-none shadow-none'
                              )}
                              onClick={() => applyTemplate(template)}
                            >
                              {isActive && (
                                <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 flex items-center justify-center rounded-none">
                  <div className="w-1.5 h-1.5 bg-white rounded-none"></div>
                                </div>
                              )}
                              <div className="text-sm font-semibold mb-1 mt-2">{template.name}</div>
                              <div className="text-xs text-gray-600 mb-2 leading-tight line-clamp-2">{template.description}</div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-500">Grid: {template.config.base}/{template.config.md}/{template.config.lg}/{template.config.xl}</span>
                                {hasFlexibleLayout && (
                                  <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 text-xs font-medium rounded-none">Video Layout</span>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <div className="pt-8 px-6 pb-8">
          <div className="relative">
            <div className="w-full relative flex flex-col">
              {(() => {
                const videos = displayVideos;
                const rows: Array<Array<{ video: Video; itemLayout?: ItemLayout; index: number }>> = [];
                let currentRow: Array<{ video: Video; itemLayout?: ItemLayout; index: number }> = [];
                let currentRowSpan = 0;
                
                videos.forEach((video, index) => {
                  const itemLayout = activeTemplate.itemLayouts?.[index];
                  const colSpan = itemLayout?.colSpan?.[currentBreakpoint] || 1;
                  
                  if (currentRowSpan + colSpan > gridMetrics.cols) {
                    if (currentRow.length > 0) {
                      rows.push([...currentRow]);
                      currentRow = [];
                      currentRowSpan = 0;
                    }
                  }
                  
                  currentRow.push({ video, itemLayout, index });
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
                    {row.map(({ video, itemLayout, index }, colIndex) => {
                      const colSpan = itemLayout?.colSpan?.[currentBreakpoint] || 1;
                      const widthPercentage = (colSpan / gridMetrics.cols) * 100;
                      
                      return (
                        <div
                          key={video.id}
                          className="relative"
                          style={{ width: `${widthPercentage}%` }}
                        >
                          <VideoItem
                            video={video}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            isAdmin={isAdmin}
                            editingLayout={editingLayout}
                            itemLayout={itemLayout}
                            currentBreakpoint={currentBreakpoint}
                            templateName={activeTemplate.name}
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

  // VideoItem component for rendering individual videos
  function VideoItem({
    video,
    onEdit,
    onDelete,
    isAdmin,
    editingLayout,
    itemLayout,
    currentBreakpoint,
    templateName,
    index
  }: {
    video: Video;
    onEdit?: (video: Video) => void;
    onDelete?: (videoId: string) => void;
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
      <div className={cn(
           'h-full',
           colSpanClasses
         )}>
        {isAdmin && (onEdit || onDelete) && (
          <div className="w-full flex justify-end gap-2 mb-2">
            {onEdit && (
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white transition-none"
                onClick={(e) => { e.stopPropagation(); onEdit(video); }}
                aria-label={`Edit ${video.title}`}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="px-4 py-2 text-sm font-semibold bg-red-600 text-white transition-none"
                onClick={(e) => { e.stopPropagation(); onDelete(video.id); }}
                aria-label={`Remove ${video.title}`}
              >
                Remove
              </button>
            )}
          </div>
        )}
        <div className="space-y-3 p-6 h-full flex flex-col rounded-none shadow-none ring-0 outline-none transition-none">
          <div className={cn(
            'relative w-full bg-gray-200 rounded-none',
            isFeatured ? 'aspect-[16/9]' : isCompact ? 'aspect-[4/3]' : 'aspect-[3/2]'
          )}>
            <iframe
              src={`https://www.youtube.com/embed/${video.videoId}`}
              title={video.title}
              className="w-full h-full rounded-none"
              allowFullScreen
            />
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className={cn(
                'font-bold leading-tight mb-2',
                isFeatured ? 'text-xl' : isCompact ? 'text-sm' : 'text-base'
              )}>
                {video.title}
              </h3>
              {!isCompact && (
                <p className={cn(
                  'text-gray-500 font-sans mb-3 line-clamp-3',
                  isFeatured ? 'text-base' : 'text-sm'
                )}>
                  {video.description}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="bg-red-100 text-red-800 px-2 py-1 text-xs font-medium rounded-none">
                {video.channel}
              </span>
              <div className="flex items-center space-x-2">
                <span>{video.views} views</span>
                <span>•</span>
                <time>{formatDistanceToNow(new Date(video.publishedAt), { addSuffix: true })}</time>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}