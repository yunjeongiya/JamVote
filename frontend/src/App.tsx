import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import JamPage from './pages/JamPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-gray-100">
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
      </div>
    </BrowserRouter>
  );
}

export default App;
