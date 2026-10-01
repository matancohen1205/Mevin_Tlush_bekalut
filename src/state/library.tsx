import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Playlist, Track } from "../types";

/**
 * Local persistence behind a small interface – swap for Supabase later
 * without touching components.
 */
interface LibraryState {
  liked: Track[];
  playlists: Playlist[];
  isLiked: (id: string) => boolean;
  toggleLike: (t: Track) => void;
  createPlaylist: (title: string, opts?: { description?: string; visibility?: Playlist["visibility"]; tracks?: Track[] }) => string;
  updatePlaylist: (id: string, patch: Partial<Pick<Playlist, "title" | "description" | "visibility">>) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (id: string, t: Track) => void;
  removeFromPlaylist: (id: string, trackId: string) => void;
  reorderPlaylist: (id: string, from: number, to: number) => void;
}

const KEY = "wavely.library.v2";
const LEGACY_LIKED = "wavely.liked.v1";
const Ctx = createContext<LibraryState | null>(null);
export const useLibrary = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLibrary outside LibraryProvider");
  return c;
};

interface Saved { liked: Track[]; playlists: Playlist[] }

function load(): Saved {
  try {
    const v2 = localStorage.getItem(KEY);
    if (v2) return JSON.parse(v2);
    return { liked: JSON.parse(localStorage.getItem(LEGACY_LIKED) ?? "[]"), playlists: [] };
  } catch {
    return { liked: [], playlists: [] };
  }
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Saved>(load);
  const { liked, playlists } = data;

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* keep in memory */ }
  }, [data]);

  const setPl = useCallback((fn: (p: Playlist[]) => Playlist[]) => setData((d) => ({ ...d, playlists: fn(d.playlists) })), []);
  const patch = useCallback((id: string, fn: (p: Playlist) => Playlist) => setPl((l) => l.map((p) => (p.id === id ? fn(p) : p))), [setPl]);

  const value = useMemo<LibraryState>(
    () => ({
      liked,
      playlists,
      isLiked: (id) => liked.some((t) => t.id === id),
      toggleLike: (t) => setData((d) => ({ ...d, liked: d.liked.some((x) => x.id === t.id) ? d.liked.filter((x) => x.id !== t.id) : [t, ...d.liked] })),
      createPlaylist: (title, opts = {}) => {
        const id = `pl-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
        setPl((l) => [{ id, title: title.trim() || "פלייליסט חדש", description: opts.description ?? "", visibility: opts.visibility ?? "private", tracks: opts.tracks ?? [], createdAt: Date.now() }, ...l]);
        return id;
      },
      updatePlaylist: (id, p) => patch(id, (pl) => ({ ...pl, ...p })),
      deletePlaylist: (id) => setPl((l) => l.filter((p) => p.id !== id)),
      addToPlaylist: (id, t) => patch(id, (pl) => (pl.tracks.some((x) => x.id === t.id) ? pl : { ...pl, tracks: [...pl.tracks, t] })),
      removeFromPlaylist: (id, tid) => patch(id, (pl) => ({ ...pl, tracks: pl.tracks.filter((t) => t.id !== tid) })),
      reorderPlaylist: (id, from, to) =>
        patch(id, (pl) => {
          const tracks = [...pl.tracks];
          const [m] = tracks.splice(from, 1);
          tracks.splice(to, 0, m);
          return { ...pl, tracks };
        }),
    }),
    [liked, playlists, patch, setPl],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
