/** Library state: applies domain rules to liked songs and playlists, persists locally, syncs to the cloud. */
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { addTrack, buildPlaylist, isLiked, removeTrack, reorderTracks, toggleLiked } from "../../domain/playlists";
import { tr } from "../../i18n";
import type { Playlist } from "../../types";
import { LibraryContext, type LibraryApi } from "./LibraryContext";
import { loadLibrary, saveLibrary, type LibrarySnapshot } from "./libraryStorage";
import { useCloudSync } from "./useCloudSync";

/** Provides the library to the tree. */
export function LibraryProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<LibrarySnapshot>(loadLibrary);
  useEffect(() => saveLibrary(data), [data]);
  useCloudSync(data, setData);

  /** Applies `change` to the playlist list. */
  const editPlaylists = useCallback((change: (list: Playlist[]) => Playlist[]) => setData((d) => ({ ...d, playlists: change(d.playlists) })), []);
  /** Applies `change` to one playlist. */
  const editPlaylist = useCallback((id: string, change: (p: Playlist) => Playlist) => editPlaylists((list) => list.map((p) => (p.id === id ? change(p) : p))), [editPlaylists]);

  const api = useMemo<LibraryApi>(
    () => ({
      liked: data.liked,
      playlists: data.playlists,
      isLiked: (id) => isLiked(data.liked, id),
      toggleLike: (track) => setData((d) => ({ ...d, liked: toggleLiked(d.liked, track) })),
      createPlaylist: (title, options) => {
        const id = crypto.randomUUID();
        editPlaylists((list) => [buildPlaylist(title, tr("פלייליסט חדש"), id, Date.now(), options), ...list]);
        return id;
      },
      updatePlaylist: (id, patch) => editPlaylist(id, (p) => ({ ...p, ...patch })),
      deletePlaylist: (id) => editPlaylists((list) => list.filter((p) => p.id !== id)),
      addToPlaylist: (id, track) => editPlaylist(id, (p) => addTrack(p, track)),
      removeFromPlaylist: (id, trackId) => editPlaylist(id, (p) => removeTrack(p, trackId)),
      reorderPlaylist: (id, from, to) => editPlaylist(id, (p) => reorderTracks(p, from, to)),
    }),
    [data, editPlaylists, editPlaylist],
  );
  return <LibraryContext.Provider value={api}>{children}</LibraryContext.Provider>;
}
