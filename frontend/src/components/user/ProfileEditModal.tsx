// 프로필 수정 모달 컴포넌트

import { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Checkbox } from '../common/Checkbox';
import { Button } from '../common/Button';
import { SESSION_OPTIONS } from '../../constants/sessions';
import { isValidUsername, removeSpaces } from '../../utils/validation';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserName: string;
  currentSessions: string[];
  jamId: string;
  onSubmit: (data: { newName?: string; sessions: string[] }) => void;
  isSubmitting: boolean;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  currentUserName,
  currentSessions,
  jamId,
  onSubmit,
  isSubmitting,
}: ProfileEditModalProps) {
  const [newName, setNewName] = useState(currentUserName);
  const [sessions, setSessions] = useState<string[]>(currentSessions);
  const [nameError, setNameError] = useState('');
  
  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setNewName(currentUserName);
      setSessions(currentSessions);
      setNameError('');
    }
  }, [isOpen, currentUserName, currentSessions]);
  
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = removeSpaces(e.target.value); // 공백 자동 제거
    setNewName(value);
    
    if (value.length > 0 && !isValidUsername(value)) {
      setNameError('이름은 1~20자 사이여야 하며 공백을 포함할 수 없습니다');
    } else {
      setNameError('');
    }
  };
  
  const handleSessionToggle = (session: string) => {
    if (sessions.includes(session)) {
      setSessions(sessions.filter(s => s !== session));
    } else {
      setSessions([...sessions, session]);
    }
  };
  
  const handleSubmit = () => {
    const trimmedName = newName.trim();
    
    // 변경사항이 있는지 확인
    const nameChanged = trimmedName !== currentUserName;
    const sessionsChanged = JSON.stringify(sessions) !== JSON.stringify(currentSessions);
    
    if (!nameChanged && !sessionsChanged) {
      alert('변경사항이 없습니다');
      return;
    }
    
    onSubmit({
      newName: nameChanged ? trimmedName : undefined,
      sessions,
    });
  };
  
  const isValid = newName.trim().length > 0 && !nameError;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="프로필 수정" size="md">
      <div className="space-y-4">
        {/* 이름 변경 */}
        <div>
          <Input
            label="이름"
            value={newName}
            onChange={handleNameChange}
            placeholder="이름을 입력하세요"
            maxLength={20}
            required
            error={nameError}
          />
          <p className="text-xs text-gray-500 mt-1">
            * 공백은 자동으로 제거됩니다
          </p>
        </div>
        
        {/* 세션 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            세션 (선택)
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
          </div>
        </div>
        
        {/* 제출 버튼 */}
        <div className="flex space-x-2 pt-4">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? '수정 중...' : '수정 완료'}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}


