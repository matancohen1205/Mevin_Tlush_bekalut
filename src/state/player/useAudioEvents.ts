/** Listens to the <audio> element and mirrors what happens (time, buffering, end, errors) into player state. */
import { useEffect, useRef } from "react";
import { createErrorPolicy } from "./playbackErrors";
import type { PlayerBag } from "./playerState";
import type { usePlaybackActions } from "./usePlaybackActions";

type Actions = ReturnType<typeof usePlaybackActions>;

/** Registers the audio event handlers; returns the error policy so "play" can reset it. */
export function useAudioEvents(s: PlayerBag, audio: HTMLAudioElement, actions: Actions, notify: (m: string) => void) {
  const policy = useRef(createErrorPolicy()).current;
  const { live, setPosition, setMediaDuration, setBuffering, setPlaying } = s;

  useEffect(() => {
    /** Publishes the real duration once the file reports a usable one. */
    const syncDuration = () => Number.isFinite(audio.duration) && audio.duration > 0 && setMediaDuration(audio.duration);

    const handlers: Record<string, () => void> = {
      timeupdate: () => setPosition(audio.currentTime),
      durationchange: syncDuration,
      loadedmetadata: syncDuration,
      waiting: () => setBuffering(true),
      loadstart: () => setBuffering(true),
      canplay: () => setBuffering(false),
      playing: () => { setBuffering(false); setPlaying(true); policy.onSuccess(); },
      // external pause (headphones unplugged, OS control) → keep the UI in sync; ending/seeking also pause the element
      pause: () => { if (!audio.ended && !audio.seeking) setPlaying(false); },
      ended: () => (live.current.repeat === "one" ? actions.restart() : actions.next()),
      error: () => {
        const { queue, index } = live.current;
        policy.onError({
          audio, track: queue[index], index, queueLength: queue.length,
          skipTo: actions.goTo, notify,
          stop: () => { setBuffering(false); setPlaying(false); },
        });
      },
    };
    Object.entries(handlers).forEach(([name, fn]) => audio.addEventListener(name, fn));
    return () => Object.entries(handlers).forEach(([name, fn]) => audio.removeEventListener(name, fn));
  }, [audio, actions, live, notify, policy, setBuffering, setMediaDuration, setPlaying, setPosition]);

  return policy;
}
