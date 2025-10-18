// Axios 클라이언트 설정

import axios from 'axios';
import { API_URL, API_TIMEOUT } from '../constants/config';

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT,
});

// 요청 인터셉터
client.interceptors.request.use(
  (config) => {
    // 추후 인증 토큰 추가 가능
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
client.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 에러 처리
    const message = error.response?.data?.error || '요청에 실패했습니다';
    console.error('API Error:', message);
    
    // 에러를 그대로 throw (각 컴포넌트에서 처리)
    return Promise.reject(error);
  }
);

export default client;

