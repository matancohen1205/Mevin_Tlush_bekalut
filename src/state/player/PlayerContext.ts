/** Public player API (what components see) and the React context that carries it. */
import { createContext, useContext } from "react";
import type { RepeatMode } from "../../domain/queue";
import type { Track } from "../../types";

export type { RepeatMode };

export interface PlayerApi {
  queue: Track[];
  index: number;
  current: Track | null;
  playing: boolean;
  /** true while the browser is loading or waiting for more audio */
  buffering: boolean;
  position: number; // seconds
  duration: number; // seconds
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number; // 0..1
  expanded: boolean;
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (sec: number) => void;
  setVolume: (v: number) => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  moveInQueue: (from: number, to: number) => void;
  jumpTo: (i: number) => void;
  setExpanded: (v: boolean) => void;
}

export const PlayerContext = createContext<PlayerApi | null>(null);

/** Access the player from any component under PlayerProvider. */
export function usePlayer(): PlayerApi {
  const api = useContext(PlayerContext);
  if (!api) throw new Error("usePlayer outside PlayerProvider");
  return api;
}
