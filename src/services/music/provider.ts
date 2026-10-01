import type { Country, Track } from "../../types";

/** Every music source (iTunes, Jamendo, Deezer, Spotify…) implements this. */
export interface MusicProvider {
  id: string;
  charts(country: string, limit?: number): Promise<Track[]>;
  search(query: string, country?: string, limit?: number): Promise<Track[]>;
}

export const COUNTRIES: Country[] = [
  { code: "il", name: "ישראל", flag: "🇮🇱" },
  { code: "us", name: "ארה״ב", flag: "🇺🇸" },
  { code: "gb", name: "בריטניה", flag: "🇬🇧" },
  { code: "br", name: "ברזיל", flag: "🇧🇷" },
  { code: "fr", name: "צרפת", flag: "🇫🇷" },
  { code: "es", name: "ספרד", flag: "🇪🇸" },
  { code: "jp", name: "יפן", flag: "🇯🇵" },
  { code: "kr", name: "קוריאה", flag: "🇰🇷" },
  { code: "in", name: "הודו", flag: "🇮🇳" },
  { code: "mx", name: "מקסיקו", flag: "🇲🇽" },
  { code: "de", name: "גרמניה", flag: "🇩🇪" },
  { code: "tr", name: "טורקיה", flag: "🇹🇷" },
];

export const MOODS = [
  { id: "chill", label: "רגוע", term: "chill acoustic" },
  { id: "energy", label: "אנרגטי", term: "dance workout" },
  { id: "focus", label: "ריכוז", term: "lofi instrumental" },
  { id: "sleep", label: "שינה", term: "ambient sleep" },
  { id: "road", label: "נסיעה", term: "road trip rock" },
];

export const GENRES = [
  { id: "pop", label: "פופ", term: "pop hits", hue: 205 },
  { id: "rock", label: "רוק", term: "rock classics", hue: 215 },
  { id: "hiphop", label: "היפ הופ", term: "hip hop", hue: 222 },
  { id: "electronic", label: "אלקטרוני", term: "electronic dance", hue: 195 },
  { id: "jazz", label: "ג׳אז", term: "jazz", hue: 210 },
  { id: "classical", label: "קלאסי", term: "classical piano", hue: 200 },
  { id: "latin", label: "לטיני", term: "latin reggaeton", hue: 190 },
  { id: "kpop", label: "קיי-פופ", term: "k-pop", hue: 218 },
  { id: "mizrahi", label: "ים תיכוני", term: "mediterranean mizrahi", hue: 198 },
  { id: "indie", label: "אינדי", term: "indie folk", hue: 208 },
  { id: "rnb", label: "אר אנד בי", term: "r&b soul", hue: 225 },
  { id: "world", label: "מוזיקת עולם", term: "world music", hue: 192 },
];
