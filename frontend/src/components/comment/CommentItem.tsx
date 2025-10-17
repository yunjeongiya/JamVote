// 댓글 아이템 컴포넌트

import { useState } from 'react';
import { SessionBadge } from '../song/SessionBadge';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import type { Comment } from '../../types';

interface CommentItemProps {
  comment: Comment;
  currentUserName: string;
  onDelete?: (commentId: string) => void;
}

export function CommentItem({ comment, currentUserName, onDelete }: CommentItemProps) {
  const isOwner = comment.userName === currentUserName;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    onDelete?.(comment.commentId);
    setIsDeleteModalOpen(false);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-3 space-y-2">
      {/* 작성자 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-white">
            {comment.userName}
          </span>
          {comment.sessions.length > 0 && (
            <div className="flex items-center space-x-1">
              {comment.sessions.map((session) => (
                <SessionBadge key={session} session={session} size={14} />
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString('ko-KR', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
          {isOwner && onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDelete}
              className="text-xs"
            >
              삭제
            </Button>
          )}
        </div>
      </div>
      
      {/* 댓글 내용 */}
      <p className="text-sm text-gray-200 whitespace-pre-wrap break-words">
        {comment.content}
      </p>
      
      {/* 삭제 확인 모달 */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="댓글 삭제"
        size="sm"
      >
        <div className="p-4 space-y-4">
          <p className="text-gray-300">
            댓글을 삭제하시겠습니까?
          </p>
          <div className="flex space-x-2 justify-end">
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              취소
            </Button>
            <Button
              variant="danger"
              onClick={confirmDelete}
            >
              삭제
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


