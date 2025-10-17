// 사용자(User) API

import client from './client';
import type { UserCreateRequest, UserLoginRequest, UserResponse, UserUpdateRequest } from '../types';

/**
 * 프로필 생성 (회원가입)
 */
export async function createUser(data: UserCreateRequest): Promise<UserResponse> {
  const response = await client.post('/api/users', data);
  return response.data;
}

/**
 * 로그인
 */
export async function loginUser(data: UserLoginRequest): Promise<UserResponse> {
  const response = await client.post('/api/users/login', data);
  return response.data;
}

/**
 * 프로필 수정
 */
export async function updateUser(
  jamId: string,
  userName: string,
  data: UserUpdateRequest
): Promise<UserResponse> {
  const response = await client.patch(`/api/users/${jamId}/${userName}`, data);
  return response.data;
}

