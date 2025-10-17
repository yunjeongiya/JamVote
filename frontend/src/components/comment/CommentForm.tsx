// 댓글 작성 폼 컴포넌트

import { useState } from 'react';
import { Textarea } from '../common/Textarea';
import { Button } from '../common/Button';

interface CommentFormProps {
  onSubmit: (content: string) => void;
  isSubmitting: boolean;
}

export function CommentForm({ onSubmit, isSubmitting }: CommentFormProps) {
  const [content, setContent] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (content.trim().length === 0) {
      return;
    }
    
    onSubmit(content.trim());
    setContent(''); // 초기화
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Textarea
        placeholder="댓글을 입력하세요..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        maxLength={500}
        disabled={isSubmitting}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {content.length} / 500
        </span>
        <Button
          type="submit"
          disabled={content.trim().length === 0 || isSubmitting}
          size="sm"
        >
          {isSubmitting ? '작성 중...' : '댓글 작성'}
        </Button>
      </div>
    </form>
  );
}


