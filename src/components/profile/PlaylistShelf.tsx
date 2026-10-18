/** Horizontal shelf of playlist cards (cover mosaic, title, count). */
import { usePlayer } from "../../state/player";
import type { Track } from "../../types";
import { tr, useLang } from "../../i18n";

export interface ShelfPlaylist {
  title: string;
  tracks: Track[];
}

/** Tapping a card plays that playlist. `translateTitles` localises seeded titles. */
export function PlaylistShelf({ playlists, translateTitles = false }: { playlists: ShelfPlaylist[]; translateTitles?: boolean }) {
  useLang();
  const { play } = usePlayer();
  return (
    <div className="hscroll">
      {playlists.map((p) => {
        const title = translateTitles ? tr(p.title) : p.title;
        return (
          <button key={p.title} className="card" onClick={() => p.tracks[0] && play(p.tracks[0], p.tracks)} aria-label={tr("נגן {title}", { title })}>
            <div className="mosaic art" style={{ width: 148, height: 148, borderRadius: 16 }}>{p.tracks.slice(0, 4).map((t, i) => <img key={i} src={t.artwork} alt="" />)}</div>
            <div className="t">{title}</div><div className="a">{tr("{n} שירים", { n: p.tracks.length })}</div>
          </button>
        );
      })}
    </div>
  );
}
