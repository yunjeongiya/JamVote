// JamPage 헤더 컴포넌트

interface JamHeaderProps {
  jamId: string;
  jamName: string;
  jamDescription?: string;
  daysRemaining: number;
  userName: string;
  userSessions: string[];
  onExpiryClick: () => void;
  onProfileClick: () => void;
  onLogout: () => void;
  onCopyLink: () => void;
}

export function JamHeader({
  jamId,
  jamName,
  jamDescription,
  daysRemaining,
  userName,
  userSessions,
  onExpiryClick,
  onProfileClick,
  onLogout,
  onCopyLink,
}: JamHeaderProps) {
  const isExpiringSoon = daysRemaining <= 1;
  const isExpiringWarning = daysRemaining <= 3;

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-baseline justify-between mb-2">
        <div className="flex items-baseline space-x-3">
          <h1 className="text-2xl font-bold text-blue-500">{jamName}</h1>
          {jamDescription && (
            <p className="text-gray-400 text-sm">{jamDescription}</p>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">ID: {jamId}</span>
          <button
            onClick={onCopyLink}
            className="text-xs text-gray-400 hover:text-gray-300 underline"
            aria-label="링크 복사"
          >
            링크 복사
          </button>
        </div>
      </div>

      {/* 만료 임박 알림 */}
      {isExpiringSoon && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-red-400 text-lg" aria-hidden="true">
                ⚠️
              </span>
              <p className="text-sm text-red-300">
                <strong>주의!</strong> 방 유효기한이 {daysRemaining}일 남았습니다.
              </p>
            </div>
            <button
              onClick={onExpiryClick}
              className="text-sm text-gray-400 hover:text-gray-300 underline"
            >
              연장하기
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div>
            <span className="text-gray-500">잼 유효기한:</span>{' '}
            <span
              className={
                isExpiringWarning ? 'text-yellow-400' : 'text-white'
              }
            >
              {daysRemaining}일 남음
            </span>
          </div>
          <button
            onClick={onExpiryClick}
            className="text-xs text-gray-400 hover:text-gray-300 underline"
          >
            연장
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-white">{userName}</span>
          {userSessions && userSessions.length > 0 && (
            <span className="text-gray-500">({userSessions.join(', ')})</span>
          )}
          <span className="text-gray-600" aria-hidden="true">
            |
          </span>
          <button
            onClick={onProfileClick}
            className="text-xs text-gray-400 hover:text-gray-300 underline"
          >
            프로필 수정
          </button>
          <span className="text-gray-600" aria-hidden="true">
            |
          </span>
          <button
            onClick={onLogout}
            className="text-xs text-gray-400 hover:text-gray-300 underline"
          >
            로그아웃
          </button>
        </div>
      </div>
    </div>
  );
}
