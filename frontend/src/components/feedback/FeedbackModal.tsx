// 피드백 모달 컴포넌트

import { useState } from 'react';
import { Modal } from '../common/Modal';
import { Textarea } from '../common/Textarea';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  jamId?: string;
  userName?: string;
  onSubmit: (data: {
    rating: number;
    content: string;
    contactInfo: string;
  }) => void;
  isSubmitting: boolean;
}

export function FeedbackModal({
  isOpen,
  onClose,
  jamId,
  userName,
  onSubmit,
  isSubmitting,
}: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  
  const handleSubmit = () => {
    if (rating === 0) {
      alert('별점을 선택해주세요');
      return;
    }
    
    onSubmit({
      rating,
      content: content.trim(),
      contactInfo: contactInfo.trim(),
    });
    
    // 초기화
    setRating(0);
    setHoveredRating(0);
    setContent('');
    setContactInfo('');
  };
  
  const handleClose = () => {
    setRating(0);
    setHoveredRating(0);
    setContent('');
    setContactInfo('');
    onClose();
  };
  
  const getRatingLabel = (value: number) => {
    const labels = ['', '매우 불만', '불만', '보통', '만족', '매우 만족'];
    return labels[value] || '';
  };
  
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="피드백 보내기" size="md">
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          JamVote를 사용해주셔서 감사합니다! 여러분의 소중한 의견을 들려주세요.
        </p>
        
        {/* 별점 선택 */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            만족도 <span className="text-red-400">*</span>
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-4xl transition-all transform hover:scale-110 focus:outline-none"
              >
                <span
                  className={
                    star <= (hoveredRating || rating)
                      ? 'text-yellow-400'
                      : 'text-gray-600'
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>
          {(rating > 0 || hoveredRating > 0) && (
            <p className="text-sm text-gray-400 mt-2">
              {getRatingLabel(hoveredRating || rating)}
            </p>
          )}
        </div>
        
        {/* 피드백 내용 */}
        <div>
          <Textarea
            label="피드백 (선택)"
            placeholder="개선사항, 불편했던 점, 좋았던 점 등을 자유롭게 작성해주세요..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            maxLength={1000}
          />
          <p className="text-xs text-gray-500 mt-1">
            {content.length} / 1000
          </p>
        </div>
        
        {/* 연락처 */}
        <div>
          <Input
            label="연락처 (선택)"
            placeholder="이메일, 디스코드 ID 등"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            maxLength={100}
          />
          <p className="text-xs text-gray-500 mt-1">
            * 답변이 필요한 경우 입력해주세요
          </p>
        </div>
        
        {/* 개발자 정보 */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-xs text-gray-400">
            <strong className="text-gray-300">개발자 연락처</strong>
            <br />
            이메일: jamvote@example.com
            <br />
            GitHub: github.com/jamvote/jamvote
          </p>
        </div>
        
        {/* 제출 버튼 */}
        <div className="flex space-x-2 pt-4">
          <Button
            fullWidth
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
          >
            {isSubmitting ? '전송 중...' : '피드백 전송'}
          </Button>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
        </div>
      </div>
    </Modal>
  );
}

