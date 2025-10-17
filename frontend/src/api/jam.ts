// 방(Jam) API

import client from './client';
import type { JamCreateRequest, JamCreateResponse, JamInfo } from '../types';

/**
 * 방 생성
 */
export async function createJam(data: JamCreateRequest): Promise<JamCreateResponse> {
  const response = await client.post('/api/jams', data);
  return response.data;
}

/**
 * 방 정보 조회
 */
export async function getJam(jamId: string): Promise<JamInfo> {
  const response = await client.get(`/api/jams/${jamId}`);
  return response.data;
}

/**
 * 방 유효기한 수정
 */
export async function updateJamExpiry(jamId: string, expireDays: number): Promise<JamInfo> {
  const response = await client.patch(`/api/jams/${jamId}/expiry`, { expireDays });
  return response.data;
}

