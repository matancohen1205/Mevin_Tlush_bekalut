/** Inviting friends to a playlist: who can still be invited, and the invite/remove actions. */
import { useMemo } from "react";
import { invitablePeople } from "../../domain/collaboration";
import type { Playlist, Profile } from "../../types";
import { useLibrary } from "../library";
import { useSocial } from "../social";

/** People of the user's following list who can still be invited, plus `invite` and `remove`. */
export function useInvite(playlist: Playlist) {
  const { inviteCollaborator, removeCollaborator } = useLibrary();
  const { following, blocked, profileOf } = useSocial();

  const friends = useMemo(
    () => Object.keys(following).filter((id) => following[id] === "accepted" && !blocked.includes(id)).map(profileOf).filter((p): p is Profile => !!p),
    [following, blocked, profileOf],
  );

  return {
    invitable: invitablePeople(friends, playlist),
    invite: (userId: string) => inviteCollaborator(playlist.id, userId),
    remove: (userId: string) => removeCollaborator(playlist.id, userId),
  };
}
