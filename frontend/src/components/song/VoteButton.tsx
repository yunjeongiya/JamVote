// 투표 버튼 컴포넌트

import type { VoteType } from '../../types/vote';

interface VoteButtonProps {
  type: VoteType;
  count: number;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export function VoteButton({ type, count, isActive, onClick, disabled }: VoteButtonProps) {
  const isLike = type === 'like';
  
  const baseClasses = 'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors';
  const activeClasses = isLike
    ? 'bg-blue-600 text-white'
    : 'bg-red-600 text-white';
  const inactiveClasses = isLike
    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
    : 'bg-gray-800 text-gray-300 hover:bg-gray-700';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <span className="text-lg">{isLike ? '👍' : '❌'}</span>
      <span>{count}</span>
    </button>
  );
}

