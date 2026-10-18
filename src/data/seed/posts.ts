/** Seeded feed posts, timestamped relative to "now" so they always look recent. */
import { DEMO_TRACKS } from "../../services/music/demo";
import type { Post, Track } from "../../types";

/** Demo tracks for the given catalogue indexes. */
const pick = (idx: number[]): Track[] => idx.map((i) => DEMO_TRACKS[i]);
const H = 3_600_000;

/** Posts shown in the demo feed. */
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
