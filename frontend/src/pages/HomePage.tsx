// 홈 페이지 - 방 생성/접속

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { createJam } from '../api/jam';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Textarea } from '../components/common/Textarea';
import { Select } from '../components/common/Select';
import { EXPIRE_DAYS_OPTIONS, DEFAULT_EXPIRE_DAYS } from '../constants/config';
import { isValidJamId } from '../utils/validation';
import type { JamCreateRequest } from '../types';

export default function HomePage() {
  const navigate = useNavigate();
  
  // 접속
  const [jamIdInput, setJamIdInput] = useState('');
  const [jamIdError, setJamIdError] = useState('');
  
  // 생성
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [expireDays, setExpireDays] = useState(DEFAULT_EXPIRE_DAYS);
  const [shareLink, setShareLink] = useState('');
  
  const createMutation = useMutation({
    mutationFn: (data: JamCreateRequest) => createJam(data),
    onSuccess: (data) => {
      setShareLink(data.shareLink);
      // 클립보드에 복사
      navigator.clipboard.writeText(data.shareLink);
      // 토스트는 추후 추가
      alert('공유 링크가 클립보드에 복사되었습니다!');
    },
    onError: (error: any) => {
      alert(error.response?.data?.error || '방 생성에 실패했습니다');
    },
  });
  
  const handleJoin = () => {
    const jamId = jamIdInput.trim().toLowerCase();
    
    if (!jamId) {
      setJamIdError('방 ID를 입력해주세요');
      return;
    }
    
    if (!isValidJamId(jamId)) {
      setJamIdError('올바른 방 ID 형식이 아닙니다 (6자리 영문+숫자)');
      return;
    }
    
    setJamIdError('');
    navigate(`/${jamId}/login`);
  };
  
  const handleCreate = () => {
    createMutation.mutate({
      name: name.trim() || undefined,
      description: description.trim() || undefined,
      expireDays,
    });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* 로고 & 제목 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-500 mb-2">JamVote</h1>
          <p className="text-gray-400">밴드 합주곡, 쉽고 빠르게 정하자</p>
        </div>
        
        {/* 방 접속 */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">방 접속하기</h2>
          <div className="space-y-3">
            <Input
              placeholder="방 ID 입력 (6자리)"
              value={jamIdInput}
              onChange={(e) => {
                setJamIdInput(e.target.value);
                setJamIdError('');
              }}
              error={jamIdError}
              maxLength={6}
            />
            <Button fullWidth onClick={handleJoin}>
              접속하기
            </Button>
          </div>
        </div>
        
        {/* 구분선 */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-gray-950 text-gray-500">또는</span>
          </div>
        </div>
        
        {/* 방 생성 */}
        <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
          <h2 className="text-lg font-semibold mb-4">새 방 만들기</h2>
          <div className="space-y-4">
            <Input
              label="방 이름 (선택)"
              placeholder="예: 우리 밴드"
              value={name}
              onChange={(e) => setName(e.target.value)}
              helperText="비워두면 자동 생성된 ID가 이름이 됩니다"
              maxLength={50}
            />
            
            <Textarea
              label="설명 (선택)"
              placeholder="예: 12월 공연 준비"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={200}
            />
            
            <Select
              label="유효기간"
              value={expireDays}
              onChange={(e) => setExpireDays(Number(e.target.value))}
              options={EXPIRE_DAYS_OPTIONS}
            />
            
            <Button
              fullWidth
              onClick={handleCreate}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? '생성 중...' : '방 생성하기'}
            </Button>
          </div>
        </div>
        
        {/* 생성된 공유 링크 */}
        {shareLink && (
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-400 mb-2">
              방이 생성되었습니다!
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={shareLink}
                readOnly
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
              />
              <Button
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(shareLink);
                  alert('복사되었습니다!');
                }}
              >
                복사
              </Button>
            </div>
            <Button
              fullWidth
              variant="secondary"
              className="mt-3"
              onClick={() => {
                const jamId = shareLink.split('/').pop();
                navigate(`/${jamId}/login`);
              }}
            >
              방으로 이동
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

