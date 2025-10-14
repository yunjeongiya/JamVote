// 곡(Song) 관련 타입 정의

export interface Song {
  songId: string;
  jamId: string;
  proposerName: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  title: string;
  artist: string;
  duration: string;
  thumbnailUrl: string;
  genre?: string;
  requiredSessions: string[];
  sessionDifficulties: Record<string, number>; // { '보컬': 3, '기타': 4 }
  allowEditByOthers: boolean;
  createdAt: Date;
  likesCount?: number;
  impossibleCount?: number;
}

export interface SongCreateRequest {
  jamId: string;
  proposerName: string;
  youtubeUrl: string;
  title: string;
  artist: string;
  duration: string;
  thumbnailUrl: string;
  genre?: string;
  requiredSessions: string[];
  sessionDifficulties: Record<string, number>;
  allowEditByOthers: boolean;
}

export interface SongUpdateRequest {
  userName: string;
  title?: string;
  artist?: string;
  genre?: string;
  requiredSessions?: string[];
  sessionDifficulties?: Record<string, number>;
}

export interface YouTubeSearchResult {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  duration?: string;
}

