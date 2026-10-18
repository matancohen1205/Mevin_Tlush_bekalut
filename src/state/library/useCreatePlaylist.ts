/** Creates a playlist from the "new playlist" form, either by hand or from a sentence (smart create). */
import { useCallback } from "react";
import { tr } from "../../i18n";
import type { Playlist } from "../../types";
import { useUi } from "../ui";
import { useLibrary } from "./LibraryContext";
import { useSmartPlaylist } from "./useSmartPlaylist";

export interface PlaylistForm {
  mode: "manual" | "smart";
  title: string;
  description: string;
  visibility: Playlist["visibility"];
  /** the sentence used by smart create */
  prompt: string;
}

/** Returns `create(form)`: makes the playlist, shows a confirmation and closes the dialog. */
export function useCreatePlaylist() {
  const { createPlaylist } = useLibrary();
  const generate = useSmartPlaylist();
  const { setSheet, showToast } = useUi();

  return useCallback(
    async (form: PlaylistForm) => {
      if (form.mode === "manual") {
        createPlaylist(form.title, { description: form.description, visibility: form.visibility });
        showToast("הפלייליסט נוצר");
      } else {
        const generated = await generate(form.prompt);
        createPlaylist(form.title || generated.title, {
          description: tr("נוצר מהתיאור: {prompt}", { prompt: form.prompt }),
          visibility: form.visibility,
          tracks: generated.tracks,
        });
        showToast(tr("נוצר פלייליסט עם {n} שירים", { n: generated.tracks.length }));
      }
      setSheet(null);
    },
    [createPlaylist, generate, setSheet, showToast],
  );
}
