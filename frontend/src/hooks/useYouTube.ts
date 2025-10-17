// YouTube 검색 관련 훅

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchYouTube } from '../api/youtube';

/**
 * YouTube 검색
 */
export function useYouTubeSearch(query: string) {
  return useQuery({
    queryKey: ['youtube', query],
    queryFn: () => searchYouTube(query),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000, // 5분
  });
}

/**
 * YouTube 검색 상태 관리
 */
export function useYouTubeSearchState() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  // 디바운싱
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    
    return () => clearTimeout(timer);
  };
  
  return {
    searchQuery,
    debouncedQuery,
    setSearchQuery,
    handleSearch,
  };
}

