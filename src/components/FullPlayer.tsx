import { useEffect, useRef } from "react";
import { usePlayer } from "../state/player";
import { useLibrary } from "../state/library";
import { he } from "../i18n/he";
import { Icon } from "./Icon";
import { Waveform } from "./Waveform";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const pct = (v: number, max: number) => ({ "--pct": `${max ? (v / max) * 100 : 0}%` }) as React.CSSProperties;

export function FullPlayer() {
  const p = usePlayer();
  const { isLiked, toggleLike } = useLibrary();
  const dragFrom = useRef<number | null>(null);
  const { expanded, setExpanded } = p;

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setExpanded(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, setExpanded]);

  const t = p.current;
  if (!p.expanded || !t) return null;
  const liked = isLiked(t.id);
  const upcoming = p.queue.map((track, i) => ({ track, i })).filter(({ i }) => i !== p.index);

  return (
    <div className="full" role="dialog" aria-modal="true" aria-label={he.player.nowPlaying}>
      <div className="backdrop" style={{ backgroundImage: `url("${t.artwork}")` }} />
      <div className="tint" />

      <div className="top">
        <button className="icon-btn" onClick={() => p.setExpanded(false)} aria-label={he.player.close}><Icon name="down" /></button>
        <span className="label">{he.player.nowPlaying}</span>
        <Waveform playing={p.playing} />
      </div>

      <div className="cover-wrap">
        <img className="cover" data-playing={p.playing} src={t.artwork} alt={`${t.title} – ${t.artist}`} />
      </div>

      <div className="info">
        <div className="meta">
          <h2>{t.title}</h2>
          <div className="artist">{t.artist}</div>
        </div>
        <button className={`icon-btn ${liked ? "on" : ""}`} onClick={() => toggleLike(t)} aria-pressed={liked} aria-label={liked ? he.player.unlike : he.player.like}>
          <Icon name="heart" size={28} fill={liked} />
        </button>
      </div>

      <div className="seek">
        <input type="range" min={0} max={p.duration || 1} step={0.1} value={p.position} style={pct(p.position, p.duration)} onChange={(e) => p.seek(+e.target.value)} aria-label="התקדמות" />
        <div className="times"><span>{fmt(p.position)}</span><span>{fmt(p.duration)}</span></div>
      </div>

      <div className="controls">
        <button className={`icon-btn ${p.shuffle ? "active" : ""}`} onClick={p.toggleShuffle} aria-pressed={p.shuffle} aria-label={he.player.shuffle}><Icon name="shuffle" /></button>
        <button className="icon-btn" onClick={p.prev} aria-label={he.player.prev}><Icon name="prev" size={30} /></button>
        <button className="play-fab" onClick={p.toggle} aria-label={p.playing ? he.player.pause : he.player.play}><Icon name={p.playing ? "pause" : "play"} size={32} /></button>
        <button className="icon-btn" onClick={p.next} aria-label={he.player.next}><Icon name="next" size={30} /></button>
        <button className={`icon-btn ${p.repeat !== "off" ? "active" : ""}`} onClick={p.cycleRepeat} aria-label={`${he.player.repeat}: ${p.repeat}`}>
          <Icon name="repeat" />
          {p.repeat === "one" && <span style={{ position: "absolute", fontSize: 10, fontWeight: 800 }}>1</span>}
        </button>
      </div>

      <div className="volume">
        <Icon name="volume" size={20} />
        <input type="range" min={0} max={1} step={0.01} value={p.volume} style={pct(p.volume, 1)} onChange={(e) => p.setVolume(+e.target.value)} aria-label={he.player.volume} />
      </div>

      {upcoming.length > 0 && (
        <div className="queue">
          <h3>{he.player.queue}</h3>
          <div className="rows">
            {upcoming.map(({ track, i }) => (
              <div
                key={track.id}
                className="row"
                draggable
                onDragStart={() => (dragFrom.current = i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => dragFrom.current !== null && p.moveInQueue(dragFrom.current, i)}
              >
                <span className="icon-btn" aria-hidden="true" style={{ cursor: "grab" }}><Icon name="grip" size={18} /></span>
                <button className="row" style={{ padding: 0, flex: 1, minWidth: 0 }} onClick={() => p.jumpTo(i)}>
                  <img className="art" src={track.artwork} alt="" loading="lazy" />
                  <span className="meta"><div className="t">{track.title}</div><div className="a">{track.artist}</div></span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="attrib">{he.player.source[t.source]}</p>
    </div>
  );
}
