// 방 메인 페이지 (임시)

import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getJam } from '../api/jam';
import { getAuth } from '../utils/storage';
import { Loading } from '../components/common/Loading';
import { Button } from '../components/common/Button';

export default function JamPage() {
  const { jamId } = useParams<{ jamId: string }>();
  const navigate = useNavigate();
  
  // 인증 확인
  useEffect(() => {
    if (jamId) {
      const auth = getAuth(jamId);
      if (!auth) {
        // 로그인 안 되어 있으면 로그인 페이지로
        navigate(`/${jamId}/login`);
      }
    }
  }, [jamId, navigate]);
  
  // 방 정보 조회
  const { data: jamInfo, isLoading } = useQuery({
    queryKey: ['jam', jamId],
    queryFn: () => getJam(jamId!),
    enabled: !!jamId,
  });
  
  const auth = jamId ? getAuth(jamId) : null;
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="방 정보를 불러오는 중..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* 임시 헤더 */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800 mb-6">
          <h1 className="text-2xl font-bold text-blue-500 mb-2">
            {jamInfo?.name}
          </h1>
          {jamInfo?.description && (
            <p className="text-gray-400 mb-4">{jamInfo.description}</p>
          )}
          <div className="flex items-center justify-between text-sm">
            <div>
              <span className="text-gray-500">로그인:</span>{' '}
              <span className="text-white">{auth?.userName}</span>
              {auth?.sessions && auth.sessions.length > 0 && (
                <>
                  {' '}
                  <span className="text-gray-500">
                    ({auth.sessions.join(', ')})
                  </span>
                </>
              )}
            </div>
            <div>
              <span className="text-gray-500">유효기한:</span>{' '}
              <span className="text-white">{jamInfo?.daysRemaining}일 남음</span>
            </div>
          </div>
        </div>
        
        {/* 임시 내용 */}
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-4">
            방 메인 화면 (개발 예정)
          </h2>
          <p className="text-gray-400 mb-6">
            곡 검색, 투표, 댓글 기능이 여기에 구현됩니다.
          </p>
          <Button onClick={() => navigate('/')}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}

