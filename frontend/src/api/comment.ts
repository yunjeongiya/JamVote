// 댓글(Comment) API

import client from './client';
import type { Comment, CommentCreateRequest, CommentUpdateRequest } from '../types';

/**
 * 댓글 작성
 */
export async function createComment(data: CommentCreateRequest): Promise<Comment> {
  const response = await client.post('/api/comments', data);
  return response.data;
}

/**
 * 댓글 목록 조회
 */
export async function getComments(songId: string): Promise<Comment[]> {
  const response = await client.get('/api/comments', { params: { songId } });
  return response.data.comments;
}

/**
 * 댓글 수정
 */
export async function updateComment(
  commentId: string,
  data: CommentUpdateRequest
): Promise<Comment> {
  const response = await client.patch(`/api/comments/${commentId}`, data);
  return response.data;
}

/**
 * 댓글 삭제
 */
export async function deleteComment(commentId: string, writerName: string): Promise<void> {
  await client.delete(`/api/comments/${commentId}`, {
    params: { writerName },
  });
}

