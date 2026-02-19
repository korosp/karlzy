import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const dims = { sm: 28, md: 34, lg: 44 };
  const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };
  const d = dims[size];

  return (
    <div className="flex items-center gap-2.5">
 
      <svg
        width={d}
        height={d}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <rect width="64" height="64" rx="16" fill="#0B0B0B"/>

       
        <path
          d="M36 4 L14 36 H30 L26 60 L50 26 H34 L36 4 Z"
          fill="white"
        />
      </svg>

      {showText && (
        <span
          className={`${textSizes[size]} font-bold tracking-tight leading-none text-white`}
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          KarlX
          <span className="text-white/70 font-medium"> AI</span>
        </span>
      )}
    </div>
  );
}