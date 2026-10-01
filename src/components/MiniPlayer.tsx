import { usePlayer } from "../state/player";
import { Icon } from "./Icon";
import { tr, useLang } from "../i18n";

export function MiniPlayer() {
  useLang();
  const { current, playing, buffering, toggle, next, position, duration, setExpanded } = usePlayer();
  if (!current) return null;
  return (
    <div className="mini" role="region" aria-label={tr("מתנגן עכשיו")}>
      <button className="open" onClick={() => setExpanded(true)}>
        <img className="art" src={current.artwork} alt="" />
        <span className="meta">
          <div className="t">{current.title}</div>
          <div className="a">{current.artist}</div>
        </span>
      </button>
      <button className="play-fab" data-busy={playing && buffering} onClick={toggle} aria-label={playing ? tr("השהה") : tr("נגן")}>
        <Icon name={playing ? "pause" : "play"} size={20} />
      </button>
      <button className="icon-btn" onClick={next} aria-label={tr("הבא")}>
        <Icon name="next" size={22} />
      </button>
      <div className="progress"><i style={{ width: `${duration ? (position / duration) * 100 : 0}%` }} /></div>
    </div>
  );
}
