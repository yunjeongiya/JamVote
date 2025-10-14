// 피드백(Feedback) 관련 타입 정의

export interface Feedback {
  feedbackId: string;
  jamId?: string;
  userName?: string;
  content: string;
  rating?: number; // 1~5
  createdAt: Date;
}

export interface FeedbackCreateRequest {
  jamId?: string;
  userName?: string;
  content: string;
  rating?: number;
}

export interface FeedbackCreateResponse {
  feedbackId: string;
  success: boolean;
}

