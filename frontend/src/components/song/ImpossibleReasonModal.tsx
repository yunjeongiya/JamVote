// 불가능 투표 이유 입력 모달

import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';

interface ImpossibleReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  isSubmitting: boolean;
}

export function ImpossibleReasonModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: ImpossibleReasonModalProps) {
  const [reason, setReason] = useState('');
  
  const handleSubmit = () => {
    onSubmit(reason.trim());
    setReason(''); // 초기화
  };
  
  const handleSkip = () => {
    onSubmit(''); // 이유 없이 투표
    setReason('');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="불가능 투표" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          이 곡을 연주하기 어려운 이유를 입력해주세요 (선택)
        </p>
        
        <Textarea
          placeholder="예: 너무 빠른 템포, 어려운 기술 필요 등"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={500}
        />
        
        <div className="space-y-2">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '투표 중...' : '투표하기'}
          </Button>
          <Button
            fullWidth
            variant="ghost"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            이유 없이 투표
          </Button>
        </div>
      </div>
    </Modal>
  );
}


