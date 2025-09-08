'use client';

import { useState, useEffect, useCallback } from 'react';

interface LayoutTemplate {
  name: string;
  description: string;
  config: { base: number; md: number; lg: number; xl: number };
  itemCount: number;
  itemLayouts?: Array<{
    colSpan: { base: number; md: number; lg: number; xl: number };
    priority: 'featured' | 'normal' | 'compact';
  }>;
}

interface LayoutState {
  selectedTemplate: LayoutTemplate;
  itemCount: number;
}

const STORAGE_PREFIX = 'news-layout-';

export function useLayoutPersistence(
  sectionName: string,
  defaultTemplate: LayoutTemplate,
  availableTemplates: LayoutTemplate[]
) {
  const [selectedTemplate, setSelectedTemplate] = useState<LayoutTemplate>(defaultTemplate);
  const [itemCount, setItemCount] = useState<number>(defaultTemplate.itemCount);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved layout from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `${STORAGE_PREFIX}${sectionName}`;
      console.log(`[Layout Persistence] Loading layout for ${sectionName}, key: ${storageKey}`);
      const saved = localStorage.getItem(storageKey);
      console.log(`[Layout Persistence] Saved data:`, saved);
      
      if (saved) {
        const parsedState: LayoutState = JSON.parse(saved);
        console.log(`[Layout Persistence] Parsed state:`, parsedState);
        
        // Validate that the saved template still exists in available templates
        const validTemplate = availableTemplates.find(
          template => template.name === parsedState.selectedTemplate.name
        );
        console.log(`[Layout Persistence] Valid template found:`, validTemplate);
        
        if (validTemplate) {
          console.log(`[Layout Persistence] Applying saved layout: ${validTemplate.name}, itemCount: ${parsedState.itemCount}`);
          setSelectedTemplate(validTemplate);
          setItemCount(parsedState.itemCount);
        } else {
          console.log(`[Layout Persistence] Template not found in available templates, using default`);
        }
      } else {
        console.log(`[Layout Persistence] No saved data found, using default template`);
      }
    } catch (error) {
      console.warn(`[Layout Persistence] Failed to load layout for ${sectionName}:`, error);
    } finally {
      console.log(`[Layout Persistence] Setting isLoaded to true for ${sectionName}`);
      setIsLoaded(true);
    }
  }, [sectionName, availableTemplates]);

  // Save layout to localStorage
  const saveLayout = useCallback((template: LayoutTemplate, count: number) => {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `${STORAGE_PREFIX}${sectionName}`;
      const state: LayoutState = {
        selectedTemplate: template,
        itemCount: count
      };
      
      console.log(`[Layout Persistence] Saving layout for ${sectionName}:`, state);
      localStorage.setItem(storageKey, JSON.stringify(state));
      console.log(`[Layout Persistence] Layout saved successfully to ${storageKey}`);
      
      // Verify the save worked
      const verification = localStorage.getItem(storageKey);
      console.log(`[Layout Persistence] Verification read:`, verification);
    } catch (error) {
      console.warn(`[Layout Persistence] Failed to save layout for ${sectionName}:`, error);
    }
  }, [sectionName]);

  // Apply template and save to localStorage
  const applyTemplate = useCallback((template: LayoutTemplate) => {
    setSelectedTemplate(template);
    setItemCount(template.itemCount);
    saveLayout(template, template.itemCount);
  }, [saveLayout]);

  // Update item count and save to localStorage
  const updateItemCount = useCallback((count: number) => {
    setItemCount(count);
    saveLayout(selectedTemplate, count);
  }, [selectedTemplate, saveLayout]);

  // Clear saved layout (reset to default)
  const clearSavedLayout = useCallback(() => {
    if (typeof window === 'undefined') return;

    try {
      const storageKey = `${STORAGE_PREFIX}${sectionName}`;
      localStorage.removeItem(storageKey);
      setSelectedTemplate(defaultTemplate);
      setItemCount(defaultTemplate.itemCount);
    } catch (error) {
      console.warn(`Failed to clear layout for ${sectionName}:`, error);
    }
  }, [sectionName, defaultTemplate]);

  return {
    selectedTemplate,
    itemCount,
    isLoaded,
    applyTemplate,
    updateItemCount,
    clearSavedLayout,
    saveLayout
  };
}

// Utility function to get all saved layouts (for debugging or admin purposes)
export function getAllSavedLayouts(): Record<string, LayoutState> {
  if (typeof window === 'undefined') return {};

  const layouts: Record<string, LayoutState> = {};
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        const sectionName = key.replace(STORAGE_PREFIX, '');
        const value = localStorage.getItem(key);
        if (value) {
          layouts[sectionName] = JSON.parse(value);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to get all saved layouts:', error);
  }

  return layouts;
}

// Utility function to clear all saved layouts
export function clearAllSavedLayouts(): void {
  if (typeof window === 'undefined') return;

  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.warn('Failed to clear all saved layouts:', error);
  }
}