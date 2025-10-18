import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Loading } from './components/common/Loading';

// Code Splitting - 페이지별 lazy loading
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const JamPage = lazy(() => import('./pages/JamPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-950 text-gray-100">
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center">
                <Loading text="페이지를 불러오는 중..." />
              </div>
            }
          >
            <Routes>
              {/* 홈 - 방 생성/접속 */}
              <Route path="/" element={<HomePage />} />

              {/* 방 로그인 */}
              <Route path="/:jamId/login" element={<LoginPage />} />

              {/* 방 메인 화면 */}
              <Route path="/:jamId" element={<JamPage />} />

              {/* 404 */}
              <Route path="/404" element={<NotFoundPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
