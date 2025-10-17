// 보컬 아이콘

interface IconProps {
  className?: string;
  size?: number;
}

export function VocalIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 15C14.2091 15 16 13.2091 16 11V6C16 3.79086 14.2091 2 12 2C9.79086 2 8 3.79086 8 6V11C8 13.2091 9.79086 15 12 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M19 11V12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12V11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 19V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

