// 곡 관련 훅

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSongs, getSong, createSong, updateSong, deleteSong } from '../api/song';
import type { SongCreateRequest, SongUpdateRequest } from '../types';

/**
 * 곡 목록 조회
 */
export function useSongs(jamId: string) {
  return useQuery({
    queryKey: ['songs', jamId],
    queryFn: () => getSongs(jamId),
    enabled: !!jamId,
  });
}

/**
 * 곡 상세 조회
 */
export function useSong(songId: string) {
  return useQuery({
    queryKey: ['song', songId],
    queryFn: () => getSong(songId),
    enabled: !!songId,
  });
}

/**
 * 곡 추가
 */
export function useCreateSong(jamId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SongCreateRequest) => createSong(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
  });
}

/**
 * 곡 수정
 */
export function useUpdateSong(jamId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ songId, data }: { songId: string; data: SongUpdateRequest }) =>
      updateSong(songId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
  });
}

/**
 * 곡 삭제
 */
export function useDeleteSong(jamId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ songId, userName }: { songId: string; userName: string }) =>
      deleteSong(songId, userName, jamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['songs', jamId] });
    },
  });
}

