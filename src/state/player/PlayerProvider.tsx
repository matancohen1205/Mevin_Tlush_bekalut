/** Composes the player: state + commands + audio effects, exposed through PlayerContext. */
import { useMemo, useState, type ReactNode } from "react";
import { createAudioElement } from "../../services/browser/audioElement";
import { useUi } from "../ui/useUi";
import { PlayerContext, type PlayerApi } from "./PlayerContext";
import { usePlayerState } from "./playerState";
import { useAudioEvents } from "./useAudioEvents";
import { useAudioSource } from "./useAudioSource";
import { useMediaSession } from "./useMediaSession";
import { usePlaybackActions } from "./usePlaybackActions";

/** Provides the player API to the component tree. */
export function PlayerProvider({ children }: { children: ReactNode }) {
  const { showToast } = useUi();
  const [audio] = useState(createAudioElement);
  const s = usePlayerState();
  const actions = usePlaybackActions(s, audio);

  useAudioSource(s, audio, showToast);
  const policy = useAudioEvents(s, audio, actions, showToast);
  useMediaSession(s, audio, actions);

  const api = useMemo<PlayerApi>(
    () => ({
      queue: s.queue, index: s.index, current: s.current, playing: s.playing, buffering: s.buffering,
      position: s.position, duration: s.duration, shuffle: s.shuffle, repeat: s.repeat, volume: s.volume, expanded: s.expanded,
      play: (track, queue) => { policy.reset(); actions.play(track, queue); },
      toggle: actions.toggle, next: actions.next, prev: actions.prev, seek: actions.seek,
      setVolume: s.setVolume, toggleShuffle: actions.toggleShuffle, cycleRepeat: actions.cycleRepeat,
      moveInQueue: actions.moveInQueue, jumpTo: actions.goTo, setExpanded: s.setExpanded,
    }),
    [s.queue, s.index, s.current, s.playing, s.buffering, s.position, s.duration, s.shuffle, s.repeat, s.volume, s.expanded, s.setVolume, s.setExpanded, actions, policy],
  );

  return <PlayerContext.Provider value={api}>{children}</PlayerContext.Provider>;
}
