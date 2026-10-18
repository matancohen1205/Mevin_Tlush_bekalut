/** Publishes "now playing" info and transport controls to the OS (lock screen, headset buttons). */
import { useEffect } from "react";
import { bindActions, publishNowPlaying, publishPosition } from "../../services/browser/mediaSession";
import type { PlayerBag } from "./playerState";
import type { usePlaybackActions } from "./usePlaybackActions";

/** Keeps the Media Session in sync with the current track and progress. */
export function useMediaSession(s: PlayerBag, audio: HTMLAudioElement, actions: ReturnType<typeof usePlaybackActions>): void {
  const { current, duration, position, playing, setPlaying, setPosition } = s;

  useEffect(() => {
    if (!current) return;
    publishNowPlaying(current);
    bindActions({
      play: () => setPlaying(true),
      pause: () => setPlaying(false),
      next: actions.next,
      previous: actions.prev,
      seekTo: (seconds) => { audio.currentTime = seconds; setPosition(seconds); },
    });
  }, [current, actions, audio, setPlaying, setPosition]);

  useEffect(() => {
    if (current && duration) publishPosition(duration, position, playing);
  }, [current, duration, position, playing]);
}
