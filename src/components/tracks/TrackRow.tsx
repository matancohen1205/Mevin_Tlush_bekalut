/** One line in a track list: play, add to playlist, like. */
import { usePlayer } from "../../state/player";
import { useUi } from "../../state/ui";
import type { Track } from "../../types";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";
import { Waveform } from "../common/Waveform";
import { LikeButton } from "./LikeButton";

interface Props {
  track: Track;
  /** list the track belongs to; becomes the play queue */
  queue: Track[];
  rank?: number;
  /** hide the "add to playlist" button (e.g. inside a playlist) */
  noAdd?: boolean;
}

/** A single track line. The rank is replaced by a waveform while the track plays. */
export function TrackRow({ track, queue, rank, noAdd }: Props) {
  useLang();
  const { play, current, playing } = usePlayer();
  const { setSheet } = useUi();
  const active = current?.id === track.id;
  return (
    <div className="row" data-active={active}>
      <button className="row" style={{ padding: 0, flex: 1, minWidth: 0 }} onClick={() => play(track, queue)} aria-label={`${tr("נגן")} ${track.title}`}>
        {rank !== undefined && <span className="rank">{active ? <Waveform playing={playing} /> : rank}</span>}
        <img className="art" src={track.artwork} alt="" loading="lazy" />
        <span className="meta">
          <div className="t">{track.title}</div>
          <div className="a">{track.artist}</div>
        </span>
      </button>
      {!noAdd && (
        <button className="icon-btn" onClick={() => setSheet({ kind: "add", track })} aria-label={tr("הוסף לפלייליסט")}>
          <Icon name="plus" />
        </button>
      )}
      <LikeButton track={track} />
    </div>
  );
}
