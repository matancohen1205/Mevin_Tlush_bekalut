/** Fictional community members (same shape as the `profiles` table) with the playlists they "own". */
import type { Profile } from "../../types";

/** A seeded member: profile + follower count + playlists given as indexes into the demo catalogue. */
export interface SeedUser extends Profile {
  baseFollowers: number;
  playlists: { title: string; description: string; idx: number[] }[];
}

export const SEED_USERS: SeedUser[] = [
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
