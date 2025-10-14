// 곡(Song) API

import client from './client';
import type { Song, SongCreateRequest, SongUpdateRequest } from '../types';

/**
 * 곡 추가
 */
export async function createSong(data: SongCreateRequest): Promise<Song> {
  const response = await client.post('/api/songs', data);
  return response.data;
}

/**
 * 곡 목록 조회
 */
export async function getSongs(jamId: string): Promise<Song[]> {
  const response = await client.get('/api/songs', { params: { jamId } });
  return response.data.songs;
}

/**
 * 곡 상세 조회
 */
export async function getSong(songId: string): Promise<Song> {
  const response = await client.get(`/api/songs/${songId}`);
  return response.data;
}

/**
 * 곡 수정
 */
export async function updateSong(songId: string, data: SongUpdateRequest): Promise<Song> {
  const response = await client.patch(`/api/songs/${songId}`, data);
  return response.data;
}

/**
 * 곡 삭제
 */
export async function deleteSong(songId: string, userName: string, jamId: string): Promise<void> {
  await client.delete(`/api/songs/${songId}`, {
    params: { userName, jamId },
  });
}

