/** All React state of the player in one place, plus `live`: a ref that always holds the latest values for callbacks. */
import { useRef, useState } from "react";
import type { RepeatMode } from "../../domain/queue";
import type { Track } from "../../types";

/** Creates the player's state variables and derived values (current track, real duration). */
export function usePlayerState() {
  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [volume, setVolume] = useState(0.8);
  const [expanded, setExpanded] = useState(false);

  const current = queue[index] ?? null;
  // real length once the file reports it, the catalogue's figure until then
  const duration = mediaDuration || (current ? current.durationMs / 1000 : 0);

  // audio callbacks outlive renders, so they read the freshest values from here
  const live = useRef({ queue, index, shuffle, repeat });
  live.current = { queue, index, shuffle, repeat };

  return {
    queue, setQueue, index, setIndex, playing, setPlaying, buffering, setBuffering, position, setPosition,
    mediaDuration, setMediaDuration, shuffle, setShuffle, repeat, setRepeat, volume, setVolume, expanded, setExpanded,
    current, duration, live,
  };
}

export type PlayerBag = ReturnType<typeof usePlayerState>;
