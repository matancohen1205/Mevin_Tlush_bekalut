/** Supabase calls for the user's library (liked songs and playlists). No React in here. */
import type { Playlist, Track } from "../../types";
import { supabase } from "./supabase";

export interface CloudLibrary { liked: Track[]; playlists: Playlist[] }

/** The Supabase client, or an error when keys were not configured. */
const db = () => {
  if (!supabase) throw new Error("Supabase is not configured");
  return supabase;
};
/** Unwraps a Supabase response: throws on error, returns the data otherwise. */
const ok = <T>(r: { data: T | null; error: { message: string } | null }): T => {
  if (r.error) throw new Error(r.error.message);
  return r.data as T;
};

/** Loads the user's liked songs and playlists (with their tracks, in order). */
export async function fetchLibrary(uid: string): Promise<CloudLibrary> {
  const [likes, pls] = await Promise.all([
    db().from("liked_tracks").select("track").eq("user_id", uid).order("created_at", { ascending: false }),
    db().from("playlists").select("id,title,description,visibility,created_at,playlist_tracks(track,position)").eq("owner_id", uid).order("created_at", { ascending: false }),
  ]);
  return {
    liked: ok(likes).map((r) => r.track as Track),
    playlists: ok(pls).map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      visibility: p.visibility as Playlist["visibility"],
      createdAt: Date.parse(p.created_at),
      // collaborators arrive with the cloud community (they need real user accounts); solo playlists for now
      collaborators: [],
      addedBy: {},
      tracks: [...(p.playlist_tracks as { track: Track; position: number }[])].sort((a, b) => a.position - b.position).map((r) => r.track),
    })),
  };
}

/** Likes or unlikes a track. */
export async function setLike(uid: string, track: Track, liked: boolean) {
  if (liked) ok(await db().from("liked_tracks").upsert({ user_id: uid, track_id: track.id, track }));
  else ok(await db().from("liked_tracks").delete().eq("user_id", uid).eq("track_id", track.id));
}

/** Upserts the playlist row and replaces its tracks (order = position). */
export async function savePlaylist(uid: string, p: Playlist) {
  ok(await db().from("playlists").upsert({ id: p.id, owner_id: uid, title: p.title, description: p.description, visibility: p.visibility }));
  ok(await db().from("playlist_tracks").delete().eq("playlist_id", p.id));
  if (p.tracks.length)
    ok(await db().from("playlist_tracks").insert(p.tracks.map((t, i) => ({ playlist_id: p.id, track_id: t.id, track: t, position: i }))));
}

/** Deletes a playlist (its tracks are removed by the database cascade). */
export async function removePlaylist(id: string) {
  ok(await db().from("playlists").delete().eq("id", id));
}
