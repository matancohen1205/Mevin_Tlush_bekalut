const P: Record<string, string> = {
  home: "M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zm9 16l-4-4",
  library: "M4 4v16M9 4v16M14 6l6 1.5-3 12.5-6-1.5z",
  community: "M16 11a4 4 0 1 0-8 0M4 20c0-3.3 3.6-5 8-5s8 1.7 8 5M20 8a3 3 0 0 1 0 6",
  profile: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4 3.6-6 8-6s8 2 8 6",
  play: "M7 4.5v15l13-7.5z",
  pause: "M7 4h4v16H7zM13 4h4v16h-4z",
  next: "M5 5l10 7-10 7zM18 5v14",
  prev: "M19 5L9 12l10 7zM6 5v14",
  shuffle: "M3 7h4l10 10h4M3 17h4l3-3M14 10l3-3h4M18 4l3 3-3 3M18 14l3 3-3 3",
  repeat: "M4 11V9a3 3 0 0 1 3-3h13M17 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H4M7 21l-3-3 3-3",
  heart: "M12 20.5s-8-4.7-8-10.6A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8 2.9c0 5.9-8 10.6-8 10.6z",
  down: "M5 9l7 7 7-7",
  volume: "M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7",
  moon: "M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1",
  plus: "M12 5v14M5 12h14",
  trash: "M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3",
  edit: "M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4",
  lock: "M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18",
  sparkle: "M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2zM19 3v4M17 5h4",
  check: "M5 12.5l4.5 4.5L19 7.5",
  close: "M6 6l12 12M18 6L6 18",
  back: "M15 5l-7 7 7 7",
  comment: "M4 5h16v11H10l-5 4v-4H4z",
  bell: "M6 17v-6a6 6 0 0 1 12 0v6l2 2H4zM10 21h4",
  share: "M12 3v12M7 8l5-5 5 5M5 14v6h14v-6",
  more: "M5 12h.01M12 12h.01M19 12h.01",
  flag: "M5 21V4M5 4h12l-2 4 2 4H5",
  userplus: "M10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM3 20c0-3.3 3-5 7-5s7 1.7 7 5M19 8v6M16 11h6",
  grip: "M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",
};

interface Props {
  name: keyof typeof P;
  size?: number;
  fill?: boolean;
}

export function Icon({ name, size = 24, fill = false }: Props) {
  const solid = fill || name === "play" || name === "pause";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={solid ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d={P[name]} />
    </svg>
  );
}
