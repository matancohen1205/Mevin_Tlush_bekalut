import { DEMO_TRACKS } from "./music/demo";
import type { Notif, Post, Profile, Track } from "../types";

/**
 * Fictional community used until the Supabase backend is connected.
 * Same shapes as the real tables (see docs/ARCHITECTURE.md).
 */
export const SEED_USERS: (Profile & { baseFollowers: number; playlists: { title: string; description: string; idx: number[] }[] })[] = [
  { id: "noa", handle: "noa.sea", name: "נועה ים", bio: "מוזיקה לים ולנסיעות ארוכות 🌊", hue: 200, isPrivate: false, favArtists: ["Noa & The Sea", "Luna Waves"], baseFollowers: 412,
    playlists: [{ title: "ים תיכון בערב", description: "לשקיעות ולבירה קרה", idx: [2, 8, 0, 13] }, { title: "נסיעה דרומה", description: "", idx: [14, 12, 1] }] },
  { id: "omer", handle: "omer.k", name: "עומר כהן", bio: "רוק, אינדי וקצת ג׳אז. אוסף תקליטים.", hue: 218, isPrivate: false, favArtists: ["The Tidal", "Aqua Theory"], baseFollowers: 188,
    playlists: [{ title: "ריכוז לעבודה", description: "בלי מילים", idx: [10, 15, 12, 11] }] },
  { id: "yuki", handle: "yuki_t", name: "Yuki Tanaka", bio: "City pop & lo-fi from Tokyo.", hue: 190, isPrivate: false, favArtists: ["Hikari", "BLUE ARC"], baseFollowers: 1204,
    playlists: [{ title: "Tokyo Rainy Night", description: "Neon lights, wet streets.", idx: [5, 6, 12, 10] }] },
  { id: "maria", handle: "maria.costa", name: "Maria Costa", bio: "Bossa nova, samba e muito sol ☀️", hue: 226, isPrivate: false, favArtists: ["Marisa Costa", "Sol y Mar"], baseFollowers: 659,
    playlists: [{ title: "Domingo no Rio", description: "", idx: [3, 9, 0] }] },
  { id: "tamar", handle: "tamar.l", name: "תמר לוי", bio: "פרופיל פרטי.", hue: 208, isPrivate: true, favArtists: ["Nordlys"], baseFollowers: 57, playlists: [] },
];

const pick = (idx: number[]): Track[] => idx.map((i) => DEMO_TRACKS[i]);
const H = 3_600_000;

export function seedPosts(now: number): Post[] {
  return [
    { id: "p1", authorId: "noa", kind: "track", caption: "השיר הזה לא יוצא לי מהראש מאז הבוקר 🎧", track: DEMO_TRACKS[2], createdAt: now - 0.7 * H, likes: ["omer", "maria"], comments: [{ id: "c1", authorId: "omer", body: "וואו, תודה על ההמלצה!", createdAt: now - 0.5 * H }] },
    { id: "p2", authorId: "yuki", kind: "playlist", caption: "הפלייליסט החדש שלי לגשם בטוקיו", playlist: { title: "Tokyo Rainy Night", description: "Neon lights, wet streets.", tracks: pick([5, 6, 12, 10]) }, createdAt: now - 2 * H, likes: ["noa"], comments: [] },
    { id: "p3", authorId: "maria", kind: "now_playing", caption: "מתנגן עכשיו", track: DEMO_TRACKS[3], createdAt: now - 4 * H, likes: [], comments: [] },
    { id: "p4", authorId: "omer", kind: "playlist", caption: "מי עוד עובד עם מוזיקה ברקע?", playlist: { title: "ריכוז לעבודה", description: "בלי מילים", tracks: pick([10, 15, 12, 11]) }, createdAt: now - 7 * H, likes: ["yuki", "noa", "maria"], comments: [{ id: "c2", authorId: "yuki", body: "שמרתי! 🙌", createdAt: now - 6 * H }] },
    { id: "p5", authorId: "tamar", kind: "track", caption: "רק לעוקבים שלי 🤫", track: DEMO_TRACKS[10], createdAt: now - 9 * H, likes: [], comments: [] },
    { id: "p6", authorId: "yuki", kind: "track", caption: "Sunrise vibes from Rio", track: DEMO_TRACKS[3], createdAt: now - 26 * H, likes: ["maria"], comments: [] },
  ];
}

export function seedNotifs(now: number): Notif[] {
  return [
    { id: "n1", type: "follow", actorId: "noa", createdAt: now - 1 * H, read: false },
    { id: "n2", type: "like", actorId: "omer", postId: "p1", createdAt: now - 3 * H, read: false },
    { id: "n3", type: "follow", actorId: "yuki", createdAt: now - 20 * H, read: true },
  ];
}
