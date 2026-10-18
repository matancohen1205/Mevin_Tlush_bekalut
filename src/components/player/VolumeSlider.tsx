/** Volume slider. */
import type { CSSProperties } from "react";
import { percentOf } from "../../domain/time";
import { usePlayer } from "../../state/player";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";

/** Volume control with speaker icon. */
export function VolumeSlider() {
  useLang();
  const { volume, setVolume } = usePlayer();
  const fill = { "--pct": `${percentOf(volume, 1)}%` } as CSSProperties;
  return (
    <div className="volume">
      <Icon name="volume" size={20} />
      <input type="range" min={0} max={1} step={0.01} value={volume} style={fill} onChange={(e) => setVolume(+e.target.value)} aria-label={tr("עוצמה")} />
    </div>
  );
}
