// 투표 결과 캐시 관리 훅 - 중복 코드 제거

import { useCallback } from 'react';
import { getVotes } from '../../api/vote';
import type { VoteResults } from '../../types';

interface UseVoteCacheProps {
  voteResultsCache: Record<string, VoteResults>;
  setVoteResultsCache: React.Dispatch<React.SetStateAction<Record<string, VoteResults>>>;
  expandedSongIds: Set<string>;
}

export function useVoteCache({
  voteResultsCache,
  setVoteResultsCache,
  expandedSongIds,
}: UseVoteCacheProps) {
  /**
   * 투표 결과 캐시 무효화 및 재로드
   */
  const invalidateVoteCache = useCallback(
    async (songId: string) => {
      // 캐시 삭제
      setVoteResultsCache((prev) => {
        const newCache = { ...prev };
        delete newCache[songId];
        return newCache;
      });

      // 펼쳐진 상태면 즉시 다시 로드
      if (expandedSongIds.has(songId)) {
        try {
          const results = await getVotes(songId);
          setVoteResultsCache((prev) => ({ ...prev, [songId]: results }));
        } catch (error) {
          console.error(`Failed to reload votes for song ${songId}:`, error);
        }
      }
    },
    [expandedSongIds, setVoteResultsCache]
  );

  /**
   * 투표 결과 캐시에서 제거만 (재로드 없이)
   */
  const removeFromVoteCache = useCallback(
    (songId: string) => {
      setVoteResultsCache((prev) => {
        const newCache = { ...prev };
        delete newCache[songId];
        return newCache;
      });
    },
    [setVoteResultsCache]
  );

  return {
    invalidateVoteCache,
    removeFromVoteCache,
  };
}
