import React from 'react';

const StethoscopeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 8v5a4 4 0 0 0 4 4h1" />
    <path d="M8 8a4 4 0 1 0-8 0" />
    <path d="M12 21v-4a4 4 0 0 0-4-4H4" />
    <path d="M20 8v5a4 4 0 0 1-4 4h-1" />
    <path d="M16 8a4 4 0 1 1 8 0" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export default StethoscopeIcon;