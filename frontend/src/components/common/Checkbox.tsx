// 체크박스 컴포넌트

import { InputHTMLAttributes, forwardRef } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <label className="flex items-center space-x-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={`
            w-5 h-5 bg-gray-800 border-gray-700 rounded
            text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
        <span className="text-gray-300 select-none">{label}</span>
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

