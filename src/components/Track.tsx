import type { Track } from "../types";
import { useLibrary } from "../state/library";
import { usePlayer } from "../state/player";
import { useUi } from "../state/ui";
import { he } from "../i18n/he";
import { Icon } from "./Icon";
import { Waveform } from "./Waveform";

export function TrackCard({ track, queue }: { track: Track; queue: Track[] }) {
  const { play } = usePlayer();
  return (
    <button className="card" onClick={() => play(track, queue)} aria-label={`${he.player.play} ${track.title} – ${track.artist}`}>
      <img className="art" src={track.artwork} alt="" loading="lazy" />
      <div className="t">{track.title}</div>
      <div className="a">{track.artist}</div>
    </button>
  );
}

export function TrackRow({ track, queue, rank, noAdd }: { track: Track; queue: Track[]; rank?: number; noAdd?: boolean }) {
  const { play, current, playing } = usePlayer();
  const { isLiked, toggleLike } = useLibrary();
  const { setSheet } = useUi();
  const active = current?.id === track.id;
  const liked = isLiked(track.id);
  return (
    <div className="row" data-active={active}>
      <button className="row" style={{ padding: 0, flex: 1, minWidth: 0 }} onClick={() => play(track, queue)} aria-label={`${he.player.play} ${track.title}`}>
        {rank !== undefined && <span className="rank">{active ? <Waveform playing={playing} /> : rank}</span>}
        <img className="art" src={track.artwork} alt="" loading="lazy" />
        <span className="meta">
          <div className="t">{track.title}</div>
          <div className="a">{track.artist}</div>
        </span>
      </button>
      {!noAdd && (
        <button className="icon-btn" onClick={() => setSheet({ kind: "add", track })} aria-label="הוסף לפלייליסט">
          <Icon name="plus" />
        </button>
      )}
      <button className={`icon-btn ${liked ? "on" : ""}`} onClick={() => toggleLike(track)} aria-pressed={liked} aria-label={liked ? he.player.unlike : he.player.like}>
        <Icon name="heart" fill={liked} />
      </button>
    </div>
  );
}
