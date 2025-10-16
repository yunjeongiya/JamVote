// 기타 아이콘

interface IconProps {
  className?: string;
  size?: number;
}

export function GuitarIcon({ className = '', size = 24 }: IconProps) {
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
        d="M19 4L18 5M18 5L14 9M18 5L20 3M14 9L13 10M14 9L16 7M13 10L8 15M13 10L15 12M8 15L7 16C6.44772 16 6 16.4477 6 17C6 17.5523 6.44772 18 7 18C7.55228 18 8 17.5523 8 17V16M8 15L6 13M15 12L17 14M8.5 17.5C8.5 18.8807 7.38071 20 6 20C4.61929 20 3.5 18.8807 3.5 17.5C3.5 16.1193 4.61929 15 6 15C7.38071 15 8.5 16.1193 8.5 17.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

