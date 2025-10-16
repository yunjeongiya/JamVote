// 모달 컴포넌트

import { ReactNode, useEffect } from 'react';
import { Dialog } from '@headlessui/react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
  };
  
  // 모달 열릴 때 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/70" aria-hidden="true" />
      
      {/* 모달 컨테이너 */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className={`
            ${sizeClasses[size]} w-full bg-gray-900 rounded-lg shadow-xl
            border border-gray-800
          `}
        >
          {title && (
            <Dialog.Title className="px-6 py-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold text-white">{title}</h3>
            </Dialog.Title>
          )}
          
          <div className="px-6 py-4">
            {children}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}

