// 투표 관련 훅

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createVote, deleteVote, getVotes } from '../api/vote';
import type { VoteCreateRequest } from '../types';

/**
 * 특정 곡의 투표 목록 조회
 */
export function useVotes(songId: string) {
  return useQuery({
    queryKey: ['votes', songId],
    queryFn: () => getVotes(songId),
    enabled: !!songId,
  });
}

/**
 * 투표 생성/변경
 */
export function useCreateVote(jamId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: VoteCreateRequest) => createVote(data),
    onSuccess: () => {
      // 곡 목록 새로고침 (투표 수 업데이트)
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
  });
}

/**
 * 투표 취소
 */
export function useDeleteVote(jamId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (voteId: string) => deleteVote(voteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
  });
}

