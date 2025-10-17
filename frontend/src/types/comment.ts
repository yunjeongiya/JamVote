// 댓글(Comment) 관련 타입 정의

export interface Comment {
  commentId: string;
  songId: string;
  userName: string;
  sessions: string[]; // User's sessions
  content: string;
  createdAt: Date;
}

export interface CommentCreateRequest {
  songId: string;
  userName: string;
  content: string;
}

