/**
 * Demo only: when the user invites a seeded friend to a playlist, the friend "joins" and adds a song a few seconds later.
 * Lives at the app root so it keeps running after the invite dialog is closed.
 */
import { useEffect, useRef } from "react";
import { useTimers } from "../../hooks/useTimers";
import { DEMO_TRACKS } from "../../services/music/demo";
import type { Playlist } from "../../types";
import { useLibrary } from "../library";
import { useSocial } from "../social";

const JOIN_AFTER_MS = 2500;
const ADD_SONG_AFTER_MS = 6000;

/** Key identifying one invitation. */
const keyOf = (playlistId: string, userId: string): string => `${playlistId}:${userId}`;

/** All invitations present in the given playlists. */
const invitationKeys = (playlists: readonly Playlist[]): string[] => playlists.flatMap((p) => p.collaborators.map((u) => keyOf(p.id, u)));

/** Watches for new invitations and plays out the friend's response. Invitations that already existed at start-up are ignored. */
export function useDemoCollaborators(): void {
  const library = useLibrary();
  const { notify } = useSocial();
  const later = useTimers();
  const handled = useRef(new Set(invitationKeys(library.playlists)));
  const latest = useRef(library);
  latest.current = library;

  useEffect(() => {
    for (const p of library.playlists) {
      for (const userId of p.collaborators) {
        if (handled.current.has(keyOf(p.id, userId))) continue;
        handled.current.add(keyOf(p.id, userId));
        later(JOIN_AFTER_MS, () => notify({ type: "joined", actorId: userId }));
        later(ADD_SONG_AFTER_MS, () => {
          const current = latest.current.playlists.find((x) => x.id === p.id);
          const song = DEMO_TRACKS.find((t) => !current?.tracks.some((x) => x.id === t.id));
          if (!current || !song || !current.collaborators.includes(userId)) return; // removed or nothing left to add
          latest.current.addToPlaylist(p.id, song, userId);
          notify({ type: "added", actorId: userId });
        });
      }
    }
  }, [library.playlists, later, notify]);
}
