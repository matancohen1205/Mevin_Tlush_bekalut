/** Music catalogue types: tracks and countries. */
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  artwork: string;
  /** Playable audio URL (30s preview or full stream). Demo tracks use `synth:<n>`, resolved by the player. */
  previewUrl?: string;
  /** true when previewUrl is the full-length track, false for short previews */
  full?: boolean;
  durationMs: number;
  genre?: string;
  country?: string;
  /** Where the track comes from – shown in the player for attribution. */
  source: "itunes" | "audius" | "demo";
  sourceUrl?: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
}
