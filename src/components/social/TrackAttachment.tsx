/** A song attached to a post: cover, title and a play button. */
import { usePlayer } from "../../state/player";
import type { Track } from "../../types";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";
import { Waveform } from "../common/Waveform";

/** Playing the card plays just this song. */
export function TrackAttachment({ track }: { track: Track }) {
  useLang();
  const { play, current, playing } = usePlayer();
  const active = current?.id === track.id;
  return (
    <button className="attach" onClick={() => play(track, [track])} aria-label={tr("נגן {title}", { title: track.title })}>
      <img src={track.artwork} alt="" loading="lazy" />
      <span className="meta"><span className="t">{track.title}</span><span className="a">{track.artist}</span></span>
      <span className="play-fab sm">{active && playing ? <Waveform playing /> : <Icon name="play" size={18} />}</span>
    </button>
  );
}
