/** Actions on a post that leave the feed: copy a share text, or save a shared playlist to the library. */
import { useCallback } from "react";
import { tr } from "../../i18n";
import { copyText } from "../../services/browser/clipboard";
import type { Post } from "../../types";
import { useLibrary } from "../library";
import { useUi } from "../ui";

/** Returns `copyLink(post)` and `savePlaylist(post, authorName)`. */
export function usePostSharing() {
  const { createPlaylist } = useLibrary();
  const { showToast } = useUi();

  /** Copies "title · Wavely" to the clipboard, or shows it in a toast when copying is not allowed. */
  const copyLink = useCallback(
    async (post: Post) => {
      const text = `${post.playlist?.title ?? `${post.track?.title} – ${post.track?.artist}`} · Wavely`;
      showToast((await copyText(text)) ? "הקישור הועתק" : text);
    },
    [showToast],
  );

  /** Saves a copy of a shared playlist into the user's library. */
  const savePlaylist = useCallback(
    (post: Post, authorName: string) => {
      if (!post.playlist) return;
      createPlaylist(tr(post.playlist.title), { description: tr("מאת {name}", { name: authorName }), tracks: post.playlist.tracks });
      showToast("הפלייליסט נשמר בספרייה");
    },
    [createPlaylist, showToast],
  );

  return { copyLink, savePlaylist };
}
