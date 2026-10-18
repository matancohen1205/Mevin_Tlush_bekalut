/** Renders whichever dialog the UI state asks for, plus the toast. Lives once at the app root. */
import { useUi } from "../../state/ui";
import { AddToPlaylistSheet } from "../playlists/AddToPlaylistSheet";
import { NewPlaylistSheet } from "../playlists/NewPlaylistSheet";
import { CommentsSheet } from "../social/CommentsSheet";
import { ComposeSheet } from "../social/ComposeSheet";
import { EditProfileSheet } from "../social/EditProfileSheet";
import { MoreSheet } from "../social/MoreSheet";

/** Maps `ui.sheet` to the matching dialog component. */
export function SheetHost() {
  const { sheet, toast } = useUi();
  return (
    <>
      {sheet?.kind === "add" && <AddToPlaylistSheet track={sheet.track} />}
      {sheet?.kind === "new" && <NewPlaylistSheet />}
      {sheet?.kind === "comments" && <CommentsSheet postId={sheet.postId} />}
      {sheet?.kind === "compose" && <ComposeSheet />}
      {sheet?.kind === "editProfile" && <EditProfileSheet />}
      {sheet?.kind === "more" && <MoreSheet postId={sheet.postId} userId={sheet.userId} />}
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  );
}
