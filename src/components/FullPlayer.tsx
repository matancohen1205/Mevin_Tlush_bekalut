import { useRef } from "react";
import { usePlayer } from "../state/player";
import { useLibrary } from "../state/library";
import { Icon } from "./Icon";
import { Waveform } from "./Waveform";
import { useDialog } from "./useDialog";
import { tr, useLang } from "../i18n";

const SOURCE = { itunes: "תצוגה מקדימה של 30 שניות · באדיבות Apple Music", audius: "שיר מלא · באדיבות Audius", demo: "שיר דמה שנוצר במחשב" } as const;
const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const pct = (v: number, max: number) => ({ "--pct": `${max ? (v / max) * 100 : 0}%` }) as React.CSSProperties;

function FullPlayerOpen() {
  useLang();
  const p = usePlayer();
  const { isLiked, toggleLike } = useLibrary();
  const dragFrom = useRef<number | null>(null);
  const dlg = useDialog<HTMLDivElement>(() => p.setExpanded(false));

  const t = p.current;
  if (!t) return null;
  const liked = isLiked(t.id);
  const upcoming = p.queue.map((track, i) => ({ track, i })).filter(({ i }) => i !== p.index);

  return (
    <div ref={dlg} tabIndex={-1} className="full" role="dialog" aria-modal="true" aria-label={tr("מתנגן עכשיו")}>
      <div className="backdrop" style={{ backgroundImage: `url("${t.artwork}")` }} />
      <div className="tint" />

      <div className="top">
        <button className="icon-btn" onClick={() => p.setExpanded(false)} aria-label={tr("סגור נגן")}><Icon name="down" /></button>
        <span className="label">{tr("מתנגן עכשיו")}</span>
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
        <button className={`icon-btn ${liked ? "on" : ""}`} onClick={() => toggleLike(t)} aria-pressed={liked} aria-label={liked ? tr("הסר מאהובים") : tr("הוסף לאהובים")}>
          <Icon name="heart" size={28} fill={liked} />
        </button>
      </div>

      <div className="seek">
        <input type="range" min={0} max={p.duration || 1} step={0.1} value={p.position} style={pct(p.position, p.duration)} onChange={(e) => p.seek(+e.target.value)} aria-label={tr("התקדמות")} />
        <div className="times"><span>{fmt(p.position)}</span><span>{fmt(p.duration)}</span></div>
      </div>

      <div className="controls">
        <button className={`icon-btn ${p.shuffle ? "active" : ""}`} onClick={p.toggleShuffle} aria-pressed={p.shuffle} aria-label={tr("ערבוב")}><Icon name="shuffle" /></button>
        <button className="icon-btn" onClick={p.prev} aria-label={tr("הקודם")}><Icon name="prev" size={30} /></button>
        <button className="play-fab" data-busy={p.playing && p.buffering} onClick={p.toggle} aria-label={p.playing ? tr("השהה") : tr("נגן")} aria-busy={p.playing && p.buffering}><Icon name={p.playing ? "pause" : "play"} size={32} /></button>
        <button className="icon-btn" onClick={p.next} aria-label={tr("הבא")}><Icon name="next" size={30} /></button>
        <button className={`icon-btn ${p.repeat !== "off" ? "active" : ""}`} onClick={p.cycleRepeat} aria-label={`${tr("חזרה")}: ${p.repeat}`}>
          <Icon name="repeat" />
          {p.repeat === "one" && <span style={{ position: "absolute", fontSize: 10, fontWeight: 800 }}>1</span>}
        </button>
      </div>

      <div className="volume">
        <Icon name="volume" size={20} />
        <input type="range" min={0} max={1} step={0.01} value={p.volume} style={pct(p.volume, 1)} onChange={(e) => p.setVolume(+e.target.value)} aria-label={tr("עוצמה")} />
      </div>

      {upcoming.length > 0 && (
        <div className="queue">
          <h3>{tr("הבא בתור")}</h3>
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

      <p className="attrib">
        {tr(SOURCE[t.source])}
        {t.sourceUrl && <> · <a href={t.sourceUrl} target="_blank" rel="noreferrer">{tr("פתיחה במקור")}</a></>}
      </p>
    </div>
  );
}

export function FullPlayer() {
  const { expanded, current } = usePlayer();
  return expanded && current ? <FullPlayerOpen /> : null;
}
