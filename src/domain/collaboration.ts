/** Pure rules for collaborative playlists: who may edit, invitations, and who added which song. */
import type { Playlist, Profile, Track } from "../types";
import { addTrack } from "./playlists";

/** Id of the signed-in person in the local data model. */
export const OWNER_ID = "me";

/** Fills in the collaboration fields of playlists saved before they existed. */
export function withCollaborationDefaults(p: Omit<Playlist, "collaborators" | "addedBy"> & Partial<Pick<Playlist, "collaborators" | "addedBy">>): Playlist {
  return { ...p, collaborators: p.collaborators ?? [], addedBy: p.addedBy ?? {} };
}

/** True when other people were invited. */
export const isCollaborative = (p: Playlist): boolean => p.collaborators.length > 0;

/** The owner and invited collaborators may add songs. */
export const canEdit = (p: Playlist, userId: string): boolean => userId === OWNER_ID || p.collaborators.includes(userId);

/** Invites someone (no duplicates, the owner cannot invite themselves). */
export function inviteCollaborator(p: Playlist, userId: string): Playlist {
  if (userId === OWNER_ID || p.collaborators.includes(userId)) return p;
  return { ...p, collaborators: [...p.collaborators, userId] };
}

/** Removes a collaborator; songs they added stay in the playlist. */
export const removeCollaborator = (p: Playlist, userId: string): Playlist => ({ ...p, collaborators: p.collaborators.filter((id) => id !== userId) });

/**
 * Adds a track on behalf of `userId`. Refused (playlist unchanged) when that person may not edit.
 * On collaborative playlists it records who added the song.
 */
export function addTrackAs(p: Playlist, track: Track, userId: string = OWNER_ID): Playlist {
  if (!canEdit(p, userId) || p.tracks.some((t) => t.id === track.id)) return p;
  const added = addTrack(p, track);
  return isCollaborative(p) ? { ...added, addedBy: { ...added.addedBy, [track.id]: userId } } : added;
}

/** People who could still be invited: not already collaborators. */
export const invitablePeople = (candidates: readonly Profile[], p: Playlist): Profile[] => candidates.filter((c) => !p.collaborators.includes(c.id));

/** Id of whoever added a track, if recorded. */
export const addedById = (p: Playlist, trackId: string): string | undefined => p.addedBy[trackId];
