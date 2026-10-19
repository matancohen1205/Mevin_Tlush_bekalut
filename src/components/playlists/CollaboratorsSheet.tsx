/** Dialog for managing who can add songs to a playlist. */
import { tr, useLang } from "../../i18n";
import { useInvite } from "../../state/collab";
import { useLibrary } from "../../state/library";
import type { Playlist } from "../../types";
import { Modal } from "../layout/Modal";
import { CollaboratorList } from "./CollaboratorList";
import { InvitePeopleList } from "./InvitePeopleList";

/** Shell: finds the playlist, then composes the two lists. */
export function CollaboratorsSheet({ playlistId }: { playlistId: string }) {
  useLang();
  const playlist = useLibrary().playlists.find((p) => p.id === playlistId);
  if (!playlist) return null;
  return <CollaboratorsContent playlist={playlist} />;
}

/** Split out so the invite hook only runs once the playlist exists. */
function CollaboratorsContent({ playlist }: { playlist: Playlist }) {
  useLang();
  const { invitable, invite, remove } = useInvite(playlist);
  return (
    <Modal title={tr("פלייליסט שיתופי")}>
      <p className="muted">{tr("חברים שתזמינו יוכלו להוסיף שירים לפלייליסט הזה.")}</p>
      <div className="section-head" style={{ marginTop: 16 }}><h2>{tr("משתפי פעולה")}</h2></div>
      <CollaboratorList userIds={playlist.collaborators} onRemove={remove} />
      <div className="section-head" style={{ marginTop: 20 }}><h2>{tr("הזמנת חברים")}</h2></div>
      <InvitePeopleList people={invitable} onInvite={invite} />
    </Modal>
  );
}
