/** Seeded randomness and pitch maths for the generative demo audio. */

/** Mulberry32: a tiny seeded PRNG returning floats in [0, 1). Same seed → same sequence. */
export function seededRandom(seed: number): () => number {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Frequency in Hz of a MIDI note number (A4 = 69 = 440 Hz). */
export const midiToHz = (midi: number): number => 440 * 2 ** ((midi - 69) / 12);
