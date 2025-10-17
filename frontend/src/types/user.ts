// 사용자(User) 관련 타입 정의

export interface User {
  userName: string;
  sessions: string[];
}

export interface UserCreateRequest {
  jamId: string;
  name: string;
  password?: string;
  sessions: string[];
}

export interface UserLoginRequest {
  jamId: string;
  name: string;
  password?: string;
}

export interface UserResponse {
  userName: string;
  sessions: string[];
  token?: string;
}

export interface UserUpdateRequest {
  newName?: string;
  sessions?: string[];
}

