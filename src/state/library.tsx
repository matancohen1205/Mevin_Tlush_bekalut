import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { fetchLibrary, removePlaylist, savePlaylist, setLike } from "../services/cloudLibrary";
import type { Playlist, Track } from "../types";
import { useAuth } from "./auth";

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

  useCloudSync(data, setData);

  const setPl = useCallback((fn: (p: Playlist[]) => Playlist[]) => setData((d) => ({ ...d, playlists: fn(d.playlists) })), []);
  const patch = useCallback((id: string, fn: (p: Playlist) => Playlist) => setPl((l) => l.map((p) => (p.id === id ? fn(p) : p))), [setPl]);

  const value = useMemo<LibraryState>(
    () => ({
      liked,
      playlists,
      isLiked: (id) => liked.some((t) => t.id === id),
      toggleLike: (t) => setData((d) => ({ ...d, liked: d.liked.some((x) => x.id === t.id) ? d.liked.filter((x) => x.id !== t.id) : [t, ...d.liked] })),
      createPlaylist: (title, opts = {}) => {
        const id = crypto.randomUUID();
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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const plHash = (p: Playlist) => JSON.stringify([p.title, p.description, p.visibility, p.tracks.map((t) => t.id)]);

/**
 * Mirrors the local library to Supabase while signed in.
 * On login: load the cloud copy (or upload the local one if the account is empty).
 * Afterwards: diff against what was last synced and push only the changes.
 */
function useCloudSync(data: Saved, setData: (s: Saved) => void) {
  const { userId } = useAuth();
  const synced = useRef<{ uid: string; likes: Set<string>; pls: Map<string, string> } | null>(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  // login → initial load
  useEffect(() => {
    synced.current = null;
    if (!userId) return;
    let live = true;
    (async () => {
      try {
        const cloud = await fetchLibrary(userId);
        if (!live) return;
        const local = dataRef.current;
        const cloudEmpty = !cloud.liked.length && !cloud.playlists.length;
        if (cloudEmpty && (local.liked.length || local.playlists.length)) {
          // first login on this account: upload what was made as a guest (ids must be UUIDs)
          const playlists = local.playlists.map((p) => (UUID.test(p.id) ? p : { ...p, id: crypto.randomUUID() }));
          synced.current = { uid: userId, likes: new Set(), pls: new Map() };
          setData({ liked: local.liked, playlists });
        } else {
          synced.current = { uid: userId, likes: new Set(cloud.liked.map((t) => t.id)), pls: new Map(cloud.playlists.map((p) => [p.id, plHash(p)])) };
          setData({ liked: cloud.liked, playlists: cloud.playlists });
        }
      } catch (e) {
        console.warn("Wavely: could not load cloud library", e);
      }
    })();
    return () => { live = false; };
  }, [userId, setData]);

  // changes → push (debounced)
  useEffect(() => {
    const st = synced.current;
    if (!userId || !st || st.uid !== userId) return;
    const id = setTimeout(async () => {
      try {
        const ids = new Set(data.liked.map((t) => t.id));
        for (const t of data.liked) if (!st.likes.has(t.id)) { await setLike(userId, t, true); st.likes.add(t.id); }
        for (const tid of [...st.likes]) if (!ids.has(tid)) { await setLike(userId, { id: tid } as Track, false); st.likes.delete(tid); }
        for (const p of data.playlists) {
          const h = plHash(p);
          if (st.pls.get(p.id) !== h) { await savePlaylist(userId, p); st.pls.set(p.id, h); }
        }
        const live = new Set(data.playlists.map((p) => p.id));
        for (const pid of [...st.pls.keys()]) if (!live.has(pid)) { await removePlaylist(pid); st.pls.delete(pid); }
      } catch (e) {
        console.warn("Wavely: cloud sync failed, will retry on next change", e);
      }
    }, 600);
    return () => clearTimeout(id);
  }, [data, userId]);
}
