/**
 * Pure rules for share links. A link carries a snapshot of the playlist (base64url JSON in `?share=`),
 * so it works without a backend. Incoming data is untrusted and is validated before use.
 */
import type { Playlist, SharePayload, SharedTrack, Track } from "../types";

export const SHARE_PARAM = "share";
const MAX_TRACKS = 50;
const MAX_TEXT = 200;

/** True for http(s) URLs (the only kind accepted from a link). */
const isHttps = (u: unknown): u is string => typeof u === "string" && /^https:\/\//i.test(u) && u.length < 1000;

/** Snapshot of a playlist for sharing; generated (data:) covers are left out to keep the link short. */
export function toSharePayload(p: Playlist, by: string): SharePayload {
  const tracks: SharedTrack[] = p.tracks.slice(0, MAX_TRACKS).map((t) => ({
    id: t.id, title: t.title, artist: t.artist, durationMs: t.durationMs, source: t.source,
    previewUrl: t.previewUrl, sourceUrl: t.sourceUrl, full: t.full,
    artwork: isHttps(t.artwork) ? t.artwork : undefined,
  }));
  return { v: 1, title: p.title, description: p.description, by, tracks };
}

/** Turns shared tracks back into playable tracks; `coverFor` supplies artwork for tracks that had none. */
export function fromSharedTracks(tracks: readonly SharedTrack[], coverFor: (t: SharedTrack) => string): Track[] {
  return tracks.map((t) => ({ ...t, artwork: t.artwork ?? coverFor(t) }));
}

/** base64url of the UTF-8 JSON (safe inside a URL). */
export function encodePayload(payload: SharePayload): string {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Keeps a string within limits. */
const text = (v: unknown, max = MAX_TEXT): string => (typeof v === "string" ? v.slice(0, max) : "");

/** Validates one shared track; null when it is unusable. */
function cleanTrack(raw: unknown): SharedTrack | null {
  const t = raw as Record<string, unknown> | null;
  if (!t || typeof t.id !== "string" || typeof t.title !== "string" || typeof t.artist !== "string") return null;
  const previewUrl = typeof t.previewUrl === "string" && (t.previewUrl.startsWith("synth:") || isHttps(t.previewUrl)) ? t.previewUrl : undefined;
  const source = t.source === "itunes" || t.source === "audius" || t.source === "demo" ? t.source : "demo";
  return {
    id: text(t.id), title: text(t.title), artist: text(t.artist), source, previewUrl,
    durationMs: typeof t.durationMs === "number" && t.durationMs > 0 ? Math.min(t.durationMs, 3_600_000) : 30_000,
    sourceUrl: isHttps(t.sourceUrl) ? t.sourceUrl : undefined, full: t.full === true,
    artwork: isHttps(t.artwork) ? t.artwork : undefined,
  };
}

/** Decodes and validates a share code; null when it is malformed or not a share payload. */
export function decodePayload(code: string): SharePayload | null {
  try {
    const binary = atob(code.replace(/-/g, "+").replace(/_/g, "/"));
    const data = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))));
    if (data?.v !== 1 || !Array.isArray(data.tracks)) return null;
    const tracks = data.tracks.slice(0, MAX_TRACKS).map(cleanTrack).filter((t: SharedTrack | null): t is SharedTrack => t !== null);
    return tracks.length ? { v: 1, title: text(data.title) || "Playlist", description: text(data.description, 300), by: text(data.by, 60), tracks } : null;
  } catch {
    return null;
  }
}

/** Full link to a shared playlist. `base` is the app's URL without query. */
export const buildShareUrl = (base: string, payload: SharePayload): string => `${base}?${SHARE_PARAM}=${encodePayload(payload)}`;

/** The share code in a query string (`?share=…`), or null. */
export const extractShareCode = (search: string): string | null => new URLSearchParams(search).get(SHARE_PARAM);
