/** Search screen: search box, country filter, genre shortcuts and results. */
import { useState } from "react";
import { CountryChips } from "../components/home/CountryChips";
import { GenreTiles } from "../components/search/GenreTiles";
import { SearchBox } from "../components/search/SearchBox";
import { SearchResults } from "../components/search/SearchResults";
import { useTrackSearch } from "../state/catalog";
import { usePrefs } from "../state/prefs";
import { tr, useLang } from "../i18n";

/** Page composition only; the search itself is the useTrackSearch hook. */
export function Search() {
  useLang();
  const prefs = usePrefs();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState(prefs.country);
  const term = query.trim();
  const { result, loading } = useTrackSearch(term, country, prefs.source);

  return (
    <main id="main" tabIndex={-1} className="page">
      <h1 className="page-title">{tr("חיפוש")}</h1>
      <SearchBox value={query} onChange={setQuery} />
      {prefs.source === "itunes" && <div style={{ marginTop: 8 }}><CountryChips value={country} onChange={setCountry} label={tr("חיפוש לפי מדינה")} /></div>}
      {term ? <SearchResults term={term} result={result} loading={loading} /> : <GenreTiles onPick={setQuery} />}
    </main>
  );
}
