// 곡 검색 바 컴포넌트

import { useState, useEffect } from 'react';
import { Input } from '../common/Input';

interface SongSearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function SongSearchBar({ onSearch, placeholder = '곡 제목 또는 아티스트 검색' }: SongSearchBarProps) {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 500); // 500ms 디바운싱
    
    return () => clearTimeout(timer);
  }, [query, onSearch]);
  
  return (
    <div>
      <Input
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="text-lg"
      />
    </div>
  );
}

