/** Edit/delete behaviour of one playlist page: inline editing of title and description, and confirmed deletion. */
import { useState } from "react";
import { tr } from "../../i18n";
import type { Playlist } from "../../types";
import { useUi } from "../ui";
import { useLibrary } from "./LibraryContext";

/** `onDeleted` runs after the playlist is removed (the page navigates back). */
export function usePlaylistEditor(playlist: Playlist, onDeleted: () => void) {
  const { updatePlaylist, deletePlaylist } = useLibrary();
  const { showToast } = useUi();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(playlist.title);
  const [description, setDescription] = useState(playlist.description);

  return {
    editing, title, description, setTitle, setDescription,
    toggleEditing: () => setEditing((e) => !e),
    /** Saves the edited fields (an empty title keeps the old one). */
    save: () => { updatePlaylist(playlist.id, { title: title.trim() || playlist.title, description }); setEditing(false); },
    /** Deletes after the user confirms. */
    remove: () => {
      if (!confirm(tr("למחוק את ״{title}״?", { title: playlist.title }))) return;
      deletePlaylist(playlist.id);
      showToast(tr("הפלייליסט נמחק"));
      onDeleted();
    },
    /** Flips between public and private. */
    toggleVisibility: () => updatePlaylist(playlist.id, { visibility: playlist.visibility === "public" ? "private" : "public" }),
  };
}
