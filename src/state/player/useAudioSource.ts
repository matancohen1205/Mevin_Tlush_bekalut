/** Keeps the <audio> element in sync with player state: loads sources, plays/pauses, applies volume. */
import { useEffect } from "react";
import { tr } from "../../i18n";
import { clearSource, loadSource } from "../../services/browser/audioElement";
import { sourceOf } from "../../services/music/resolveSource";
import type { PlayerBag } from "./playerState";

/** Effects that push state into the audio element. Declared in this order on purpose: load first, then play. */
export function useAudioSource(s: PlayerBag, audio: HTMLAudioElement, notify: (message: string) => void): void {
  const { current, playing, volume, setBuffering, setMediaDuration, setPosition, setPlaying } = s;

  // load the new source whenever the track changes
  useEffect(() => {
    if (!current) return;
    const url = sourceOf(current);
    setMediaDuration(0);
    setPosition(0);
    if (!url) {
      clearSource(audio);
      setBuffering(false);
      setPlaying(false);
      notify(tr("השיר הזה לא זמין לניגון"));
      return;
    }
    setBuffering(true);
    loadSource(audio, url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // start or pause playback (also re-runs right after a track change)
  useEffect(() => {
    if (!current || !audio.src) return;
    if (!playing) return audio.pause();
    audio.play().catch((e: DOMException) => {
      // Only autoplay blocking is handled here; aborted loads and unplayable files are
      // reported by the element's "error" event, which also skips to the next track.
      if (e.name !== "NotAllowedError") return;
      setPlaying(false);
      notify(tr("הדפדפן חסם ניגון אוטומטי. לחצו על הפעלה."));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, current]);

  // volume
  useEffect(() => {
    audio.volume = volume;
  }, [audio, volume]);
}
