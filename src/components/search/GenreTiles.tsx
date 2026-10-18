/** Colourful genre tiles; tapping one starts a search for that genre. */
import type { CSSProperties } from "react";
import { GENRES } from "../../state/catalog";
import { tr, useLang } from "../../i18n";

/** Grid of genre shortcuts. */
export function GenreTiles({ onPick }: { onPick: (searchTerm: string) => void }) {
  useLang();
  return (
    <section className="section">
      <div className="section-head"><h2>{tr("גלו לפי ז׳אנר")}</h2></div>
      <div className="tiles">
        {GENRES.map((g) => (
          <button key={g.id} className="tile" style={{ "--h": g.hue } as CSSProperties} onClick={() => onPick(g.term)}>{tr(g.label)}</button>
        ))}
      </div>
    </section>
  );
}
