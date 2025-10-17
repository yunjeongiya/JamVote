// 유효성 검증 유틸리티

/**
 * 방 ID 유효성 검증 (6자리 영문+숫자)
 */
export function isValidJamId(jamId: string): boolean {
  return /^[a-z0-9]{6}$/.test(jamId);
}

/**
 * 사용자 이름 유효성 검증 (공백 불가)
 */
export function isValidUsername(name: string): boolean {
  const trimmed = name.trim();
  // 길이 체크 및 공백 포함 여부 체크
  return trimmed.length >= 1 && trimmed.length <= 20 && !/\s/.test(trimmed);
}

/**
 * 이름에서 공백 제거
 */
export function removeSpaces(name: string): string {
  return name.replace(/\s/g, '');
}

/**
 * YouTube URL 유효성 검증
 */
export function isValidYouTubeUrl(url: string): boolean {
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
  ];
  
  return patterns.some(pattern => pattern.test(url));
}

/**
 * YouTube URL에서 비디오 ID 추출
 */
export function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]+)/,
    /(?:youtu\.be\/)([\w-]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * 비밀번호 유효성 검증 (4자리 이상)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 4;
}

/**
 * 난이도 값 유효성 검증 (1~5)
 */
export function isValidDifficulty(difficulty: number): boolean {
  return difficulty >= 1 && difficulty <= 5;
}

/**
 * 별점 값 유효성 검증 (1~5)
 */
export function isValidRating(rating: number): boolean {
  return rating >= 1 && rating <= 5;
}

