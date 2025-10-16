// 404 페이지

import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';

export default function NotFoundPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-400 mb-8">
          요청하신 페이지가 존재하지 않거나 삭제되었습니다.
        </p>
        <Button onClick={() => navigate('/')}>
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
}

