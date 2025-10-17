// 베이스 아이콘

interface IconProps {
  className?: string;
  size?: number;
}

export function BassIcon({ className = '', size = 24 }: IconProps) {
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
        d="M14 12.5L15.5 11M14 9.5L15.5 8M14 6.5L15.5 5M10.042 20.998L4.002 15C2.814 13.812 2.713 12.068 3.454 10.533C4.073 9.243 5.33 8.43 6.738 8.43H9.5M10.042 20.998C10.015 21.55 9.55 22 9 22C8.45 22 8 21.553 7.973 21.002L10.042 20.998ZM10.042 20.998L10.5 3.5C10.5 2.672 11.172 2 12 2C12.828 2 13.5 2.672 13.5 3.5V20.5C13.5 21.328 12.828 22 12 22C11.172 22 10.5 21.328 10.5 20.5L10.042 20.998Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

