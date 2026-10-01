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
