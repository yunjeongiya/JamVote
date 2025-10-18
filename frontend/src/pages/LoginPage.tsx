// 로그인/프로필 생성 페이지

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getJam } from '../api/jam';
import { createUser, loginUser } from '../api/user';
import { getAuth, setAuth } from '../utils/storage';
import { removeSpaces } from '../utils/validation';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Checkbox } from '../components/common/Checkbox';
import { Loading } from '../components/common/Loading';
import { SESSION_OPTIONS } from '../constants/sessions';

export default function LoginPage() {
  const { jamId } = useParams<{ jamId: string }>();
  const navigate = useNavigate();
  
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [sessions, setSessions] = useState<string[]>([]);
  const [customSession, setCustomSession] = useState('');
  
  // 방 정보 조회
  const { data: jamInfo, isLoading: jamLoading, error: jamError } = useQuery({
    queryKey: ['jam', jamId],
    queryFn: () => getJam(jamId!),
    enabled: !!jamId,
  });
  
  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    if (jamId) {
      const auth = getAuth(jamId);
      if (auth) {
        // 이미 로그인되어 있으면 방으로 이동
        navigate(`/${jamId}`);
      }
    }
  }, [jamId, navigate]);
  
  // 로그인 mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAuth(jamId!, data.userName, data.sessions);
      navigate(`/${jamId}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '로그인에 실패했습니다');
    },
  });
  
  // 프로필 생성 mutation
  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (data) => {
      setAuth(jamId!, data.userName, data.sessions);
      navigate(`/${jamId}`);
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '프로필 생성에 실패했습니다');
    },
  });
  
  const handleSessionToggle = (session: string) => {
    setSessions(prev =>
      prev.includes(session)
        ? prev.filter(s => s !== session)
        : [...prev, session]
    );
  };
  
  const handleAddCustomSession = () => {
    const trimmed = customSession.trim();
    if (trimmed && !sessions.includes(trimmed)) {
      setSessions(prev => [...prev, trimmed]);
      setCustomSession('');
    }
  };
  
  const handleSubmit = () => {
    const trimmedName = name.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedName) {
      alert('이름을 입력해주세요');
      return;
    }
    
    if (/\s/.test(trimmedName)) {
      alert('이름에 공백을 포함할 수 없습니다');
      return;
    }
    
    // 비밀번호가 입력되었으면 4자 이상이어야 함
    if (trimmedPassword && trimmedPassword.length < 4) {
      alert('비밀번호는 최소 4자 이상이어야 합니다');
      return;
    }
    
    if (isCreateMode) {
      createMutation.mutate({
        jamId: jamId!,
        name: trimmedName,
        password: trimmedPassword || undefined,
        sessions,
      });
    } else {
      loginMutation.mutate({
        jamId: jamId!,
        name: trimmedName,
        password: trimmedPassword || undefined,
      });
    }
  };
  
  // 로딩 상태
  if (jamLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading text="방 정보를 불러오는 중..." />
      </div>
    );
  }
  
  // 에러 처리
  if (jamError) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2 text-red-400">오류</h2>
          <p className="text-gray-400 mb-6">
            {(jamError as any).response?.data?.error || '방 정보를 불러올 수 없습니다'}
          </p>
          <Button onClick={() => navigate('/')}>
            홈으로 돌아가기
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* 방 정보 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-500 mb-1">
            {jamInfo?.name}
          </h1>
          {jamInfo?.description && (
            <p className="text-gray-400 text-sm">{jamInfo.description}</p>
          )}
          <p className="text-gray-500 text-xs mt-2">
            방 ID: {jamId}
          </p>
        </div>
        
        {/* 로그인/프로필 생성 폼 */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">
            {isCreateMode ? '새 프로필 만들기' : '로그인'}
          </h2>
          
          <div className="space-y-4">
            <Input
              label="이름"
              placeholder="이름 입력 (공백 불가)"
              value={name}
              onChange={(e) => setName(removeSpaces(e.target.value))}
              maxLength={20}
              required
            />
            
            <Input
              label="비밀번호 (선택)"
              type="password"
              placeholder="비밀번호 (최소 4자)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              helperText="비밀번호를 설정하지 않으면 이름만으로 입장할 수 있습니다 (설정 시 최소 4자)"
            />
            
            {/* 프로필 생성 모드에서만 세션 선택 */}
            {isCreateMode && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  세션 선택 (선택)
                </label>
                <div className="space-y-2">
                  {SESSION_OPTIONS.map((session) => (
                    <Checkbox
                      key={session}
                      label={session}
                      checked={sessions.includes(session)}
                      onChange={() => handleSessionToggle(session)}
                    />
                  ))}
                  
                  {/* 직접 입력 */}
                  <div className="flex items-center space-x-2 mt-3">
                    <Input
                      placeholder="기타 (직접 입력)"
                      value={customSession}
                      onChange={(e) => setCustomSession(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddCustomSession();
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddCustomSession}
                      disabled={!customSession.trim()}
                    >
                      추가
                    </Button>
                  </div>
                  
                  {/* 선택된 커스텀 세션 */}
                  {sessions.filter(s => !SESSION_OPTIONS.includes(s)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {sessions
                        .filter(s => !SESSION_OPTIONS.includes(s))
                        .map((session) => (
                          <span
                            key={session}
                            className="px-2 py-1 bg-blue-900/30 text-blue-300 text-sm rounded-md flex items-center space-x-1"
                          >
                            <span>{session}</span>
                            <button
                              onClick={() => setSessions(prev => prev.filter(s => s !== session))}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <Button
              fullWidth
              onClick={handleSubmit}
              disabled={loginMutation.isPending || createMutation.isPending}
            >
              {isCreateMode
                ? createMutation.isPending
                  ? '생성 중...'
                  : '프로필 생성하고 입장'
                : loginMutation.isPending
                ? '로그인 중...'
                : '로그인'}
            </Button>
            
            {/* 모드 전환 버튼 */}
            <button
              onClick={() => setIsCreateMode(!isCreateMode)}
              className="w-full text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isCreateMode ? '이미 계정이 있으신가요? 로그인' : '새 프로필 만들기'}
            </button>
          </div>
        </div>
        
        <button
          onClick={() => navigate('/')}
          className="w-full text-center text-sm text-gray-500 hover:text-gray-400 transition-colors"
        >
          ← 홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}

