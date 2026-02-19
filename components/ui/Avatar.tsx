// Avatar components - no external URL needed

export function UserAvatar({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#2a2a2a"/>
      <rect width="32" height="32" rx="16" fill="url(#userGrad)" opacity="0.8"/>
      {/* Head */}
      <circle cx="16" cy="12" r="5" fill="white" opacity="0.9"/>
      {/* Body */}
      <path d="M6 26c0-5.523 4.477-10 10-10s10 4.477 10 10" fill="white" opacity="0.6"/>
      <defs>
        <linearGradient id="userGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1"/>
          <stop offset="1" stopColor="#8b5cf6"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AIAvatar({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="16" fill="#1a1a1a"/>
      {/* Geometric squares like logo */}
      <rect x="7" y="7" width="9" height="9" rx="2" fill="white" opacity="0.9"/>
      <rect x="16" y="16" width="9" height="9" rx="2" fill="white" opacity="0.4"/>
      <rect x="11" y="11" width="6" height="6" rx="1.5" fill="white"/>
    </svg>
  );
}
