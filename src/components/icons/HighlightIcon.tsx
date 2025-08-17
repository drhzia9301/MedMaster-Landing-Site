import React from 'react';

interface HighlightIconProps {
  className?: string;
  filled?: boolean;
}

const HighlightIcon: React.FC<HighlightIconProps> = ({ className = "w-6 h-6", filled = false }) => {
  return (
    <svg
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 2}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014.846 17H9.154a3.374 3.374 0 00-1.849-.553L6.757 16z"
      />
    </svg>
  );
};

export default HighlightIcon;