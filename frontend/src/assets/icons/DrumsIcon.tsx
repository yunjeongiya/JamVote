// 드럼 아이콘

interface IconProps {
  className?: string;
  size?: number;
}

export function DrumsIcon({ className = '', size = 24 }: IconProps) {
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
        d="M10 18L4 16M14 18L20 16M12 19V14M7 15.5C7 16.8807 9.23858 18 12 18C14.7614 18 17 16.8807 17 15.5M7 15.5V14.5C7 13.1193 9.23858 12 12 12C14.7614 12 17 13.1193 17 14.5V15.5M7 15.5C7 14.1193 9.23858 13 12 13C14.7614 13 17 14.1193 17 15.5M18 10L16 12M6 10L8 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

