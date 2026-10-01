import type { Track } from "../../types";
import type { MusicProvider } from "./provider";

interface ItunesResult {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
  trackTimeMillis?: number;
  primaryGenreName?: string;
  country?: string;
  trackViewUrl?: string;
}

const hiRes = (url = "") => url.replace("100x100", "400x400");

function toTrack(r: ItunesResult, country?: string): Track {
  return {
    id: `itunes-${r.trackId}`,
    title: r.trackName,
    artist: r.artistName,
    album: r.collectionName,
    artwork: hiRes(r.artworkUrl100),
    previewUrl: r.previewUrl,
    // iTunes previews are always ~30s
    durationMs: r.previewUrl ? 30_000 : r.trackTimeMillis ?? 30_000,
    genre: r.primaryGenreName,
    country: country ?? r.country?.slice(0, 2).toLowerCase(),
    source: "itunes",
    full: false,
    sourceUrl: r.trackViewUrl,
  };
}

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/** Free, key-less. Provides legal 30s previews with attribution to Apple Music. */
export const itunesProvider: MusicProvider = {
  id: "itunes",

  async charts(country, limit = 12) {
    const chart = await getJson<{ feed: { results: { id: string }[] } }>(
      `https://rss.applemarketingtools.com/api/v2/${country}/music/most-played/${limit}/songs.json`,
    );
    const ids = chart.feed.results.map((r) => r.id).join(",");
    const data = await getJson<{ results: ItunesResult[] }>(`https://itunes.apple.com/lookup?id=${ids}&country=${country}`);
    const byId = new Map(data.results.map((r) => [String(r.trackId), r]));
    const tracks = chart.feed.results
      .map((r) => byId.get(r.id))
      .filter((r): r is ItunesResult => !!r && !!r.previewUrl)
      .map((r) => toTrack(r, country));
    if (!tracks.length) throw new Error("empty chart");
    return tracks;
  },

  async search(query, country = "us", limit = 20) {
    const data = await getJson<{ results: ItunesResult[] }>(
      `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=${limit}&country=${country}`,
    );
    return data.results.filter((r) => r.previewUrl).map((r) => toTrack(r, country));
  },
};
