// 방(Jam) 관련 타입 정의

export interface Jam {
  jamId: string;
  name: string;
  description?: string;
  createdAt: Date;
  expireAt: Date;
}

export interface JamCreateRequest {
  name?: string;
  description?: string;
  expireDays: number; // 7, 15, 30, 60, 90
}

export interface JamCreateResponse {
  jamId: string;
  name: string;
  description?: string;
  expireAt: Date;
  shareLink: string;
}

export interface JamInfo {
  jamId: string;
  name: string;
  description?: string;
  createdAt: Date;
  expireAt: Date;
  daysRemaining: number;
}

