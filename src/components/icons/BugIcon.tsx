const BugIcon: React.FC<{ className?: string }> = ({ className }) => (
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
    <path d="M12 20h-4a2 2 0 0 1 -2 -2V12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v4" />
    <path d="M12 10V6a2 2 0 0 1 2 -2h2" />
    <path d="M12 6a2 2 0 0 0 -2 -2H8" />
    <path d="M16 4a2 2 0 0 1 2 2" />
    <path d="M8 4a2 2 0 0 0 -2 2" />
    <path d="M12 20l0 -8" />
    <path d="M8 20l-2 -4" />
    <path d="M16 20l2 -4" />
    <path d="M3 14h2" />
    <path d="M19 14h2" />
  </svg>
);

export default BugIcon;