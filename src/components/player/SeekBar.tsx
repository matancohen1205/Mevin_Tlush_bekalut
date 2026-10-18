/** Progress slider with elapsed/total time. */
import type { CSSProperties } from "react";
import { formatClock, percentOf } from "../../domain/time";
import { usePlayer } from "../../state/player";
import { tr, useLang } from "../../i18n";

/** Draggable progress bar. */
export function SeekBar() {
  useLang();
  const { position, duration, seek } = usePlayer();
  const fill = { "--pct": `${percentOf(position, duration)}%` } as CSSProperties;
  return (
    <div className="seek">
      <input type="range" min={0} max={duration || 1} step={0.1} value={position} style={fill} onChange={(e) => seek(+e.target.value)} aria-label={tr("התקדמות")} />
      <div className="times"><span>{formatClock(position)}</span><span>{formatClock(duration)}</span></div>
    </div>
  );
}
