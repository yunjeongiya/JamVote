// 투표(Vote) 관련 타입 정의

export type VoteType = 'like' | 'impossible';

export interface Vote {
  voteId: string;
  songId: string;
  userName: string;
  type: VoteType;
  createdAt: Date;
}

export interface VoteCreateRequest {
  songId: string;
  userName: string;
  type: VoteType;
}

export interface VoteWithUser {
  userName: string;
  sessions: string[];
  createdAt: Date;
}

export interface VoteResults {
  likes: VoteWithUser[];
  impossibles: VoteWithUser[];
}

