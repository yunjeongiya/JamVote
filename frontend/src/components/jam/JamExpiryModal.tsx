// 방 유효기한 연장 모달

import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

interface JamExpiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDaysRemaining: number;
  onSubmit: (expireDays: number) => void;
  isSubmitting: boolean;
}

const EXTEND_OPTIONS = [
  { days: 7, label: '7일 연장' },
  { days: 14, label: '14일 연장' },
  { days: 30, label: '30일 연장' },
  { days: 90, label: '90일 연장' },
];

export function JamExpiryModal({
  isOpen,
  onClose,
  currentDaysRemaining,
  onSubmit,
  isSubmitting,
}: JamExpiryModalProps) {
  const [selectedDays, setSelectedDays] = useState<number | null>(null);
  
  const handleSubmit = () => {
    if (selectedDays === null) {
      alert('연장 기간을 선택해주세요');
      return;
    }
    
    // 현재 남은 일수 + 연장 일수
    const totalDays = currentDaysRemaining + selectedDays;
    
    if (totalDays > 365) {
      alert('최대 365일까지만 연장할 수 있습니다');
      return;
    }
    
    onSubmit(totalDays);
    setSelectedDays(null);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="유효기한 연장" size="sm">
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-400 mb-4">
            현재 남은 기간: <span className="text-white font-semibold">{currentDaysRemaining}일</span>
          </p>
          
          <label className="block text-sm font-medium text-gray-300 mb-3">
            연장 기간 선택
          </label>
          
          <div className="space-y-2">
            {EXTEND_OPTIONS.map((option) => {
              const newTotal = currentDaysRemaining + option.days;
              const isDisabled = newTotal > 365;
              
              return (
                <button
                  key={option.days}
                  onClick={() => !isDisabled && setSelectedDays(option.days)}
                  disabled={isDisabled}
                  className={`w-full p-3 rounded-lg border text-left transition-colors ${
                    selectedDays === option.days
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : isDisabled
                      ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed'
                      : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    <span className="text-sm">
                      {isDisabled ? '최대 초과' : `→ 총 ${newTotal}일`}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          
          <p className="text-xs text-gray-500 mt-3">
            * 최대 365일까지 연장할 수 있습니다
          </p>
        </div>
        
        {/* 제출 버튼 */}
        <div className="flex space-x-2 pt-4">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={selectedDays === null || isSubmitting}
          >
            {isSubmitting ? '연장 중...' : '연장하기'}
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


