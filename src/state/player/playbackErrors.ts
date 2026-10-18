/** Policy for tracks that fail to load: retry demo audio as data:, skip to the next track, never loop forever. */
import { tr } from "../../i18n";
import { hasNoSource } from "../../services/browser/audioElement";
import { fallbackSourceOf } from "../../services/music/resolveSource";
import type { Track } from "../../types";

const MAX_CONSECUTIVE_SKIPS = 5;

export interface ErrorContext {
  audio: HTMLAudioElement;
  track: Track | undefined;
  index: number;
  queueLength: number;
  skipTo: (index: number) => void;
  stop: () => void;
  notify: (message: string) => void;
}

export interface ErrorPolicy {
  /** Reacts to an <audio> "error" event. */
  onError: (ctx: ErrorContext) => void;
  /** Call when a track plays successfully, to reset the failure counter. */
  onSuccess: () => void;
  /** Call when the user starts something new. */
  reset: () => void;
}

/** Creates the stateful policy (consecutive-failure counter and the one-time data: retry). */
export function createErrorPolicy(): ErrorPolicy {
  let failures = 0;
  let retriedTrackId: string | null = null;

  return {
    onSuccess: () => { failures = 0; },
    reset: () => { failures = 0; retriedTrackId = null; },
    onError({ audio, track, index, queueLength, skipTo, stop, notify }) {
      if (hasNoSource(audio)) return; // the source was cleared on purpose

      // some embedding policies refuse blob: media: retry generated demo audio once as a data: URL
      const fallback = track && audio.src.startsWith("blob:") && retriedTrackId !== track.id ? fallbackSourceOf(track) : null;
      if (track && fallback) {
        retriedTrackId = track.id;
        fallback.then((url) => { audio.src = url; void audio.play().catch(() => undefined); });
        return;
      }

      failures += 1;
      const canSkip = failures < Math.min(queueLength, MAX_CONSECUTIVE_SKIPS) && index + 1 < queueLength;
      if (canSkip) {
        notify(tr("לא ניתן לנגן את השיר, עוברים לבא"));
        skipTo(index + 1);
      } else {
        stop();
        notify(tr("לא ניתן לנגן את השיר. בדקו את החיבור ונסו שוב."));
      }
    },
  };
}
