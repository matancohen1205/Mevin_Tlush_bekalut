/**
 * Offline demo audio: a short, gentle generative piece per track, written as a WAV blob.
 * Lets the player produce real sound without any network or licensed audio.
 */
const RATE = 22050;
export const SYNTH_SECONDS = 45;
const cache = new Map<number, string>();
const wavCache = new Map<number, Blob>();

const mulberry = (a: number) => () => {
  a |= 0; a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);
const PENTA = [0, 3, 5, 7, 10]; // minor pentatonic

function render(seed: number): Float32Array {
  const rnd = mulberry(seed * 9973 + 17);
  const n = RATE * SYNTH_SECONDS;
  const out = new Float32Array(n);
  const root = 48 + (seed * 5) % 12;
  const beat = 60 / (72 + (seed * 7) % 24);
  const chords = [[0, 7, 12], [-2, 5, 10], [-4, 3, 8], [-5, 2, 7]];

  const tone = (t0: number, dur: number, midi: number, amp: number, attack: number, decay: number, tri = false) => {
    const f = hz(midi);
    const s0 = Math.floor(t0 * RATE), s1 = Math.min(n, Math.floor((t0 + dur) * RATE));
    for (let i = s0; i < s1; i++) {
      const t = (i - s0) / RATE;
      const env = Math.min(1, t / attack) * Math.exp(-t * decay);
      const ph = 2 * Math.PI * f * t;
      out[i] += amp * env * (tri ? (2 / Math.PI) * Math.asin(Math.sin(ph)) : Math.sin(ph) + 0.25 * Math.sin(2 * ph));
    }
  };

  const bar = beat * 4;
  for (let b = 0; b * bar < SYNTH_SECONDS; b++) {
    const chord = chords[b % chords.length];
    chord.forEach((c) => tone(b * bar, bar * 1.05, root + c, 0.07, 0.6, 0.5, true));      // pad
    tone(b * bar, bar, root + chord[0] - 12, 0.12, 0.05, 1.1);                            // bass
    for (let k = 0; k < 8; k++) {                                                          // arpeggio
      if (rnd() < 0.2) continue;
      const note = root + 12 + chord[0] + PENTA[Math.floor(rnd() * PENTA.length)] + (rnd() < 0.3 ? 12 : 0);
      tone(b * bar + k * (beat / 2), beat * 1.6, note, 0.09, 0.01, 3.2);
    }
  }

  let peak = 0;
  for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(out[i]));
  const g = peak ? 0.6 / peak : 1;
  const fade = RATE * 1.2;
  for (let i = 0; i < n; i++) out[i] *= g * Math.min(1, i / fade, (n - i) / fade);
  return out;
}

function toWav(samples: Float32Array): Blob {
  const buf = new ArrayBuffer(44 + samples.length * 2);
  const v = new DataView(buf);
  const str = (o: number, s: string) => [...s].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, "RIFF"); v.setUint32(4, 36 + samples.length * 2, true); str(8, "WAVE"); str(12, "fmt ");
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, RATE, true); v.setUint32(28, RATE * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true);
  str(36, "data"); v.setUint32(40, samples.length * 2, true);
  samples.forEach((s, i) => v.setInt16(44 + i * 2, Math.max(-1, Math.min(1, s)) * 32767, true));
  return new Blob([buf], { type: "audio/wav" });
}

/** Blob URL of the generated audio for demo track number `seed` (generated once, then cached). */
export function synthUrl(seed: number): string {
  let url = cache.get(seed);
  if (!url) {
    const blob = toWav(render(seed));
    wavCache.set(seed, blob);
    url = URL.createObjectURL(blob);
    cache.set(seed, url);
  }
  return url;
}

/** Same audio as a data: URL, for environments whose security policy refuses blob: media. */
export async function synthDataUrl(seed: number): Promise<string> {
  synthUrl(seed);
  const blob = wavCache.get(seed)!;
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}
