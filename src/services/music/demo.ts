import type { Track } from "../../types";
import type { MusicProvider } from "./provider";

/** Soft blue gradient "cover" generated as an SVG data URI – no network needed. */
function cover(seed: number): string {
  const hues = [200, 210, 195, 220, 188, 205];
  const h = hues[seed % hues.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h},70%,82%)"/><stop offset="1" stop-color="hsl(${h + 12},65%,52%)"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><circle cx="${90 + seed * 17 % 120}" cy="${80 + seed * 29 % 140}" r="${60 + seed * 7 % 40}" fill="#fff" opacity=".22"/><path d="M0 220c40-30 80 30 150 0s100-20 150 10v70H0z" fill="#fff" opacity=".3"/></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const RAW: [string, string, string, string][] = [
  ["Ocean Drive", "Luna Waves", "Chill", "us"],
  ["Sky Blue Morning", "The Tidal", "Pop", "gb"],
  ["Mediterranean Nights", "Noa & The Sea", "Indie", "il"],
  ["Rio Sunrise", "Marisa Costa", "Bossa Nova", "br"],
  ["Paris la nuit", "Camille Roche", "French Pop", "fr"],
  ["Neon Tokyo", "Hikari", "City Pop", "jp"],
  ["Seoul Daydream", "BLUE ARC", "K-Pop", "kr"],
  ["Monsoon Lights", "Aarav Rao", "Fusion", "in"],
  ["Desert Wind", "Yael Amar", "World", "il"],
  ["Cielo Abierto", "Sol y Mar", "Latin", "mx"],
  ["Calm Harbor", "Nordlys", "Ambient", "de"],
  ["Bosphorus", "Deniz Kaya", "Anatolian Rock", "tr"],
  ["Glass Rain", "Aqua Theory", "Electronic", "gb"],
  ["Slow Tide", "Luna Waves", "Chill", "us"],
  ["Horizon", "The Tidal", "Pop", "gb"],
  ["Lullaby for the Sea", "Nordlys", "Ambient", "de"],
];

export const DEMO_TRACKS: Track[] = RAW.map(([title, artist, genre, country], i) => ({
  id: `demo-${i}`,
  title,
  artist,
  genre,
  country,
  artwork: cover(i),
  durationMs: (150 + ((i * 23) % 90)) * 1000,
  source: "demo",
}));

const delay = <T,>(v: T) => new Promise<T>((r) => setTimeout(() => r(v), 350));

export const demoProvider: MusicProvider = {
  id: "demo",
  charts: async (country, limit = 12) => {
    const local = DEMO_TRACKS.filter((t) => t.country === country);
    const rest = DEMO_TRACKS.filter((t) => t.country !== country);
    return delay([...local, ...rest].slice(0, limit));
  },
  search: async (query, _c, limit = 20) => {
    const q = query.trim().toLowerCase();
    return delay(DEMO_TRACKS.filter((t) => `${t.title} ${t.artist} ${t.genre}`.toLowerCase().includes(q)).slice(0, limit));
  },
};
