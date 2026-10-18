/** A single synthesized note, mixed additively into an audio buffer. */
import { midiToHz } from "./random";

export interface NoteOptions {
  start: number;     // seconds
  duration: number;  // seconds
  midi: number;
  amplitude: number;
  attack: number;    // seconds to reach full volume
  decay: number;     // exponential fall-off rate
  triangle?: boolean; // soft pad timbre instead of sine + overtone
}

/** Adds one note (sine with a faint octave overtone, or a triangle wave) with an attack/decay envelope. */
export function addNote(buffer: Float32Array, rate: number, note: NoteOptions): void {
  const freq = midiToHz(note.midi);
  const first = Math.floor(note.start * rate);
  const last = Math.min(buffer.length, Math.floor((note.start + note.duration) * rate));
  for (let i = first; i < last; i++) {
    const t = (i - first) / rate;
    const envelope = Math.min(1, t / note.attack) * Math.exp(-t * note.decay);
    const phase = 2 * Math.PI * freq * t;
    const wave = note.triangle ? (2 / Math.PI) * Math.asin(Math.sin(phase)) : Math.sin(phase) + 0.25 * Math.sin(2 * phase);
    buffer[i] += note.amplitude * envelope * wave;
  }
}
