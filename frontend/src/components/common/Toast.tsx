// 토스트 알림 컴포넌트

import { useEffect, useState } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  duration?: number;
  onClose: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // 애니메이션을 위해 약간의 지연 후 표시
    const showTimer = setTimeout(() => setIsVisible(true), 10);
    
    // duration 후 자동 닫기
    const closeTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // 애니메이션 후 제거
    }, duration);
    
    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);
  
  const typeStyles = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    info: 'bg-blue-600 border-blue-500',
    warning: 'bg-yellow-600 border-yellow-500',
  };
  
  const typeIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  };
  
  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50
        px-4 py-3 rounded-lg border-l-4 shadow-lg
        flex items-center space-x-3 min-w-[280px] max-w-md
        transition-all duration-300 transform
        ${typeStyles[type]}
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
      `}
    >
      <span className="text-xl">{typeIcons[type]}</span>
      <p className="flex-1 text-white text-sm">{message}</p>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="text-white hover:text-gray-200 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}

// 토스트 컨테이너 (여러 토스트 관리)
interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ bottom: `${(index * 80) + 16}px` }}
          className="fixed right-4 z-50"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );
}

