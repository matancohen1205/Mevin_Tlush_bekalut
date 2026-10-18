/** Decides which audio URL the player should load for a track. */
import type { Track } from "../../types";
import { synthDataUrl, synthUrl } from "./synth";

/** Demo track number encoded in `synth:<n>` or in a legacy `demo-<n>` id; null for real tracks. */
export function demoSeed(track: Track): number | null {
  const n = track.previewUrl?.startsWith("synth:") ? Number(track.previewUrl.slice(6)) : track.source === "demo" ? Number(track.id.replace("demo-", "")) : NaN;
  return Number.isFinite(n) ? n : null;
}

/** Playable URL for a track, or null when it has none. Demo tracks are synthesized on demand. */
export function sourceOf(track: Track): string | null {
  const seed = demoSeed(track);
  if (seed !== null) return synthUrl(seed);
  return track.previewUrl ?? null;
}

/** Fallback URL (data:) for demo tracks when the browser refuses blob: media; null for real tracks. */
export function fallbackSourceOf(track: Track): Promise<string> | null {
  const seed = demoSeed(track);
  return seed === null ? null : synthDataUrl(seed);
}
