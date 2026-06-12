export function MilestoneTrophyIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <ellipse cx="100" cy="158" rx="72" ry="14" fill="#FF7900" fillOpacity="0.35" />
      <path
        d="M36 148c18-10 110-10 128 0-6 8-116 8-128 0Z"
        fill="url(#milestone-platform)"
      />
      <path d="M78 118h44v28c0 6-9.8 10-22 10s-22-4-22-10v-28Z" fill="#7B4DFF" />
      <rect x="86" y="126" width="28" height="14" rx="3" fill="#4A2F99" />
      <path
        d="M52 78c8-22 32-38 48-38s40 16 48 38c-14 10-82 10-96 0Z"
        fill="#FF5A4A"
      />
      <path
        d="M148 78c-8-22-32-38-48-38s-40 16-48 38c14 10 82 10 96 0Z"
        fill="#FF5A4A"
      />
      <path
        d="M100 34 118 74l42 6-30 28 8 40-38-20-38 20 8-40-30-28 42-6 18-40Z"
        fill="url(#milestone-star)"
      />
      <path
        d="M100 48 112 76l30 4-22 20 6 30-26-14-26 14 6-30-22-20 30-4 12-28Z"
        fill="#FFF4B8"
        fillOpacity="0.55"
      />
      <circle cx="44" cy="52" r="5" fill="#FF7900" />
      <circle cx="156" cy="44" r="4" fill="#FF5A4A" />
      <circle cx="164" cy="92" r="3.5" fill="#7B4DFF" />
      <path
        d="M34 96 38 88l4 8-8 2 6-6-6-6 8 2Z"
        fill="#FCDE5C"
      />
      <path
        d="M162 118 166 110l4 8-8 2 6-6-6-6 8 2Z"
        fill="#FCDE5C"
      />
      <defs>
        <linearGradient id="milestone-star" x1="70" y1="30" x2="130" y2="118">
          <stop stopColor="#FCDE5C" />
          <stop offset="1" stopColor="#FFB109" />
        </linearGradient>
        <linearGradient id="milestone-platform" x1="36" y1="148" x2="164" y2="168">
          <stop stopColor="#FF9533" />
          <stop offset="1" stopColor="#FF7900" />
        </linearGradient>
      </defs>
    </svg>
  );
}
