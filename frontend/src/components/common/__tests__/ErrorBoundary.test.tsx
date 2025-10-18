// ErrorBoundary 컴포넌트 테스트

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';

// 에러를 발생시키는 컴포넌트
function ThrowError({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
}

describe('ErrorBoundary', () => {
  // 콘솔 에러 억제
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('should render children when no error', () => {
    render(
      <ErrorBoundary>
        <div>Child component</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Child component')).toBeInTheDocument();
  });

  it('should render error UI when error occurs', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/앗! 문제가 발생했습니다/i)).toBeInTheDocument();
    expect(screen.getByText(/예기치 않은 오류가 발생했습니다/i)).toBeInTheDocument();
  });

  it('should show error details in development mode', () => {
    const originalEnv = import.meta.env.DEV;
    import.meta.env.DEV = true;

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Test error')).toBeInTheDocument();

    import.meta.env.DEV = originalEnv;
  });

  it('should have retry button that resets error', async () => {
    const user = userEvent.setup();
    let shouldThrow = true;

    // Create a component that reads from the closure variable
    function DynamicThrowError() {
      if (shouldThrow) {
        throw new Error('Test error');
      }
      return <div>No error</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <DynamicThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/앗! 문제가 발생했습니다/i)).toBeInTheDocument();

    // Change the throwing behavior before clicking retry
    shouldThrow = false;

    const retryButton = screen.getByText('다시 시도');
    await user.click(retryButton);

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should have home button', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    const homeButton = screen.getByText('홈으로 돌아가기');
    expect(homeButton).toBeInTheDocument();
  });

  it('should use custom fallback when provided', () => {
    const customFallback = (error: Error, reset: () => void) => (
      <div>
        <p>Custom error: {error.message}</p>
        <button onClick={reset}>Custom reset</button>
      </div>
    );

    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom error: Test error')).toBeInTheDocument();
    expect(screen.getByText('Custom reset')).toBeInTheDocument();
  });

  it('should log error with componentDidCatch', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});
