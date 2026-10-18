/** Mirrors the local library to the cloud while the user is signed in. */
import { useEffect, useRef } from "react";
import { useAuth } from "../auth/AuthContext";
import type { LibrarySnapshot } from "./libraryStorage";
import { initialSync, pushChanges, type SyncMark } from "./librarySync";

const PUSH_DELAY_MS = 600;

/** On login: load/merge the cloud copy. Afterwards: push changes (debounced). */
export function useCloudSync(library: LibrarySnapshot, replaceLibrary: (next: LibrarySnapshot) => void): void {
  const { userId } = useAuth();
  const mark = useRef<SyncMark | null>(null);
  const latest = useRef(library);
  latest.current = library;

  useEffect(() => {
    mark.current = null;
    if (!userId) return;
    let active = true;
    initialSync(userId, latest.current)
      .then((result) => { if (!active) return; mark.current = result.mark; replaceLibrary(result.library); })
      .catch((e) => console.warn("Wavely: could not load cloud library", e));
    return () => { active = false; };
  }, [userId, replaceLibrary]);

  useEffect(() => {
    const current = mark.current;
    if (!userId || !current || current.uid !== userId) return;
    const timer = setTimeout(() => pushChanges(current, library).catch((e) => console.warn("Wavely: cloud sync failed, will retry on next change", e)), PUSH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [library, userId]);
}
