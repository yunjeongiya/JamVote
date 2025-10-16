// YouTube 검색 결과 항목 컴포넌트

import type { YouTubeSearchResult } from '../../types';

interface YouTubeSearchResultItemProps {
  result: YouTubeSearchResult;
  onClick: () => void;
}

export function YouTubeSearchResultItem({ result, onClick }: YouTubeSearchResultItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
    >
      <img
        src={result.thumbnailUrl}
        alt={result.title}
        className="w-32 h-20 object-cover rounded flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-white truncate">{result.title}</h4>
        <p className="text-xs text-gray-400 truncate">{result.channelTitle}</p>
        {result.duration && (
          <p className="text-xs text-gray-500 mt-1">{result.duration}</p>
        )}
      </div>
    </button>
  );
}

