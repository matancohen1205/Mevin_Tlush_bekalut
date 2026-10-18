/** Pure playback-queue rules: which track plays next/previous, and how the queue is reordered. */
import type { Track } from "../types";

export type RepeatMode = "off" | "all" | "one";

export interface QueueState {
  length: number;
  index: number;
  shuffle: boolean;
  repeat: RepeatMode;
}

/** Seconds into a track after which "previous" restarts it instead of going back. */
export const RESTART_THRESHOLD_S = 3;

/**
 * Index of the track that should follow the current one, or null when playback should stop.
 * `random` is injectable so shuffle is deterministic in tests.
 */
export function nextIndex(q: QueueState, random: () => number = Math.random): number | null {
  if (q.length === 0) return null;
  if (q.shuffle && q.length > 1) {
    let pick = q.index;
    while (pick === q.index) pick = Math.floor(random() * q.length);
    return pick;
  }
  if (q.index + 1 < q.length) return q.index + 1;
  return q.repeat === "all" ? 0 : null;
}

/** What "previous" should do: restart the current track or step back one. */
export function previousAction(index: number, positionSeconds: number): { type: "restart" } | { type: "goto"; index: number } {
  return positionSeconds > RESTART_THRESHOLD_S || index <= 0 ? { type: "restart" } : { type: "goto", index: index - 1 };
}

/** Next repeat mode in the off → all → one cycle. */
export function cycleRepeat(mode: RepeatMode): RepeatMode {
  return mode === "off" ? "all" : mode === "all" ? "one" : "off";
}

/** Returns a copy of `list` with the item at `from` moved to `to`. */
export function moveItem<T>(list: readonly T[], from: number, to: number): T[] {
  const copy = [...list];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

/** Index of the track with `id` in `queue` (or -1); used to keep "current" stable after a reorder. */
export function indexOfTrack(queue: readonly Track[], id: string | undefined): number {
  return id ? queue.findIndex((t) => t.id === id) : -1;
}
