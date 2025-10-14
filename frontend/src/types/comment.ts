// 댓글(Comment) 관련 타입 정의

export interface Comment {
  commentId: string;
  songId: string;
  writerName: string;
  sessionInfo: string[];
  content: string;
  createdAt: Date;
}

export interface CommentCreateRequest {
  songId: string;
  writerName: string;
  sessionInfo: string[];
  content: string;
}

export interface CommentUpdateRequest {
  writerName: string;
  content: string;
}

