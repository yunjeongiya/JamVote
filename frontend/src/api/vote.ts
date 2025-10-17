// 투표(Vote) API

import client from './client';
import type { Vote, VoteCreateRequest, VoteResults } from '../types';

/**
 * 투표 생성/변경
 */
export async function createVote(data: VoteCreateRequest): Promise<Vote> {
  const response = await client.post('/api/votes', data);
  return response.data;
}

/**
 * 투표 취소
 */
export async function deleteVote(voteId: string): Promise<void> {
  await client.delete(`/api/votes/${voteId}`);
}

/**
 * 특정 곡의 투표 목록 조회
 */
export async function getVotes(songId: string): Promise<VoteResults> {
  const response = await client.get('/api/votes', { params: { songId } });
  return response.data;
}

