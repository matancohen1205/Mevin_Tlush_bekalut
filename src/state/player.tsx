import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { Track } from "../types";

export type RepeatMode = "off" | "all" | "one";

interface PlayerState {
  queue: Track[];
  index: number;
  current: Track | null;
  playing: boolean;
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

const Ctx = createContext<PlayerState | null>(null);
export const usePlayer = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer outside PlayerProvider");
  return c;
};

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null as unknown as HTMLAudioElement);
  if (!audioRef.current && typeof Audio !== "undefined") audioRef.current = new Audio();

  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [volume, setVolumeState] = useState(0.8);
  const [expanded, setExpanded] = useState(false);

  const current = queue[index] ?? null;
  const duration = current ? current.durationMs / 1000 : 0;
  const simulated = !!current && !current.previewUrl;

  // refs so audio callbacks always see fresh values
  const live = useRef({ queue, index, shuffle, repeat });
  live.current = { queue, index, shuffle, repeat };

  const goTo = useCallback((i: number) => {
    setIndex(i);
    setPosition(0);
    setPlaying(true);
  }, []);

  const next = useCallback(() => {
    const { queue, index, shuffle, repeat } = live.current;
    if (!queue.length) return;
    if (shuffle && queue.length > 1) {
      let r = index;
      while (r === index) r = Math.floor(Math.random() * queue.length);
      return goTo(r);
    }
    if (index + 1 < queue.length) return goTo(index + 1);
    if (repeat === "all") return goTo(0);
    setPlaying(false);
    setPosition(0);
  }, [goTo]);

  const prev = useCallback(() => {
    const { queue, index } = live.current;
    if (!queue.length) return;
    if (audioRef.current.currentTime > 3 || index === 0) {
      audioRef.current.currentTime = 0;
      setPosition(0);
      return;
    }
    goTo(index - 1);
  }, [goTo]);

  const onEnded = useCallback(() => {
    if (live.current.repeat === "one") {
      audioRef.current.currentTime = 0;
      setPosition(0);
      setPlaying(true);
      void audioRef.current.play().catch(() => undefined);
    } else next();
  }, [next]);

  // load the source when the track changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (current?.previewUrl) {
      a.src = current.previewUrl;
    } else {
      a.removeAttribute("src");
      a.load();
    }
  }, [current]);

  // play / pause
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    if (current.previewUrl) {
      if (playing) a.play().catch(() => setPlaying(false));
      else a.pause();
    }
  }, [playing, current]);

  // real audio events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const tu = () => !simulated && setPosition(a.currentTime);
    const en = () => !simulated && onEnded();
    a.addEventListener("timeupdate", tu);
    a.addEventListener("ended", en);
    return () => {
      a.removeEventListener("timeupdate", tu);
      a.removeEventListener("ended", en);
    };
  }, [simulated, onEnded]);

  // simulated playback for demo tracks (no audio file)
  useEffect(() => {
    if (!simulated || !playing) return;
    const id = setInterval(() => {
      setPosition((p) => {
        if (p + 0.25 >= duration) {
          queueMicrotask(onEnded);
          return 0;
        }
        return p + 0.25;
      });
    }, 250);
    return () => clearInterval(id);
  }, [simulated, playing, duration, onEnded]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // lock-screen / hardware media keys
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({
      title: current.title,
      artist: current.artist,
      album: current.album ?? "",
      artwork: current.artwork.startsWith("http") ? [{ src: current.artwork, sizes: "400x400" }] : [],
    });
    navigator.mediaSession.setActionHandler("play", () => setPlaying(true));
    navigator.mediaSession.setActionHandler("pause", () => setPlaying(false));
    navigator.mediaSession.setActionHandler("nexttrack", next);
    navigator.mediaSession.setActionHandler("previoustrack", prev);
  }, [current, next, prev]);

  const play = useCallback(
    (track: Track, newQueue?: Track[]) => {
      const q = newQueue ?? live.current.queue;
      const i = q.findIndex((t) => t.id === track.id);
      if (i === -1) {
        setQueue([track]);
        goTo(0);
      } else {
        setQueue(q);
        goTo(i);
      }
    },
    [goTo],
  );

  const value = useMemo<PlayerState>(
    () => ({
      queue, index, current, playing, position, duration, shuffle, repeat, volume, expanded,
      play,
      toggle: () => current && setPlaying((p) => !p),
      next,
      prev,
      seek: (s) => {
        if (!simulated) audioRef.current.currentTime = s;
        setPosition(s);
      },
      setVolume: setVolumeState,
      toggleShuffle: () => setShuffle((s) => !s),
      cycleRepeat: () => setRepeat((r) => (r === "off" ? "all" : r === "all" ? "one" : "off")),
      moveInQueue: (from, to) => {
        if (from === to) return;
        const q = [...live.current.queue];
        const [m] = q.splice(from, 1);
        q.splice(to, 0, m);
        const curId = live.current.queue[live.current.index]?.id;
        setQueue(q);
        setIndex(q.findIndex((t) => t.id === curId));
      },
      jumpTo: goTo,
      setExpanded,
    }),
    [queue, index, current, playing, position, duration, shuffle, repeat, volume, expanded, play, next, prev, simulated, goTo],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
