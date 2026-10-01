import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { tr } from "../i18n";
import { synthDataUrl, synthUrl } from "../services/music/synth";
import type { Track } from "../types";
import { useUi } from "./ui";

export type RepeatMode = "off" | "all" | "one";

interface PlayerState {
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

const Ctx = createContext<PlayerState | null>(null);
export const usePlayer = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("usePlayer outside PlayerProvider");
  return c;
};

/** The URL the <audio> element should load. Demo tracks are synthesized on demand. */
function synthSeed(t: Track): number | null {
  const n = t.previewUrl?.startsWith("synth:") ? Number(t.previewUrl.slice(6)) : t.source === "demo" ? Number(t.id.replace("demo-", "")) : NaN;
  return Number.isFinite(n) ? n : null;
}

function sourceOf(t: Track): string | null {
  const u = t.previewUrl;
  if (u?.startsWith("synth:")) return synthUrl(Number(u.slice(6)));
  if (u) return u;
  if (t.source === "demo") {
    const n = Number(t.id.replace("demo-", ""));
    if (Number.isFinite(n)) return synthUrl(n); // tracks liked before demo audio existed
  }
  return null;
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { showToast } = useUi();
  const audioRef = useRef<HTMLAudioElement>(null as unknown as HTMLAudioElement);
  if (!audioRef.current && typeof Audio !== "undefined") {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
  }

  const [queue, setQueue] = useState<Track[]>([]);
  const [index, setIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [position, setPosition] = useState(0);
  const [mediaDuration, setMediaDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>("off");
  const [volume, setVolumeState] = useState(0.8);
  const [expanded, setExpanded] = useState(false);

  const current = queue[index] ?? null;
  // real length once the file reports it, the catalogue's figure until then
  const duration = mediaDuration || (current ? current.durationMs / 1000 : 0);

  // refs so audio callbacks always see fresh values
  const live = useRef({ queue, index, shuffle, repeat });
  live.current = { queue, index, shuffle, repeat };
  const failures = useRef(0);
  const dataRetry = useRef<string | null>(null);

  const restart = useCallback(() => {
    const a = audioRef.current;
    a.currentTime = 0;
    setPosition(0);
    setPlaying(true);
    void a.play().catch(() => setPlaying(false));
  }, []);

  const goTo = useCallback(
    (i: number) => {
      if (i === live.current.index) return restart(); // same track again: the source effect won't re-run
      setIndex(i);
      setPosition(0);
      setPlaying(true);
    },
    [restart],
  );

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
    audioRef.current.currentTime = 0;
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

  // load the source when the track changes
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current) return;
    const src = sourceOf(current);
    setMediaDuration(0);
    setPosition(0);
    if (!src) {
      a.pause();
      a.removeAttribute("src");
      a.load();
      setBuffering(false);
      setPlaying(false);
      showToast(tr("השיר הזה לא זמין לניגון"));
      return;
    }
    setBuffering(true);
    a.src = src;
    a.load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  // play / pause (also runs after the source effect above when the track changes)
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !current || !a.src) return;
    if (playing) {
      a.play().catch((e: DOMException) => {
        // Only autoplay blocking is handled here. Aborted loads and unplayable files are
        // reported by the element's own "error" event, which also skips to the next track.
        if (e.name !== "NotAllowedError") return;
        setPlaying(false);
        showToast(tr("הדפדפן חסם ניגון אוטומטי. לחצו על הפעלה."));
      });
    } else a.pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, current]);

  // real audio events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const on: Record<string, () => void> = {
      timeupdate: () => setPosition(a.currentTime),
      durationchange: () => Number.isFinite(a.duration) && a.duration > 0 && setMediaDuration(a.duration),
      loadedmetadata: () => Number.isFinite(a.duration) && a.duration > 0 && setMediaDuration(a.duration),
      waiting: () => setBuffering(true),
      loadstart: () => setBuffering(true),
      canplay: () => setBuffering(false),
      playing: () => { setBuffering(false); setPlaying(true); failures.current = 0; },
      pause: () => { if (!a.ended && !a.seeking) setPlaying(false); },
      ended: () => {
        if (live.current.repeat === "one") restart();
        else next();
      },
      error: () => {
        if (!a.src || a.src === location.href) return; // source was cleared on purpose
        // Some embedding policies refuse blob: media; retry the generated demo audio once as a data: URL
        const t = live.current.queue[live.current.index];
        const seed = t ? synthSeed(t) : null;
        if (t && seed !== null && a.src.startsWith("blob:") && dataRetry.current !== t.id) {
          dataRetry.current = t.id;
          synthDataUrl(seed).then((u) => { if (live.current.queue[live.current.index]?.id === t.id) { a.src = u; void a.play().catch(() => undefined); } });
          return;
        }
        setBuffering(false);
        failures.current += 1;
        const { queue, index } = live.current;
        // skip unplayable tracks, but never loop forever when everything fails
        if (failures.current < Math.min(queue.length, 5) && index + 1 < queue.length) {
          showToast(tr("לא ניתן לנגן את השיר, עוברים לבא"));
          goTo(index + 1);
        } else {
          setPlaying(false);
          showToast(tr("לא ניתן לנגן את השיר. בדקו את החיבור ונסו שוב."));
        }
      },
    };
    Object.entries(on).forEach(([k, fn]) => a.addEventListener(k, fn));
    return () => Object.entries(on).forEach(([k, fn]) => a.removeEventListener(k, fn));
  }, [next, restart, goTo, showToast]);

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
    const a = audioRef.current;
    const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => setPlaying(true)],
      ["pause", () => setPlaying(false)],
      ["nexttrack", next],
      ["previoustrack", prev],
      ["seekto", (d) => { if (d.seekTime != null) { a.currentTime = d.seekTime; setPosition(d.seekTime); } }],
    ];
    handlers.forEach(([k, h]) => { try { navigator.mediaSession.setActionHandler(k, h); } catch { /* unsupported action */ } });
  }, [current, next, prev]);

  useEffect(() => {
    if (!("mediaSession" in navigator) || !current || !duration) return;
    try {
      navigator.mediaSession.setPositionState({ duration, position: Math.min(position, duration), playbackRate: 1 });
    } catch { /* ignore */ }
    navigator.mediaSession.playbackState = playing ? "playing" : "paused";
  }, [current, duration, position, playing]);

  const play = useCallback(
    (track: Track, newQueue?: Track[]) => {
      failures.current = 0;
      const q = newQueue ?? live.current.queue;
      const i = q.findIndex((t) => t.id === track.id);
      const same = live.current.queue[live.current.index]?.id === track.id;
      setQueue(i === -1 ? [track] : q);
      if (same) setPlaying(true); // already loaded: just (re)start it, keep the position
      else { setIndex(i === -1 ? 0 : i); setPosition(0); setPlaying(true); }
    },
    [],
  );

  const value = useMemo<PlayerState>(
    () => ({
      queue, index, current, playing, buffering, position, duration, shuffle, repeat, volume, expanded,
      play,
      toggle: () => current && setPlaying((p) => !p),
      next,
      prev,
      seek: (s) => {
        audioRef.current.currentTime = s;
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
    [queue, index, current, playing, buffering, position, duration, shuffle, repeat, volume, expanded, play, next, prev, goTo],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
