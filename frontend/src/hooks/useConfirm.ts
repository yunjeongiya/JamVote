// 확인 모달 훅 - 재사용 가능한 confirm 로직

import { useState, useCallback } from 'react';

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmVariant?: 'primary' | 'danger';
}

interface UseConfirmReturn {
  isOpen: boolean;
  confirmOptions: ConfirmOptions | null;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export function useConfirm(): UseConfirmReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmOptions, setConfirmOptions] = useState<ConfirmOptions | null>(null);
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    setConfirmOptions(options);
    setIsOpen(true);

    return new Promise((resolve) => {
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (resolver) {
      resolver(true);
    }
    setIsOpen(false);
    setConfirmOptions(null);
    setResolver(null);
  }, [resolver]);

  const handleCancel = useCallback(() => {
    if (resolver) {
      resolver(false);
    }
    setIsOpen(false);
    setConfirmOptions(null);
    setResolver(null);
  }, [resolver]);

  return {
    isOpen,
    confirmOptions,
    confirm,
    handleConfirm,
    handleCancel,
  };
}
