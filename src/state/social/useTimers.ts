/** A `later(ms, fn)` scheduler whose pending timers are cancelled when the component unmounts. */
import { useCallback, useEffect, useRef } from "react";

/** Returns `later`, a safe replacement for setTimeout inside providers. */
export function useTimers(): (ms: number, fn: () => void) => void {
  const ids = useRef<number[]>([]);
  useEffect(() => () => ids.current.forEach(clearTimeout), []);
  return useCallback((ms, fn) => { ids.current.push(window.setTimeout(fn, ms)); }, []);
}
