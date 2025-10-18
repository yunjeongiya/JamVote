// 앱 설정 상수

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || '';

export const EXPIRE_DAYS_OPTIONS = [
  { value: 7, label: '7일' },
  { value: 15, label: '15일' },
  { value: 30, label: '30일' },
  { value: 60, label: '60일' },
  { value: 90, label: '90일' },
];

export const DEFAULT_EXPIRE_DAYS = 30;

export const DEVELOPER_EMAIL = 'yunjeongiya@gmail.com';
export const DEVELOPER_GITHUB = 'yunjeongiya';

export const SHARE_LINK_BASE = 'https://jamvote.app';

