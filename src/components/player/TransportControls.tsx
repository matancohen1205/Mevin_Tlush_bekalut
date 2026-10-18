/** Shuffle, previous, play/pause, next and repeat buttons. */
import { usePlayer } from "../../state/player";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";

/** The main playback buttons. */
export function TransportControls() {
  useLang();
  const p = usePlayer();
  const busy = p.playing && p.buffering;
  return (
    <div className="controls">
      <button className={`icon-btn ${p.shuffle ? "active" : ""}`} onClick={p.toggleShuffle} aria-pressed={p.shuffle} aria-label={tr("ערבוב")}><Icon name="shuffle" /></button>
      <button className="icon-btn" onClick={p.prev} aria-label={tr("הקודם")}><Icon name="prev" size={30} /></button>
      <button className="play-fab" data-busy={busy} onClick={p.toggle} aria-label={p.playing ? tr("השהה") : tr("נגן")} aria-busy={busy}>
        <Icon name={p.playing ? "pause" : "play"} size={32} />
      </button>
      <button className="icon-btn" onClick={p.next} aria-label={tr("הבא")}><Icon name="next" size={30} /></button>
      <button className={`icon-btn ${p.repeat !== "off" ? "active" : ""}`} onClick={p.cycleRepeat} aria-label={`${tr("חזרה")}: ${p.repeat}`}>
        <Icon name="repeat" />
        {p.repeat === "one" && <span style={{ position: "absolute", fontSize: 10, fontWeight: 800 }}>1</span>}
      </button>
    </div>
  );
}
