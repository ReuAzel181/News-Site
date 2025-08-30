'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import { SearchFilters } from '@/types';

interface UseSearchProps<T> {
  items: T[];
  searchFields: (keyof T)[];
  initialFilters?: Partial<SearchFilters>;
}

export function useSearch<T>({ items, searchFields, initialFilters = {} }: UseSearchProps<T>) {
  const [query, setQuery] = useState(initialFilters.query || '');
  const [filters, setFilters] = useState<SearchFilters>({
    query: initialFilters.query || '',
    category: initialFilters.category || '',
    tags: initialFilters.tags || [],
    author: initialFilters.author || '',
    dateFrom: initialFilters.dateFrom,
    dateTo: initialFilters.dateTo,
  });

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, query: debouncedQuery }));
  }, [debouncedQuery]);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredItems = useMemo(() => {
    if (!debouncedQuery) return items;

    const lowerQuery = debouncedQuery.toLowerCase();

    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (value == null) return false;
        return String(value).toLowerCase().includes(lowerQuery);
      })
    );
  }, [items, searchFields, debouncedQuery]);

  return {
    query,
    setQuery,
    filters,
    updateFilter,
    filteredItems,
  };
}