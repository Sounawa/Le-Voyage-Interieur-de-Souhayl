'use client';

export default function IslamicPattern() {
  return (
    <svg
      className="fixed inset-0 w-full h-full pointer-events-none z-[1] opacity-[0.03]"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="islamic-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
          {/* 8-pointed star base */}
          <polygon
            points="60,10 68,42 100,42 74,62 82,94 60,76 38,94 46,62 20,42 52,42"
            fill="none"
            stroke="rgba(212, 165, 116, 1)"
            strokeWidth="0.5"
          />
          {/* Inner octagon */}
          <polygon
            points="60,25 67,40 80,40 72,52 76,67 60,60 44,67 48,52 40,40 53,40"
            fill="none"
            stroke="rgba(212, 165, 116, 1)"
            strokeWidth="0.3"
          />
          {/* Cross connectors */}
          <line x1="60" y1="0" x2="60" y2="120" stroke="rgba(212, 165, 116, 1)" strokeWidth="0.2" />
          <line x1="0" y1="60" x2="120" y2="60" stroke="rgba(212, 165, 116, 1)" strokeWidth="0.2" />
          <line x1="0" y1="0" x2="120" y2="120" stroke="rgba(212, 165, 116, 0.5)" strokeWidth="0.15" />
          <line x1="120" y1="0" x2="0" y2="120" stroke="rgba(212, 165, 116, 0.5)" strokeWidth="0.15" />
          {/* Diamond accents at intersections */}
          <polygon
            points="60,55 63,60 60,65 57,60"
            fill="rgba(212, 165, 116, 1)"
            strokeWidth="0"
          />
          <polygon
            points="0,55 3,60 0,65 -3,60"
            fill="rgba(212, 165, 116, 1)"
            strokeWidth="0"
          />
          <polygon
            points="120,55 123,60 120,65 117,60"
            fill="rgba(212, 165, 116, 1)"
            strokeWidth="0"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#islamic-pattern)" />
    </svg>
  );
}
