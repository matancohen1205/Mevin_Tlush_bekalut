/** Arranges the notes of one demo track: pad chords, bass and a random pentatonic arpeggio. */
import { seededRandom } from "./random";
import { addNote } from "./voice";

const PENTATONIC = [0, 3, 5, 7, 10];
const CHORDS = [[0, 7, 12], [-2, 5, 10], [-4, 3, 8], [-5, 2, 7]];

/** Scales the buffer to a safe peak and fades the first/last 1.2 s so playback starts and ends softly. */
function normalizeAndFade(buffer: Float32Array, rate: number): void {
  let peak = 0;
  for (const v of buffer) peak = Math.max(peak, Math.abs(v));
  const gain = peak ? 0.6 / peak : 1;
  const fade = rate * 1.2;
  for (let i = 0; i < buffer.length; i++) buffer[i] *= gain * Math.min(1, i / fade, (buffer.length - i) / fade);
}

/** Adds the arpeggio notes of one bar (eight eighth-notes, some randomly skipped). */
function addArpeggio(buffer: Float32Array, rate: number, bar: number, barStart: number, beat: number, root: number, random: () => number): void {
  for (let k = 0; k < 8; k++) {
    if (random() < 0.2) continue;
    const step = PENTATONIC[Math.floor(random() * PENTATONIC.length)];
    const octave = random() < 0.3 ? 12 : 0;
    addNote(buffer, rate, { start: barStart + k * (beat / 2), duration: beat * 1.6, midi: root + 12 + bar + step + octave, amplitude: 0.09, attack: 0.01, decay: 3.2 });
  }
}

/** Renders `seconds` of mono audio for the given track number; the same seed always gives the same piece. */
export function composeTrack(seed: number, seconds: number, rate: number): Float32Array {
  const random = seededRandom(seed * 9973 + 17);
  const buffer = new Float32Array(rate * seconds);
  const root = 48 + ((seed * 5) % 12);
  const beat = 60 / (72 + ((seed * 7) % 24));
  const barLength = beat * 4;

  for (let bar = 0; bar * barLength < seconds; bar++) {
    const chord = CHORDS[bar % CHORDS.length];
    const start = bar * barLength;
    chord.forEach((c) => addNote(buffer, rate, { start, duration: barLength * 1.05, midi: root + c, amplitude: 0.07, attack: 0.6, decay: 0.5, triangle: true }));
    addNote(buffer, rate, { start, duration: barLength, midi: root + chord[0] - 12, amplitude: 0.12, attack: 0.05, decay: 1.1 });
    addArpeggio(buffer, rate, chord[0], start, beat, root, random);
  }
  normalizeAndFade(buffer, rate);
  return buffer;
}
