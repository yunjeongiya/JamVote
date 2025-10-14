// 피드백(Feedback) API

import client from './client';
import type { FeedbackCreateRequest, FeedbackCreateResponse } from '../types';

/**
 * 피드백 전송
 */
export async function createFeedback(data: FeedbackCreateRequest): Promise<FeedbackCreateResponse> {
  const response = await client.post('/api/feedback', data);
  return response.data;
}

