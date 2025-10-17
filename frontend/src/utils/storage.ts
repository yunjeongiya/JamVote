// localStorage 관리 유틸리티

export interface AuthData {
  userName: string;
  sessions: string[];
}

const AUTH_KEY_PREFIX = 'jam_';

/**
 * 특정 방의 인증 정보 가져오기
 */
export function getAuth(jamId: string): AuthData | null {
  try {
    const data = localStorage.getItem(`${AUTH_KEY_PREFIX}${jamId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get auth data:', error);
    return null;
  }
}

/**
 * 특정 방의 인증 정보 저장
 */
export function setAuth(jamId: string, userName: string, sessions: string[]): void {
  try {
    const data: AuthData = { userName, sessions };
    localStorage.setItem(`${AUTH_KEY_PREFIX}${jamId}`, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to set auth data:', error);
  }
}

/**
 * 특정 방의 인증 정보 삭제
 */
export function clearAuth(jamId: string): void {
  try {
    localStorage.removeItem(`${AUTH_KEY_PREFIX}${jamId}`);
  } catch (error) {
    console.error('Failed to clear auth data:', error);
  }
}

/**
 * 모든 인증 정보 삭제
 */
export function clearAllAuth(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(AUTH_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Failed to clear all auth data:', error);
  }
}

