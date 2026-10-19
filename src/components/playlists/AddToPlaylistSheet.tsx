/** Dialog for adding one track to an existing playlist, or to a new one created on the spot. */
import { useState } from "react";
import { tr, useLang, trn } from "../../i18n";
import { useLibrary } from "../../state/library";
import { useUi } from "../../state/ui";
import type { Track } from "../../types";
import { Icon } from "../common/Icon";
import { Modal } from "../layout/Modal";

/** Lists playlists (already-containing ones are disabled) with a "create and add" form. */
export function AddToPlaylistSheet({ track }: { track: Track }) {
  useLang();
  const { playlists, addToPlaylist, createPlaylist } = useLibrary();
  const { setSheet, showToast } = useUi();
  const [name, setName] = useState("");

  /** Adds the track, confirms and closes. */
  const addTo = (id: string, title: string) => {
    addToPlaylist(id, track);
    showToast(tr("נוסף ל״{title}״", { title }));
    setSheet(null);
  };

  return (
    <Modal title={tr("הוספה לפלייליסט")}>
      <p className="muted" style={{ marginBottom: 12 }}>{track.title} · {track.artist}</p>
      <div className="rows">
        {playlists.map((p) => {
          const has = p.tracks.some((t) => t.id === track.id);
          return (
            <button key={p.id} className="row" disabled={has} onClick={() => addTo(p.id, p.title)}>
              <span className="meta"><div className="t">{p.title}</div><div className="a">{trn("{n} שירים", p.tracks.length)}</div></span>
              {has && <Icon name="check" />}
            </button>
          );
        })}
      </div>
      <form className="inline-form" onSubmit={(e) => { e.preventDefault(); if (name.trim()) addTo(createPlaylist(name), name.trim()); }}>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder={tr("פלייליסט חדש…")} aria-label={tr("שם פלייליסט חדש")} />
        <button className="btn primary" disabled={!name.trim()}>{tr("צור והוסף")}</button>
      </form>
    </Modal>
  );
}
