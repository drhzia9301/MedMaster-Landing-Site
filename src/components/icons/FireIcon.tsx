import React from 'react';

const FireIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    <path d="M8.5 8.5c0-1.5 1-3 2.5-3.5 0 1 .5 2 1.5 2.5C13.5 8 14 9 14 10c0 1.5-1 2.5-2.5 2.5S9 11.5 9 10c0-.5.2-1 .5-1.5z"/>
  </svg>
);

export default FireIcon;