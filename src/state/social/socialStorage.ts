/** Local persistence and initial content of the demo community. */
import { seedNotifs, seedPosts } from "../../data/seed";
import { tr } from "../../i18n";
import { readJson, writeJson } from "../../services/storage/localStore";
import type { Profile, SocialSnapshot } from "../../types";

const KEY = "wavely.social.v1";

/** The current user's starting profile. */
const newMe = (): Profile => ({ id: "me", handle: "me", name: tr("אני"), bio: "", hue: 205, isPrivate: false, favArtists: [] });

/** Starting community: a few follows, seeded posts and notifications. */
export function freshSocial(now: number = Date.now()): SocialSnapshot {
  return {
    me: newMe(),
    following: { noa: "accepted", yuki: "accepted", omer: "accepted" },
    followersOfMe: ["noa", "yuki"],
    blocked: [],
    posts: seedPosts(now),
    notifs: seedNotifs(now),
  };
}

/** Loads the saved community; follow requests still pending when the page closed count as accepted (demo). */
export function loadSocial(): SocialSnapshot {
  const saved = readJson<SocialSnapshot | null>(KEY, null);
  if (!saved) return freshSocial();
  const following = Object.fromEntries(Object.entries(saved.following).map(([id]) => [id, "accepted" as const]));
  return { ...saved, following };
}

/** Saves the community. */
export function saveSocial(snapshot: SocialSnapshot): void {
  writeJson(KEY, snapshot);
}
