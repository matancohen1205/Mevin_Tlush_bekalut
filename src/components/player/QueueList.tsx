/** "Up next" list; rows can be dragged to reorder the queue or clicked to jump. */
import { useRef } from "react";
import { usePlayer } from "../../state/player";
import { tr, useLang } from "../../i18n";
import { Icon } from "../common/Icon";

/** Upcoming tracks (everything except the current one). */
export function QueueList() {
  useLang();
  const { queue, index, moveInQueue, jumpTo } = usePlayer();
  const dragFrom = useRef<number | null>(null);
  const upcoming = queue.map((track, i) => ({ track, i })).filter(({ i }) => i !== index);
  if (!upcoming.length) return null;

  return (
    <div className="queue">
      <h3>{tr("הבא בתור")}</h3>
      <div className="rows">
        {upcoming.map(({ track, i }) => (
          <div key={track.id} className="row" draggable onDragStart={() => (dragFrom.current = i)} onDragOver={(e) => e.preventDefault()}
            onDrop={() => dragFrom.current !== null && moveInQueue(dragFrom.current, i)}>
            <span className="icon-btn" aria-hidden="true" style={{ cursor: "grab" }}><Icon name="grip" size={18} /></span>
            <button className="row" style={{ padding: 0, flex: 1, minWidth: 0 }} onClick={() => jumpTo(i)}>
              <img className="art" src={track.artwork} alt="" loading="lazy" />
              <span className="meta"><div className="t">{track.title}</div><div className="a">{track.artist}</div></span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
