// 투표 결과 표시 컴포넌트

import { SessionBadge } from './SessionBadge';
import type { VoteWithUser } from '../../types';

interface VoteResultsProps {
  likes: VoteWithUser[];
  impossibles: VoteWithUser[];
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
          <div className="space-y-2">
            {likes.map((vote, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <span className="text-white">{vote.userName}</span>
                {vote.sessions.length > 0 && (
                  <div className="flex items-center space-x-1">
                    {vote.sessions.map((session) => (
                      <SessionBadge key={session} session={session} size={16} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 불가능 */}
      {impossibles.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-red-400 mb-2">
            ❌ 불가능 ({impossibles.length})
          </h4>
          <div className="space-y-3">
            {impossibles.map((vote, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center space-x-2 text-sm">
                  <span className="text-white">{vote.userName}</span>
                  {vote.sessions.length > 0 && (
                    <div className="flex items-center space-x-1">
                      {vote.sessions.map((session) => (
                        <SessionBadge key={session} session={session} size={16} />
                      ))}
                    </div>
                  )}
                </div>
                {vote.reason && (
                  <p className="text-xs text-gray-400 pl-4">
                    💬 {vote.reason}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

