// 댓글 관련 훅

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createComment, getComments, deleteComment } from '../api/comment';
import type { CommentCreateRequest } from '../types';

/**
 * 특정 곡의 댓글 목록 조회
 */
export function useComments(songId: string) {
  return useQuery({
    queryKey: ['comments', songId],
    queryFn: () => getComments(songId),
    enabled: !!songId,
  });
}

/**
 * 댓글 작성
 */
export function useCreateComment(songId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CommentCreateRequest) => createComment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', songId] });
    },
  });
}

/**
 * 댓글 삭제
 */
export function useDeleteComment(songId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ commentId, userName }: { commentId: string; userName: string }) =>
      deleteComment(commentId, userName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', songId] });
    },
  });
}

