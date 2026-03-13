interface Props {
  size?: number;
  className?: string;
}

export default function Duck({ size = 90, className = 'duck-img' }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Water / bathtub ripple */}
      <ellipse cx="50" cy="82" rx="38" ry="7" fill="#a8d8ea" opacity="0.5" />
      <ellipse cx="50" cy="82" rx="28" ry="4" fill="#a8d8ea" opacity="0.4" />

      {/* Body */}
      <ellipse cx="50" cy="68" rx="30" ry="20" fill="#FFD700" />

      {/* Wing highlight */}
      <ellipse cx="62" cy="65" rx="10" ry="6" fill="#FFC200" opacity="0.6" transform="rotate(-15 62 65)" />

      {/* Neck */}
      <ellipse cx="36" cy="52" rx="10" ry="12" fill="#FFD700" />

      {/* Head */}
      <circle cx="33" cy="40" r="14" fill="#FFD700" />

      {/* Eye white */}
      <circle cx="28" cy="37" r="4" fill="white" />
      {/* Eye pupil */}
      <circle cx="27" cy="37" r="2" fill="#222" />
      {/* Eye shine */}
      <circle cx="26.5" cy="36" r="0.8" fill="white" />

      {/* Beak */}
      <ellipse cx="18" cy="41" rx="7" ry="4" fill="#FF8C00" />
      <line x1="11" y1="41" x2="25" y2="41" stroke="#e07800" strokeWidth="1" />

      {/* Bathtub rim */}
      <rect x="8" y="84" width="84" height="8" rx="4" fill="#e0e0e0" />
      <rect x="4" y="80" width="92" height="6" rx="3" fill="#f0f0f0" />
    </svg>
  );
}
