'use client';

import React from 'react';
import { cn } from '@/utils/cn';

// Breakpoint types
export type Breakpoint = 'base' | 'md' | 'lg' | 'xl';

// Grid configuration interfaces
export interface GridConfig {
  base: number;
  md: number;
  lg: number;
  xl: number;
}

export interface ItemLayout {
  colSpan: GridConfig;
  priority: 'featured' | 'normal' | 'compact';
}

export interface LayoutTemplate {
  name: string;
  description: string;
  config: GridConfig;
  itemCount: number;
  itemLayouts?: ItemLayout[];
}

// CSS class mappings
export const COLS_CLASS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6'
};

export const COL_SPAN_CLASS: Record<number, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
  5: 'col-span-5',
  6: 'col-span-6'
};

// Comprehensive layout template definitions
export const LAYOUT_TEMPLATES: LayoutTemplate[] = [
  {
    name: 'Featured Hero',
    description: 'One full-width featured story with smaller articles below',
    config: { base: 1, md: 2, lg: 3, xl: 3 },
    itemCount: 7,
    itemLayouts: [
      { colSpan: { base: 1, md: 2, lg: 3, xl: 3 }, priority: 'featured' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' }
    ]
  },
  {
    name: 'Split Screen',
    description: 'Two featured stories side by side with smaller articles below',
    config: { base: 1, md: 2, lg: 3, xl: 3 },
    itemCount: 8,
    itemLayouts: [
      { colSpan: { base: 1, md: 1, lg: 2, xl: 2 }, priority: 'featured' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'featured' },
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
    name: 'Split Screen Extended',
    description: 'Two equal featured stories with compact news grid below',
    config: { base: 1, md: 2, lg: 4, xl: 4 },
    itemCount: 10,
    itemLayouts: [
      { colSpan: { base: 1, md: 1, lg: 2, xl: 2 }, priority: 'featured' },
      { colSpan: { base: 1, md: 1, lg: 2, xl: 2 }, priority: 'featured' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
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
    name: 'Magazine Style',
    description: 'Editorial magazine-style layout with varied article sizes',
    config: { base: 1, md: 2, lg: 3, xl: 4 },
    itemCount: 8,
    itemLayouts: [
      { colSpan: { base: 1, md: 2, lg: 2, xl: 2 }, priority: 'featured' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'normal' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' },
      { colSpan: { base: 1, md: 1, lg: 1, xl: 1 }, priority: 'compact' }
    ]
  }
];

// Helpers
export function getLayoutTemplateByName(name: string): LayoutTemplate | undefined {
  return LAYOUT_TEMPLATES.find(template => template.name === name);
}

export function getDefaultLayoutTemplate(): LayoutTemplate {
  return LAYOUT_TEMPLATES[0];
}

// --- Internal helpers for LayoutEditor ---
const getGridClasses = (config: GridConfig) =>
  `${COLS_CLASS[config.base]} md:${COLS_CLASS[config.md]} lg:${COLS_CLASS[config.lg]} xl:${COLS_CLASS[config.xl]}`;

const getColSpanClasses = (colSpan: GridConfig) =>
  `${COL_SPAN_CLASS[colSpan.base]} md:${COL_SPAN_CLASS[colSpan.md]} lg:${COL_SPAN_CLASS[colSpan.lg]} xl:${COL_SPAN_CLASS[colSpan.xl]}`;

// --- LayoutEditor Component ---
interface LayoutEditorProps {
  templates: LayoutTemplate[];
  selectedTemplate: LayoutTemplate;
  onApplyTemplate: (template: LayoutTemplate) => void;
}

export function LayoutEditor({ templates, selectedTemplate, onApplyTemplate }: LayoutEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-semibold mb-3 text-gray-800 dark:text-gray-300">
          Choose Your Layout Style
        </div>
        <div className="flex flex-wrap gap-2">
          {templates.map(template => {
            const isActive = selectedTemplate.name === template.name;
            const hasFlexibleLayout = !!template.itemLayouts;
            return (
              <button
                key={template.name}
                type="button"
                className={cn(
                  'p-2 text-left border-2 shadow-none transition-all flex-1 min-w-[180px]',
                  isActive
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                )}
                onClick={() => onApplyTemplate(template)}
              >
                <div className="text-sm font-semibold mb-1">{template.name}</div>
                <div className="text-xs text-gray-600 mb-1.5">{template.description}</div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">{template.itemCount} articles</span>
                  <div className="flex gap-1">
                    {hasFlexibleLayout ? (
                      <div className="flex items-center gap-1">
                        <div className="w-3 h-2 bg-blue-400" />
                        <div className="w-2 h-2 bg-green-400" />
                        <div className="w-1.5 h-2 bg-gray-400" />
                      </div>
                    ) : (
                      Object.values(template.config).map((_, idx) => (
                        <div key={idx} className="w-2 h-2 bg-gray-300" />
                      ))
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Layout Preview */}
      <div className="bg-white p-3 border border-gray-200">
        <div className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-300">
          Layout Preview
        </div>
        <div className={cn('grid gap-1', getGridClasses(selectedTemplate.config))}>
          {selectedTemplate.itemLayouts
            ? selectedTemplate.itemLayouts
                .slice(0, Math.min(selectedTemplate.itemCount, 9))
                .map((layout, index) => (
                  <div
                    key={index}
                    className={cn(
                      'h-8 flex items-center justify-center text-xs font-medium',
                      layout.priority === 'featured'
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : layout.priority === 'compact'
                        ? 'bg-gray-100 text-gray-600 border border-gray-200'
                        : 'bg-green-100 text-green-700 border border-green-200',
                      getColSpanClasses(layout.colSpan)
                    )}
                  >
                    {layout.priority === 'featured'
                      ? '⭐'
                      : layout.priority === 'compact'
                      ? '📰'
                      : '📄'}
                  </div>
                ))
            : Array.from({ length: Math.min(selectedTemplate.itemCount, 12) }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-8 flex items-center justify-center text-xs font-medium bg-green-100 text-green-700 border border-green-200"
                >
                  📄
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}
