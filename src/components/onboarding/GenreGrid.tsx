/** Multi-select grid of genre tiles. */
import type { CSSProperties } from "react";
import { GENRES } from "../../state/catalog";
import { tr, useLang } from "../../i18n";

/** `selected` holds genre ids; `onToggle` flips one. */
export function GenreGrid({ selected, onToggle }: { selected: string[]; onToggle: (id: string) => void }) {
  useLang();
  return (
    <div className="tiles">
      {GENRES.map((g) => (
        <button key={g.id} className="tile" aria-pressed={selected.includes(g.id)} style={{ "--h": g.hue } as CSSProperties} onClick={() => onToggle(g.id)}>{tr(g.label)}</button>
      ))}
    </div>
  );
}
