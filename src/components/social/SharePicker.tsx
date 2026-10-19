/** Selectable lists used by the share dialog: songs or playlists. */
import { tr, useLang, trn } from "../../i18n";
import type { Playlist, Track } from "../../types";
import { Icon } from "../common/Icon";

interface TrackPickerProps {
  tracks: Track[];
  selectedId: string | undefined;
  nowPlayingId: string | undefined;
  onPick: (track: Track) => void;
}

/** Choose one song (the one playing now is labelled). */
export function TrackPicker({ tracks, selectedId, nowPlayingId, onPick }: TrackPickerProps) {
  useLang();
  if (!tracks.length) return <p className="muted" style={{ marginTop: 12 }}>{tr("נגנו שיר או סמנו שירים באהבתי כדי לשתף אותם.")}</p>;
  return (
    <div className="rows" style={{ marginTop: 12 }}>
      {tracks.map((t) => (
        <button key={t.id} className="row" data-active={selectedId === t.id} onClick={() => onPick(t)}>
          <img className="art" src={t.artwork} alt="" />
          <span className="meta"><div className="t">{t.title}</div><div className="a">{t.artist}{t.id === nowPlayingId ? ` · ${tr("מתנגן עכשיו")}` : ""}</div></span>
          {selectedId === t.id && <Icon name="check" />}
        </button>
      ))}
    </div>
  );
}

interface PlaylistPickerProps {
  playlists: Playlist[];
  selectedId: string | null;
  onPick: (id: string) => void;
}

/** Choose one playlist. */
export function PlaylistPicker({ playlists, selectedId, onPick }: PlaylistPickerProps) {
  useLang();
  if (!playlists.length) return <p className="muted" style={{ marginTop: 12 }}>{tr("עוד אין לכם פלייליסטים. צרו אחד בספרייה.")}</p>;
  return (
    <div className="rows" style={{ marginTop: 12 }}>
      {playlists.map((p) => (
        <button key={p.id} className="row" data-active={selectedId === p.id} onClick={() => onPick(p.id)}>
          <span className="meta"><div className="t">{p.title}</div><div className="a">{trn("{n} שירים", p.tracks.length)}</div></span>
          {selectedId === p.id && <Icon name="check" />}
        </button>
      ))}
    </div>
  );
}
