// 로딩 스피너 컴포넌트

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function Loading({ size = 'md', text }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`
          ${sizeClasses[size]}
          border-gray-600 border-t-blue-500
          rounded-full animate-spin
        `}
      />
      {text && (
        <p className="text-sm text-gray-400">{text}</p>
      )}
    </div>
  );
}

