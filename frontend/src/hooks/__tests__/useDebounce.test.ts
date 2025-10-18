// useDebounce 훅 테스트

import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useDebounce } from '../useDebounce';
import { DEBOUNCE_DELAY } from '../../constants/config';

describe('useDebounce', () => {
  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce value changes', async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update value
    rerender({ value: 'updated', delay: 500 });
    expect(result.current).toBe('initial'); // Still initial

    // Wait for debounce
    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: 600 }
    );
  });

  it('should use default delay from config', async () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value), {
      initialProps: { value: 'initial' },
    });

    rerender({ value: 'updated' });

    await waitFor(
      () => {
        expect(result.current).toBe('updated');
      },
      { timeout: DEBOUNCE_DELAY + 100 }
    );
  });

  it('should cancel previous timeout on rapid changes', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'initial' } }
    );

    // Rapid updates
    rerender({ value: 'update1' });
    rerender({ value: 'update2' });
    rerender({ value: 'update3' });

    // Should only update to the last value
    await waitFor(
      () => {
        expect(result.current).toBe('update3');
      },
      { timeout: 400 }
    );
  });

  it('should handle different types', async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 42 } }
    );

    expect(result.current).toBe(42);

    rerender({ value: 100 });

    await waitFor(
      () => {
        expect(result.current).toBe(100);
      },
      { timeout: 400 }
    );
  });

  it('should handle objects', async () => {
    const initialObj = { name: 'John', age: 30 };
    const updatedObj = { name: 'Jane', age: 25 };

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: initialObj } }
    );

    expect(result.current).toEqual(initialObj);

    rerender({ value: updatedObj });

    await waitFor(
      () => {
        expect(result.current).toEqual(updatedObj);
      },
      { timeout: 400 }
    );
  });
});
