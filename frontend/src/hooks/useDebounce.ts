// Debounce 훅 - 검색 등 빈번한 업데이트 최적화

import { useEffect, useState } from 'react';
import { DEBOUNCE_DELAY } from '../constants/config';

/**
 * 값의 업데이트를 지연시켜 불필요한 렌더링/API 호출 방지
 * @param value 디바운스할 값
 * @param delay 지연 시간 (ms)
 * @returns 디바운스된 값
 */
export function useDebounce<T>(value: T, delay: number = DEBOUNCE_DELAY): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
