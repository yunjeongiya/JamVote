// 댓글(Comment) API

import client from './client';
import type { Comment, CommentCreateRequest } from '../types';

/**
 * 댓글 작성
 */
export async function createComment(data: CommentCreateRequest): Promise<Comment> {
  const response = await client.post('/api/comments', data);
  return response.data;
}

/**
 * 특정 곡의 댓글 목록 조회
 */
export async function getComments(songId: string): Promise<Comment[]> {
  const response = await client.get('/api/comments', { params: { songId } });
  return response.data.comments;
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: string, userName: string): Promise<void> {
  await client.delete(`/api/comments/${commentId}`, {
    params: { userName },
  });
}
