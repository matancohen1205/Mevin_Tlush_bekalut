import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DEMO_TRACKS } from "../services/music/demo";
import { SEED_USERS, seedNotifs, seedPosts } from "../services/seed";
import type { Comment, Notif, Post, Profile, Track } from "../types";
import { tr } from "../i18n";

/**
 * Social layer. Runs on localStorage with a simulated community so the whole
 * flow can be tried without a backend. Every function maps 1:1 to a Supabase
 * table operation (profiles, follows, posts, post_likes, comments, notifications, blocks).
 */
export type FollowStatus = "accepted" | "pending";
type NewPost = Pick<Post, "kind" | "caption" | "track" | "playlist">;

interface Saved {
  me: Profile;
  following: Record<string, FollowStatus>;
  followersOfMe: string[];
  blocked: string[];
  posts: Post[];
  notifs: Notif[];
}

interface SocialState extends Saved {
  profileOf: (id: string) => Profile | undefined;
  followersCount: (id: string) => number;
  followingCount: (id: string) => number;
  canSee: (id: string) => boolean;
  playlistsOf: (id: string) => { title: string; description: string; tracks: Track[] }[];
  updateMe: (p: Partial<Pick<Profile, "name" | "handle" | "bio" | "isPrivate">>) => void;
  toggleFollow: (id: string) => void;
  block: (id: string) => void;
  unblock: (id: string) => void;
  createPost: (p: NewPost) => void;
  deletePost: (id: string) => void;
  toggleLike: (postId: string) => void;
  addComment: (postId: string, body: string) => void;
  markRead: () => void;
  unread: number;
  reset: () => void;
}

const KEY = "wavely.social.v1";
const Ctx = createContext<SocialState | null>(null);
export const useSocial = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSocial outside SocialProvider");
  return c;
};

const ME: Profile = { id: "me", handle: "me", name: tr("אני"), bio: "", hue: 205, isPrivate: false, favArtists: [] };
const REPLIES = ["איזה שיר! 🔥", "שמרתי לספרייה", "מושלם לנסיעה", "תודה על השיתוף 💙", "מכיר? זה אחד האהובים עליי"];

function fresh(): Saved {
  const now = Date.now();
  return { me: ME, following: { noa: "accepted", yuki: "accepted", omer: "accepted" }, followersOfMe: ["noa", "yuki"], blocked: [], posts: seedPosts(now), notifs: seedNotifs(now) };
}

function load(): Saved {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fresh();
    const s: Saved = JSON.parse(raw);
    // requests pending when the page closed are treated as accepted (demo)
    for (const k of Object.keys(s.following)) if (s.following[k] === "pending") s.following[k] = "accepted";
    return s;
  } catch {
    return fresh();
  }
}

const uid = () => Math.random().toString(36).slice(2, 9);

export function SocialProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<Saved>(load);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch { /* memory only */ }
  }, [s]);

  const later = useCallback((ms: number, fn: () => void) => { timers.current.push(window.setTimeout(fn, ms)); }, []);
  const notify = useCallback((n: Omit<Notif, "id" | "createdAt" | "read">) =>
    setS((d) => ({ ...d, notifs: [{ ...n, id: uid(), createdAt: Date.now(), read: false }, ...d.notifs] })), []);

  const value = useMemo<SocialState>(() => {
    const profileOf = (id: string) => (id === "me" ? s.me : SEED_USERS.find((u) => u.id === id));
    const patchPost = (id: string, fn: (p: Post) => Post) => setS((d) => ({ ...d, posts: d.posts.map((p) => (p.id === id ? fn(p) : p)) }));

    return {
      ...s,
      profileOf,
      followersCount: (id) => (id === "me" ? s.followersOfMe.length : (SEED_USERS.find((u) => u.id === id)?.baseFollowers ?? 0) + (s.following[id] === "accepted" ? 1 : 0)),
      followingCount: (id) => (id === "me" ? Object.keys(s.following).length : 20 + id.length),
      canSee: (id) => id === "me" || !profileOf(id)?.isPrivate || s.following[id] === "accepted",
      playlistsOf: (id) => (SEED_USERS.find((u) => u.id === id)?.playlists ?? []).map((p) => ({ ...p, tracks: p.idx.map((i) => DEMO_TRACKS[i]) })),
      updateMe: (p) => setS((d) => ({ ...d, me: { ...d.me, ...p } })),
      toggleFollow: (id) => {
        const cur = s.following[id];
        if (cur) return setS((d) => { const f = { ...d.following }; delete f[id]; return { ...d, following: f }; });
        const priv = profileOf(id)?.isPrivate;
        setS((d) => ({ ...d, following: { ...d.following, [id]: priv ? "pending" : "accepted" } }));
        if (priv) later(3000, () => { setS((d) => (d.following[id] ? { ...d, following: { ...d.following, [id]: "accepted" } } : d)); notify({ type: "accepted", actorId: id }); });
      },
      block: (id) => setS((d) => { const f = { ...d.following }; delete f[id]; return { ...d, following: f, blocked: [...new Set([...d.blocked, id])] }; }),
      unblock: (id) => setS((d) => ({ ...d, blocked: d.blocked.filter((b) => b !== id) })),
      createPost: (p) => {
        const id = uid();
        setS((d) => ({ ...d, posts: [{ ...p, id, authorId: "me", createdAt: Date.now(), likes: [], comments: [] }, ...d.posts] }));
        // simulated community reactions so likes / comments / notifications can be tried
        const others = SEED_USERS.filter((u) => !u.isPrivate && !s.blocked.includes(u.id));
        if (!others.length) return;
        const a = others[Math.floor(Math.random() * others.length)];
        const b = others[Math.floor(Math.random() * others.length)];
        later(2500, () => { patchPost(id, (x) => ({ ...x, likes: [...x.likes, a.id] })); notify({ type: "like", actorId: a.id, postId: id }); });
        later(6000, () => {
          const c: Comment = { id: uid(), authorId: b.id, body: tr(REPLIES[Math.floor(Math.random() * REPLIES.length)]), createdAt: Date.now() };
          patchPost(id, (x) => ({ ...x, comments: [...x.comments, c] }));
          notify({ type: "comment", actorId: b.id, postId: id });
        });
      },
      deletePost: (id) => setS((d) => ({ ...d, posts: d.posts.filter((p) => p.id !== id) })),
      toggleLike: (postId) => patchPost(postId, (p) => ({ ...p, likes: p.likes.includes("me") ? p.likes.filter((l) => l !== "me") : [...p.likes, "me"] })),
      addComment: (postId, body) => patchPost(postId, (p) => ({ ...p, comments: [...p.comments, { id: uid(), authorId: "me", body, createdAt: Date.now() }] })),
      markRead: () => setS((d) => ({ ...d, notifs: d.notifs.map((n) => ({ ...n, read: true })) })),
      unread: s.notifs.filter((n) => !n.read).length,
      reset: () => setS(fresh()),
    };
  }, [s, later, notify]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
