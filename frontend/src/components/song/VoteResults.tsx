// 투표 결과 표시 컴포넌트 (프로필뱃지 나열 방식)

import { SessionBadge } from './SessionBadge';
import type { VoteWithUser } from '../../types';

interface VoteResultsProps {
  likes: VoteWithUser[];
  impossibles: VoteWithUser[];
}

// 프로필 뱃지 컴포넌트
function ProfileBadge({ userName, sessions }: { userName: string; sessions: string[] }) {
  return (
    <div className="inline-flex items-center space-x-1.5 bg-gray-800 rounded-full px-3 py-1.5 border border-gray-700">
      <span className="text-sm text-white">{userName}</span>
      {sessions.length > 0 && (
        <div className="flex items-center space-x-0.5">
          {sessions.map((session) => (
            <SessionBadge key={session} session={session} size={14} />
          ))}
        </div>
      )}
    </div>
  );
}

export function VoteResults({ likes, impossibles }: VoteResultsProps) {
  if (likes.length === 0 && impossibles.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        아직 투표가 없습니다
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* 좋아요 */}
      {likes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-blue-400 mb-2">
            👍 좋아요 ({likes.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {likes.map((vote, index) => (
              <ProfileBadge
                key={index}
                userName={vote.userName}
                sessions={vote.sessions}
              />
            ))}
          </div>
        </div>
      )}
      
      {/* 어려워요 */}
      {impossibles.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-red-400 mb-2">
            ❌ 어려워요 ({impossibles.length})
          </h4>
          <div className="flex flex-wrap gap-2">
            {impossibles.map((vote, index) => (
              <ProfileBadge
                key={index}
                userName={vote.userName}
                sessions={vote.sessions}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


