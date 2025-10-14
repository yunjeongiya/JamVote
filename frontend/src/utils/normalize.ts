// 이름 정규화 유틸리티

/**
 * 사용자 이름 정규화 (중복 체크용)
 * - 공백 제거 (trim)
 * - 소문자 변환 (toLowerCase)
 */
export function normalizeUsername(name: string): string {
  return name.trim().toLowerCase();
}

