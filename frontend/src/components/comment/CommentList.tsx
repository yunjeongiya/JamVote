// 댓글 리스트 컴포넌트

import { CommentItem } from './CommentItem';
import { Loading } from '../common/Loading';
import type { Comment } from '../../types';

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  currentUserName: string;
  onDelete?: (commentId: string) => void;
}

export function CommentList({
  comments,
  isLoading,
  currentUserName,
  onDelete,
}: CommentListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loading size="sm" text="댓글을 불러오는 중..." />
      </div>
    );
  }
  
  if (comments.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-gray-500">첫 댓글을 남겨보세요!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          currentUserName={currentUserName}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}


