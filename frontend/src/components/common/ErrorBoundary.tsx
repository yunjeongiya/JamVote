// Error Boundary 컴포넌트 - React 에러 캐치

import { Component, ReactNode, ErrorInfo } from 'react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, resetError: () => void) => ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // 에러 로깅 (추후 Sentry 등으로 전송)
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // TODO: 프로덕션 환경에서는 에러 리포팅 서비스로 전송
    // if (import.meta.env.PROD) {
    //   Sentry.captureException(error, { extra: errorInfo });
    // }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // 커스텀 fallback이 제공된 경우
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.resetError);
      }

      // 기본 에러 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
          <div className="max-w-md w-full bg-gray-900 rounded-lg border border-gray-800 p-8 text-center">
            <div className="mb-4">
              <span className="text-6xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              앗! 문제가 발생했습니다
            </h1>
            <p className="text-gray-400 mb-6">
              예기치 않은 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-gray-800 rounded text-left overflow-auto max-h-40">
                <p className="text-sm font-mono text-red-400">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="text-xs text-gray-500 mt-2 overflow-auto">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="space-y-3">
              <Button onClick={this.resetError} fullWidth>
                다시 시도
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/'}
                fullWidth
              >
                홈으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
