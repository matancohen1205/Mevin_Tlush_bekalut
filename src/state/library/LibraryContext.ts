/** Liked songs and playlists: the API components use, and the context that carries it. */
import { createContext, useContext } from "react";
import type { NewPlaylistOptions } from "../../domain/playlists";
import type { Playlist, Track } from "../../types";

export interface LibraryApi {
  liked: Track[];
  playlists: Playlist[];
  isLiked: (id: string) => boolean;
  toggleLike: (track: Track) => void;
  /** Creates a playlist and returns its id. */
  createPlaylist: (title: string, options?: NewPlaylistOptions) => string;
  updatePlaylist: (id: string, patch: Partial<Pick<Playlist, "title" | "description" | "visibility">>) => void;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (id: string, track: Track) => void;
  removeFromPlaylist: (id: string, trackId: string) => void;
  reorderPlaylist: (id: string, from: number, to: number) => void;
}

export const LibraryContext = createContext<LibraryApi | null>(null);

/** Access the library from any component under LibraryProvider. */
export function useLibrary(): LibraryApi {
  const api = useContext(LibraryContext);
  if (!api) throw new Error("useLibrary outside LibraryProvider");
  return api;
}
