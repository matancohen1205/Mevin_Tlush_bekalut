/** Full-screen player dialog: composes the player's building blocks. */
import { useDialog } from "../../hooks/useDialog";
import { tr, useLang } from "../../i18n";
import { usePlayer } from "../../state/player";
import type { Track } from "../../types";
import { CoverArt } from "./CoverArt";
import { PlayerTopBar } from "./PlayerTopBar";
import { QueueList } from "./QueueList";
import { SeekBar } from "./SeekBar";
import { SourceAttribution } from "./SourceAttribution";
import { TrackInfo } from "./TrackInfo";
import { TransportControls } from "./TransportControls";
import { VolumeSlider } from "./VolumeSlider";

/** The open dialog (focus-trapped; Escape closes). */
function FullPlayerDialog({ track }: { track: Track }) {
  useLang();
  const { playing, setExpanded } = usePlayer();
  const dialog = useDialog<HTMLDivElement>(() => setExpanded(false));
  return (
    <div ref={dialog} tabIndex={-1} className="full" role="dialog" aria-modal="true" aria-label={tr("מתנגן עכשיו")}>
      <div className="backdrop" style={{ backgroundImage: `url("${track.artwork}")` }} />
      <div className="tint" />
      <PlayerTopBar />
      <CoverArt track={track} playing={playing} />
      <TrackInfo track={track} />
      <SeekBar />
      <TransportControls />
      <VolumeSlider />
      <QueueList />
      <SourceAttribution track={track} />
    </div>
  );
}

/** Renders the full player only while it is expanded and a track is loaded. */
export function FullPlayer() {
  const { expanded, current } = usePlayer();
  return expanded && current ? <FullPlayerDialog track={current} /> : null;
}
