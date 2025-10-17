// 세션 관련 상수

export const SESSION_TYPES = {
  VOCAL: '보컬',
  GUITAR: '기타',
  BASS: '베이스',
  DRUMS: '드럼',
  KEYBOARD: '키보드',
  OTHER: '기타',
} as const;

export const SESSION_OPTIONS = [
  SESSION_TYPES.VOCAL,
  SESSION_TYPES.GUITAR,
  SESSION_TYPES.BASS,
  SESSION_TYPES.DRUMS,
  SESSION_TYPES.KEYBOARD,
];

export const DIFFICULTY_LEVELS = {
  1: '매우 쉬움',
  2: '쉬움',
  3: '보통',
  4: '어려움',
  5: '매우 어려움',
} as const;

