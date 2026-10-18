/** Runs an async track query and exposes its result; stale responses (after the inputs changed) are ignored. */
import { useEffect, useState } from "react";
import type { Result } from "../../services/music";

/** `load` is null while the query is not wanted. Returns null until a result arrives. */
export function useLoadedTracks(load: (() => Promise<Result>) | null, deps: readonly unknown[]): Result | null {
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    setResult(null);
    if (!load) return;
    let active = true;
    load().then((r) => active && setResult(r));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return result;
}
