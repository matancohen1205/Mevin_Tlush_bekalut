/** Dialog shown when the app is opened from a share link: preview, play, or save a copy. */
import type { SharePayload } from "../../types";
import { tr, useLang, trn } from "../../i18n";
import { useSharedPlaylist } from "../../state/collab";
import { Icon } from "../common/Icon";
import { Modal } from "../layout/Modal";
import { PlaylistCover } from "./PlaylistCover";

/** `payload` is the validated content of the link. */
export function SharedPlaylistSheet({ payload }: { payload: SharePayload }) {
  useLang();
  const shared = useSharedPlaylist(payload);
  return (
    <Modal title={tr("פלייליסט ששותף איתך")}>
      <div className="pl-head">
        <PlaylistCover tracks={shared.tracks} size={96} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0 }}>{shared.title}</h3>
          {shared.by && <p className="muted">{tr("מאת {name}", { name: shared.by })}</p>}
          <p className="muted">{trn("{n} שירים", shared.tracks.length)}</p>
        </div>
      </div>
      <div className="rows" style={{ marginTop: 12, maxHeight: "30vh", overflowY: "auto" }}>
        {shared.tracks.map((t) => (
          <div key={t.id} className="row"><img className="art" src={t.artwork} alt="" loading="lazy" /><span className="meta"><div className="t">{t.title}</div><div className="a">{t.artist}</div></span></div>
        ))}
      </div>
      <div className="actions" style={{ marginTop: 16 }}>
        <button className="btn primary" onClick={shared.playAll}><Icon name="play" size={18} /> {tr("נגן")}</button>
        <button className="btn" onClick={shared.save} style={{ boxShadow: "var(--shadow-sm)" }}><Icon name="plus" size={18} /> {tr("שמור לספרייה")}</button>
      </div>
    </Modal>
  );
}
