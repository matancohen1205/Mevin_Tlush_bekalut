/** The playlist inside an incoming share link: its tracks, and the actions to play or save it. */
import { useMemo } from "react";
import { fromSharedTracks } from "../../domain/shareLink";
import { tr } from "../../i18n";
import { coverFor } from "../../services/music/covers";
import type { SharePayload } from "../../types";
import { useLibrary } from "../library";
import { usePlayer } from "../player";
import { useUi } from "../ui";

/** View model for the "shared playlist" dialog. */
export function useSharedPlaylist(payload: SharePayload) {
  const { createPlaylist } = useLibrary();
  const { play } = usePlayer();
  const { setSheet, showToast } = useUi();
  const tracks = useMemo(() => fromSharedTracks(payload.tracks, coverFor), [payload]);

  return {
    title: payload.title, description: payload.description, by: payload.by, tracks,
    /** Plays the playlist from the first track. */
    playAll: () => tracks[0] && play(tracks[0], tracks),
    /** Saves a private copy into the user's library and closes the dialog. */
    save: () => {
      createPlaylist(payload.title, { description: payload.by ? tr("מאת {name}", { name: payload.by }) : payload.description, tracks });
      showToast("הפלייליסט נשמר בספרייה");
      setSheet(null);
    },
  };
}
