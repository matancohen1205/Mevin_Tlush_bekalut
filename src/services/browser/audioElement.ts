/** Thin wrapper around the browser's HTMLAudioElement. */

/** Creates the single audio element the whole app plays through. */
export function createAudioElement(): HTMLAudioElement {
  const audio = new Audio();
  audio.preload = "auto";
  return audio;
}

/** True when the element has no real source (it was cleared on purpose, so an "error" event is not a failure). */
export function hasNoSource(audio: HTMLAudioElement): boolean {
  return !audio.src || audio.src === location.href;
}

/** Stops playback and unloads the current source. */
export function clearSource(audio: HTMLAudioElement): void {
  audio.pause();
  audio.removeAttribute("src");
  audio.load();
}

/** Loads a new source (playback is started separately). */
export function loadSource(audio: HTMLAudioElement, url: string): void {
  audio.src = url;
  audio.load();
}
