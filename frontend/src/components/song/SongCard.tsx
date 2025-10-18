// 곡 카드 컴포넌트

import { useState } from 'react';
import type { Song, VoteResults as VoteResultsType } from '../../types';
import { VoteButton } from './VoteButton';
import { SessionBadge } from './SessionBadge';
import { YouTubePlayer } from './YouTubePlayer';
import { VoteResults } from './VoteResults';
import { CommentSection } from '../comment/CommentSection';
import { Button } from '../common/Button';
import { Loading } from '../common/Loading';
import { ConfirmModal } from '../common/ConfirmModal';

interface SongCardProps {
  song: Song;
  currentUserName: string;
  onVote: (songId: string, type: 'like' | 'impossible') => void;
  onEdit?: (song: Song) => void;
  onDelete?: (songId: string) => void;
  userVoteType?: 'like' | 'impossible' | null;
  voteResults?: VoteResultsType;
  isLoadingVotes?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function SongCard({
  song,
  currentUserName,
  onVote,
  onEdit,
  onDelete,
  userVoteType,
  voteResults,
  isLoadingVotes,
  isExpanded = false,
  onToggleExpand,
}: SongCardProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const canEdit = song.allowEditByOthers || song.proposerName === currentUserName;
  const canDelete = song.proposerName === currentUserName;

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(song.songId);
    setIsDeleteModalOpen(false);
  };
  
  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      {/* 기본 정보 */}
      <div className="p-4">
        <div className="flex items-start space-x-4">
          {/* 펼치기 버튼 */}
          <button
            onClick={onToggleExpand}
            className="text-gray-400 hover:text-white transition-colors mt-1 text-sm"
          >
            {isExpanded ? '∨' : '>'}
          </button>
          
          {/* 썸네일 */}
          <img
            src={song.thumbnailUrl}
            alt={song.title}
            className="w-24 h-16 object-cover rounded"
          />
          
          {/* 곡 정보 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{song.title}</h3>
            <p className="text-sm text-gray-400 truncate">{song.artist}</p>
            <div className="flex items-center space-x-2 mt-2">
              {song.requiredSessions.map((session) => (
                <SessionBadge key={session} session={session} size={16} />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              제안: {song.proposerName} • {song.duration}
            </p>
          </div>
          
          {/* 투표 버튼 */}
          <div className="flex items-center space-x-2">
            <VoteButton
              type="like"
              count={song.likesCount || 0}
              isActive={userVoteType === 'like'}
              onClick={() => onVote(song.songId, 'like')}
            />
            <VoteButton
              type="impossible"
              count={song.impossibleCount || 0}
              isActive={userVoteType === 'impossible'}
              onClick={() => onVote(song.songId, 'impossible')}
            />
          </div>
        </div>
      </div>
      
      {/* 펼쳐진 상태 */}
      {isExpanded && (
        <div className="border-t border-gray-800 p-4 space-y-4">
          {/* YouTube 플레이어 */}
          <YouTubePlayer videoId={song.youtubeVideoId} />
          
          {/* 장르 */}
          {song.genre && (
            <div>
              <span className="text-sm text-gray-400">장르: </span>
              <span className="text-sm text-white">{song.genre}</span>
            </div>
          )}
          
          {/* 세션별 난이도 */}
          {Object.keys(song.sessionDifficulties).length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">세션별 난이도</h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(song.sessionDifficulties).map(([session, difficulty]) => (
                  <div key={session} className="flex items-center justify-between">
                    <SessionBadge session={session} size={16} />
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`w-2 h-2 rounded-full ${
                            level <= difficulty ? 'bg-blue-500' : 'bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* 투표 결과 */}
          {voteResults && (
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-3">투표 결과</h4>
              {isLoadingVotes ? (
                <div className="flex justify-center py-4">
                  <Loading size="sm" />
                </div>
              ) : (
                <VoteResults
                  likes={voteResults.likes}
                  impossibles={voteResults.impossibles}
                />
              )}
            </div>
          )}
          
          {/* 댓글 섹션 */}
          <div className="border-t border-gray-700 pt-4">
            <CommentSection
              songId={song.songId}
              currentUserName={currentUserName}
            />
          </div>
          
          {/* 수정/삭제 버튼 */}
          <div className="flex items-center space-x-2">
            {canEdit && onEdit && (
              <Button size="sm" variant="secondary" onClick={() => onEdit(song)}>
                수정
              </Button>
            )}
            {canDelete && onDelete && (
              <Button size="sm" variant="danger" onClick={handleDeleteClick}>
                삭제
              </Button>
            )}
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="곡 삭제"
        message={`정말 "${song.title}"을(를) 삭제하시겠습니까?`}
        confirmText="삭제"
        confirmVariant="danger"
      />
    </div>
  );
}

