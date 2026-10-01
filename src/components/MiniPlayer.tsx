import { usePlayer } from "../state/player";
import { he } from "../i18n/he";
import { Icon } from "./Icon";

export function MiniPlayer() {
  const { current, playing, toggle, next, position, duration, setExpanded } = usePlayer();
  if (!current) return null;
  return (
    <div className="mini" role="region" aria-label={he.player.nowPlaying}>
      <button className="open" onClick={() => setExpanded(true)}>
        <img className="art" src={current.artwork} alt="" />
        <span className="meta">
          <div className="t">{current.title}</div>
          <div className="a">{current.artist}</div>
        </span>
      </button>
      <button className="play-fab" onClick={toggle} aria-label={playing ? he.player.pause : he.player.play}>
        <Icon name={playing ? "pause" : "play"} size={20} />
      </button>
      <button className="icon-btn" onClick={next} aria-label={he.player.next}>
        <Icon name="next" size={22} />
      </button>
      <div className="progress"><i style={{ width: `${duration ? (position / duration) * 100 : 0}%` }} /></div>
    </div>
  );
}
