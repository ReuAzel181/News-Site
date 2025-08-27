'use client';

import { useState, useEffect, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { SearchFilters } from '@/types';

interface UseSearchProps {
  initialQuery?: string;
  initialFilters?: SearchFilters;
  onSearch?: (query: string, filters: SearchFilters) => void;
  debounceMs?: number;
}

export function useSearch({
  initialQuery = '',
  initialFilters = {},
  onSearch,
  debounceMs = 300,
}: UseSearchProps = {}) {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedQuery = useDebounce(query, debounceMs);

  const searchParams = useMemo(() => ({
    query: debouncedQuery,
    ...filters,
  }), [debouncedQuery, filters]);

  useEffect(() => {
    if (onSearch && (debouncedQuery || Object.keys(filters).length > 0)) {
      setIsSearching(true);
      onSearch(debouncedQuery, filters);
      setIsSearching(false);
    }
  }, [debouncedQuery, filters, onSearch]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const removeFilter = (key: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
    setQuery('');
  };

  const hasActiveFilters = useMemo(() => {
    return query.length > 0 || Object.keys(filters).length > 0;
  }, [query, filters]);

  return {
    query,
    setQuery,
    filters,
    setFilters,
    updateFilter,
    removeFilter,
    clearFilters,
    searchParams,
    isSearching,
    hasActiveFilters,
  };
}