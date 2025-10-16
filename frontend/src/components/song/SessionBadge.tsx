// 세션 배지 컴포넌트

import {
  VocalIcon,
  GuitarIcon,
  BassIcon,
  DrumsIcon,
  KeyboardIcon,
  UserIcon,
} from '../../assets/icons';
import { SESSION_TYPES } from '../../constants/sessions';

interface SessionBadgeProps {
  session: string;
  size?: number;
}

export function SessionBadge({ session, size = 20 }: SessionBadgeProps) {
  const getIcon = () => {
    switch (session) {
      case SESSION_TYPES.VOCAL:
        return <VocalIcon size={size} className="text-blue-400" />;
      case SESSION_TYPES.GUITAR:
        return <GuitarIcon size={size} className="text-yellow-400" />;
      case SESSION_TYPES.BASS:
        return <BassIcon size={size} className="text-purple-400" />;
      case SESSION_TYPES.DRUMS:
        return <DrumsIcon size={size} className="text-red-400" />;
      case SESSION_TYPES.KEYBOARD:
        return <KeyboardIcon size={size} className="text-green-400" />;
      default:
        return <UserIcon size={size} className="text-gray-400" />;
    }
  };
  
  return (
    <div className="inline-flex items-center space-x-1" title={session}>
      {getIcon()}
      <span className="text-xs text-gray-400">{session}</span>
    </div>
  );
}

