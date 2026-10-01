import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Track } from "../types";

/**
 * Local persistence behind a small interface – swap for Supabase later
 * without touching components.
 */
interface LibraryState {
  liked: Track[];
  isLiked: (id: string) => boolean;
  toggleLike: (t: Track) => void;
}

const KEY = "wavely.liked.v1";
const Ctx = createContext<LibraryState | null>(null);
export const useLibrary = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useLibrary outside LibraryProvider");
  return c;
};

function load(): Track[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [liked, setLiked] = useState<Track[]>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(liked));
    } catch {
      /* storage unavailable – keep in memory */
    }
  }, [liked]);

  const toggleLike = useCallback(
    (t: Track) => setLiked((l) => (l.some((x) => x.id === t.id) ? l.filter((x) => x.id !== t.id) : [t, ...l])),
    [],
  );

  const value = useMemo(
    () => ({ liked, toggleLike, isLiked: (id: string) => liked.some((t) => t.id === id) }),
    [liked, toggleLike],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
