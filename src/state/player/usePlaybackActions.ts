/** Player commands (play, next, seek, reorder…). Decisions come from domain/queue; effects go to the audio element. */
import { useCallback, useMemo } from "react";
import { cycleRepeat, indexOfTrack, moveItem, nextIndex, previousAction } from "../../domain/queue";
import type { Track } from "../../types";
import type { PlayerBag } from "./playerState";

/** Builds the stable set of commands the UI can call. */
export function usePlaybackActions(s: PlayerBag, audio: HTMLAudioElement) {
  const { live, setIndex, setPosition, setPlaying, setQueue, setShuffle, setRepeat } = s;

  /** Starts the current track over from 0:00. */
  const restart = useCallback(() => {
    audio.currentTime = 0;
    setPosition(0);
    setPlaying(true);
    void audio.play().catch(() => setPlaying(false));
  }, [audio, setPosition, setPlaying]);

  /** Jumps to queue position `i` (same track again restarts it, because the source effect won't re-run). */
  const goTo = useCallback(
    (i: number) => {
      if (i === live.current.index) return restart();
      setIndex(i);
      setPosition(0);
      setPlaying(true);
    },
    [live, restart, setIndex, setPosition, setPlaying],
  );

  /** Plays the next track according to shuffle/repeat, or stops at the end of the queue. */
  const next = useCallback(() => {
    const { queue, index, shuffle, repeat } = live.current;
    if (!queue.length) return;
    const target = nextIndex({ length: queue.length, index, shuffle, repeat });
    if (target !== null) return goTo(target);
    setPlaying(false);
    setPosition(0);
    audio.currentTime = 0;
  }, [audio, live, goTo, setPlaying, setPosition]);

  /** Restarts the track if it has been playing a while, otherwise goes back one. */
  const prev = useCallback(() => {
    const { queue, index } = live.current;
    if (!queue.length) return;
    const action = previousAction(index, audio.currentTime);
    if (action.type === "goto") return goTo(action.index);
    audio.currentTime = 0;
    setPosition(0);
  }, [audio, live, goTo, setPosition]);

  /** Plays `track`, optionally replacing the queue. Selecting the loaded track just resumes it. */
  const play = useCallback(
    (track: Track, newQueue?: Track[]) => {
      const queue = newQueue ?? live.current.queue;
      const i = queue.findIndex((t) => t.id === track.id);
      const same = live.current.queue[live.current.index]?.id === track.id;
      setQueue(i === -1 ? [track] : queue);
      if (same) return setPlaying(true);
      setIndex(i === -1 ? 0 : i);
      setPosition(0);
      setPlaying(true);
    },
    [live, setQueue, setIndex, setPosition, setPlaying],
  );

  return useMemo(
    () => ({
      restart, goTo, next, prev, play,
      /** Pause/resume. */
      toggle: () => s.current && setPlaying((p) => !p),
      /** Jump inside the track. */
      seek: (seconds: number) => { audio.currentTime = seconds; setPosition(seconds); },
      toggleShuffle: () => setShuffle((v) => !v),
      cycleRepeat: () => setRepeat((m) => cycleRepeat(m)),
      /** Drag-and-drop reorder that keeps the current track selected. */
      moveInQueue: (from: number, to: number) => {
        if (from === to) return;
        const { queue, index } = live.current;
        const reordered = moveItem(queue, from, to);
        setQueue(reordered);
        setIndex(indexOfTrack(reordered, queue[index]?.id));
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [restart, goTo, next, prev, play, s.current, audio],
  );
}
