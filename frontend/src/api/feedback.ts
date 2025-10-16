// 피드백(Feedback) API

import client from './client';
import type { FeedbackCreateRequest } from '../types';

/**
 * 피드백 작성
 */
export async function createFeedback(data: FeedbackCreateRequest): Promise<{ feedbackId: string; message: string }> {
  const response = await client.post('/api/feedback', data);
  return response.data;
}
