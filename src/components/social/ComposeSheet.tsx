/** "Share with the community" dialog: pick a song or playlist, add a caption, publish. */
import { useState } from "react";
import { buildPost, canPublish, defaultShareKind, shareableTracks, type ShareKind } from "../../domain/posts";
import { tr, useLang } from "../../i18n";
import { useLibrary } from "../../state/library";
import { usePlayer } from "../../state/player";
import { useSocial } from "../../state/social";
import { useUi } from "../../state/ui";
import type { Track } from "../../types";
import { Modal } from "../layout/Modal";
import { PlaylistPicker, TrackPicker } from "./SharePicker";

/** Share dialog; the decisions (what is valid, which card to create) come from domain/posts. */
export function ComposeSheet() {
  useLang();
  const social = useSocial();
  const library = useLibrary();
  const { current } = usePlayer();
  const { setSheet, showToast } = useUi();

  const [kind, setKind] = useState<ShareKind>(defaultShareKind(current, library.playlists));
  const [track, setTrack] = useState<Track | null>(current);
  const [playlistId, setPlaylistId] = useState<string | null>(library.playlists[0]?.id ?? null);
  const [caption, setCaption] = useState("");
  const playlist = library.playlists.find((p) => p.id === playlistId);

  /** Publishes the post and closes the dialog. */
  const publish = () => {
    const post = buildPost(kind, track, playlist, caption, current?.id);
    if (post) social.createPost(post);
    showToast("השיתוף פורסם");
    setSheet(null);
  };

  return (
    <Modal title={tr("שיתוף בקהילה")}>
      <div className="seg" role="tablist">
        <button role="tab" aria-selected={kind === "track"} onClick={() => setKind("track")}>{tr("שיר")}</button>
        <button role="tab" aria-selected={kind === "playlist"} onClick={() => setKind("playlist")}>{tr("פלייליסט")}</button>
      </div>
      {kind === "track"
        ? <TrackPicker tracks={shareableTracks(current, library.liked)} selectedId={track?.id} nowPlayingId={current?.id} onPick={setTrack} />
        : <PlaylistPicker playlists={library.playlists} selectedId={playlistId} onPick={setPlaylistId} />}
      <label className="lbl" htmlFor="cap">{tr("מה תרצו להגיד?")}</label>
      <textarea id="cap" className="input" rows={2} value={caption} onChange={(e) => setCaption(e.target.value)} placeholder={tr("הוסיפו כמה מילים (לא חובה)")} />
      <button className="btn primary wide" disabled={!canPublish(kind, track, playlist)} onClick={publish}>{tr("פרסם")}</button>
    </Modal>
  );
}
