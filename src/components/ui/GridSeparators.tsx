'use client';

import React from 'react';
import { cn } from '@/utils/cn';

interface GridSeparatorsProps {
  cols: number;
  rows: number;
  className?: string;
}

/**
 * Grid separator component that creates gaps between grid items with border styling
 * matching the mb.com.ph design approach with separators in grid gaps
 */
export function GridSeparators({ cols, rows, className }: GridSeparatorsProps) {
  // This component now returns CSS classes for grid gap styling
  // The actual separators are handled by CSS grid gap and border properties
  return null;
}

/**
 * Get grid classes with separator styling for mb.com.ph-style layout
 */
export function getGridWithSeparators(cols: number, className?: string) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2', 
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
  }[cols] || 'grid-cols-1';

  return cn(
    'grid gap-px bg-gray-400 dark:bg-gray-500',
    gridCols,
    className
  );
}

/**
 * Enhanced grid separator component for complex layouts with custom column spans
 */
interface AdvancedGridSeparatorsProps {
  gridConfig: {
    cols: number;
    rows: number;
  };
  itemLayouts?: Array<{
    colSpan: number;
    rowIndex: number;
    colIndex: number;
  }>;
  className?: string;
}

export function AdvancedGridSeparators({ 
  gridConfig, 
  itemLayouts, 
  className 
}: AdvancedGridSeparatorsProps) {
  const { cols, rows } = gridConfig;
  
  // Calculate which separators should be visible based on item layouts
  const visibleVerticalSeparators = new Set<number>();
  const visibleHorizontalSeparators = new Set<number>();
  
  // Add all potential separators
  for (let i = 1; i < cols; i++) {
    visibleVerticalSeparators.add(i);
  }
  for (let i = 1; i < rows; i++) {
    visibleHorizontalSeparators.add(i);
  }
  
  // Remove separators that would intersect with spanning items
  if (itemLayouts) {
    itemLayouts.forEach(({ colSpan, rowIndex, colIndex }) => {
      if (colSpan > 1) {
        // Remove vertical separators within spanning columns
        for (let i = colIndex + 1; i < colIndex + colSpan; i++) {
          visibleVerticalSeparators.delete(i);
        }
      }
    });
  }
  
  return (
    <div className={cn('absolute inset-0 pointer-events-none z-10', className)}>
      {/* Vertical separators extending full height */}
      {Array.from(visibleVerticalSeparators).map((colIndex) => (
        <div
          key={`vertical-${colIndex}`}
          className="absolute top-0 bottom-0 w-px bg-gray-400 dark:bg-gray-500"
          style={{
            left: `${(colIndex / cols) * 100}%`,
          }}
        />
      ))}
      
      {/* Horizontal separators extending full width, excluding last row */}
      {Array.from(visibleHorizontalSeparators).map((rowIndex) => (
        <div
          key={`horizontal-${rowIndex}`}
          className="absolute left-0 right-0 h-px bg-gray-400 dark:bg-gray-500"
          style={{
            top: `${(rowIndex / rows) * 100}%`,
          }}
        />
      ))}
    </div>
  );
}