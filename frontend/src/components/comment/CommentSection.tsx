// 댓글 섹션 컴포넌트 (폼 + 리스트)

import { useComments, useCreateComment, useDeleteComment } from '../../hooks/useComments';
import { CommentForm } from './CommentForm';
import { CommentList } from './CommentList';

interface CommentSectionProps {
  songId: string;
  currentUserName: string;
}

export function CommentSection({ songId, currentUserName }: CommentSectionProps) {
  const { data: comments = [], isLoading } = useComments(songId);
  const createCommentMutation = useCreateComment(songId);
  const deleteCommentMutation = useDeleteComment(songId);
  
  const handleSubmit = async (content: string) => {
    try {
      await createCommentMutation.mutateAsync({
        songId,
        userName: currentUserName,
        content,
      });
    } catch (error: any) {
      alert(error.response?.data?.error || '댓글 작성에 실패했습니다');
    }
  };
  
  const handleDelete = async (commentId: string) => {
    try {
      await deleteCommentMutation.mutateAsync({
        commentId,
        userName: currentUserName,
      });
    } catch (error: any) {
      alert(error.response?.data?.error || '댓글 삭제에 실패했습니다');
    }
  };
  
  return (
    <div className="space-y-4">
      {/* 댓글 작성 폼 */}
      <div>
        <h4 className="text-sm font-semibold text-gray-300 mb-3">
          댓글 ({comments.length})
        </h4>
        <CommentForm
          onSubmit={handleSubmit}
          isSubmitting={createCommentMutation.isPending}
        />
      </div>
      
      {/* 댓글 리스트 */}
      <CommentList
        comments={comments}
        isLoading={isLoading}
        currentUserName={currentUserName}
        onDelete={handleDelete}
      />
    </div>
  );
}


