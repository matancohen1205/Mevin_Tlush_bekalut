/** Debounced free-text search. */
import { useEffect, useState } from "react";
import { music, type Result, type Source } from "../../services/music";

const DEBOUNCE_MS = 350;
const LIMIT = 25;

/** Results for `term` (empty term → no search). `loading` is true from typing until the answer arrives. */
export function useTrackSearch(term: string, country: string, source: Source): { result: Result | null; loading: boolean } {
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!term) { setResult(null); setLoading(false); return; }
    let active = true;
    setLoading(true);
    const timer = setTimeout(() => {
      music.search(term, country, LIMIT, source).then((r) => { if (active) { setResult(r); setLoading(false); } });
    }, DEBOUNCE_MS);
    return () => { active = false; clearTimeout(timer); };
  }, [term, country, source]);

  return { result, loading };
}
