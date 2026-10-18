export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#A8D8F0" /><stop offset="1" stopColor="#2F6FB0" /></linearGradient></defs>
      <rect width="64" height="64" rx="18" fill="url(#lg)" />
      <path d="M12 34c6-14 10-14 14 0s8 14 13 0 8-12 13-4" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
