/** Media Session API: lock-screen / headset controls and "now playing" metadata. */
import type { Track } from "../../types";

export interface MediaActions {
  play: () => void;
  pause: () => void;
  next: () => void;
  previous: () => void;
  seekTo: (seconds: number) => void;
}

const supported = (): boolean => typeof navigator !== "undefined" && "mediaSession" in navigator;

/** Publishes the current track's title, artist and artwork to the OS. */
export function publishNowPlaying(track: Track): void {
  if (!supported()) return;
  navigator.mediaSession.metadata = new MediaMetadata({
    title: track.title,
    artist: track.artist,
    album: track.album ?? "",
    artwork: track.artwork.startsWith("http") ? [{ src: track.artwork, sizes: "400x400" }] : [],
  });
}

/** Wires the OS transport buttons to the app; actions a browser does not support are skipped. */
export function bindActions(actions: MediaActions): void {
  if (!supported()) return;
  const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
    ["play", actions.play],
    ["pause", actions.pause],
    ["nexttrack", actions.next],
    ["previoustrack", actions.previous],
    ["seekto", (d) => d.seekTime != null && actions.seekTo(d.seekTime)],
  ];
  handlers.forEach(([name, handler]) => {
    try {
      navigator.mediaSession.setActionHandler(name, handler);
    } catch {
      /* action not supported */
    }
  });
}

/** Updates the OS progress bar and play/pause state. */
export function publishPosition(duration: number, position: number, playing: boolean): void {
  if (!supported()) return;
  try {
    navigator.mediaSession.setPositionState({ duration, position: Math.min(position, duration), playbackRate: 1 });
  } catch {
    /* invalid state: ignore */
  }
  navigator.mediaSession.playbackState = playing ? "playing" : "paused";
}
