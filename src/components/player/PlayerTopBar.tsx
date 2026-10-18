/** Header of the full player: close button, title and a live waveform. */
import { usePlayer } from "../../state/player";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";
import { Waveform } from "../common/Waveform";

/** Top row of the full-screen player. */
export function PlayerTopBar() {
  useLang();
  const { playing, setExpanded } = usePlayer();
  return (
    <div className="top">
      <button className="icon-btn" onClick={() => setExpanded(false)} aria-label={tr("סגור נגן")}><Icon name="down" /></button>
      <span className="label">{tr("מתנגן עכשיו")}</span>
      <Waveform playing={playing} />
    </div>
  );
}
