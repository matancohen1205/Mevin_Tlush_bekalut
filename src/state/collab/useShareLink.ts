/** Sharing a playlist as a link: native share sheet when available, otherwise copy to the clipboard. */
import { useCallback } from "react";
import { buildShareUrl, toSharePayload } from "../../domain/shareLink";
import { tr } from "../../i18n";
import { copyText } from "../../services/browser/clipboard";
import { shareLink } from "../../services/browser/nativeShare";
import { appBaseUrl } from "../../services/browser/urlParams";
import type { Playlist } from "../../types";
import { useSocial } from "../social";
import { useUi } from "../ui";

/** Returns `share()` for the given playlist. */
export function useShareLink(playlist: Playlist) {
  const { me } = useSocial();
  const { showToast } = useUi();

  return useCallback(async () => {
    const url = buildShareUrl(appBaseUrl(), toSharePayload(playlist, tr(me.name)));
    const outcome = await shareLink({ title: playlist.title, url });
    if (outcome !== "unsupported") return;
    showToast((await copyText(url)) ? "הקישור הועתק" : url);
  }, [playlist, me.name, showToast]);
}
