import type { Track } from "../../types";
import { cover } from "./demo";
import type { MusicProvider } from "./provider";

/**
 * Audius: free, key-less API with FULL-length tracks from independent artists.
 * Playback uses the public stream endpoint; attribution links back to audius.co.
 * Note: no per-country charts – "charts" returns what is trending globally.
 */
const HOST = "https://api.audius.co";
const APP = "Wavely";

interface AudiusTrack {
  id: string;
  title: string;
  duration: number;
  genre?: string;
  permalink?: string;
  is_streamable?: boolean;
  artwork?: Record<string, string> | null;
  user: { name: string; handle: string };
}

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

function toTrack(t: AudiusTrack): Track {
  const art = t.artwork;
  return {
    id: `audius-${t.id}`,
    title: t.title,
    artist: t.user.name,
    artwork: art?.["480x480"] ?? art?.["1000x1000"] ?? art?.["150x150"] ?? cover(hash(t.id)),
    previewUrl: `${HOST}/v1/tracks/${t.id}/stream?app_name=${APP}`,
    durationMs: t.duration * 1000,
    genre: t.genre,
    source: "audius",
    full: true,
    sourceUrl: t.permalink ? `https://audius.co${t.permalink}` : undefined,
  };
}

async function list(path: string): Promise<Track[]> {
  const res = await fetch(`${HOST}/v1/tracks/${path}${path.includes("?") ? "&" : "?"}app_name=${APP}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as { data: AudiusTrack[] };
  const tracks = json.data.filter((t) => t.is_streamable !== false && t.duration > 0).map(toTrack);
  if (!tracks.length) throw new Error("no tracks");
  return tracks;
}

export const audiusProvider: MusicProvider = {
  id: "audius",
  charts: (_country, limit = 12) => list(`trending?limit=${limit}`),
  search: (query, _country, limit = 20) => list(`search?query=${encodeURIComponent(query)}&limit=${limit}`),
};
