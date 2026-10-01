// Generates the promo soundtrack (gentle generative piece that builds over time) as a WAV file.
// usage: node music.cjs out.wav [seconds]
const fs = require("fs");
const RATE = 44100, SECONDS = Number(process.argv[3] || 56);
const n = RATE * SECONDS, L = new Float32Array(n), R = new Float32Array(n);
const hz = (m) => 440 * 2 ** ((m - 69) / 12);
let seed = 7; const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
const root = 50, beat = 60 / 92, bar = beat * 4;
const chords = [[0, 7, 12, 16], [-3, 4, 9, 12], [-5, 2, 7, 11], [-7, 0, 5, 9]];
const PENTA = [0, 2, 4, 7, 9];

function tone(t0, dur, midi, amp, attack, decay, pan = 0.5, tri = false) {
  const f = hz(midi), s0 = Math.floor(t0 * RATE), s1 = Math.min(n, Math.floor((t0 + dur) * RATE));
  for (let i = s0; i < s1; i++) {
    const t = (i - s0) / RATE, env = Math.min(1, t / attack) * Math.exp(-t * decay), ph = 2 * Math.PI * f * t;
    const v = amp * env * (tri ? (2 / Math.PI) * Math.asin(Math.sin(ph)) : Math.sin(ph) + 0.2 * Math.sin(2 * ph));
    L[i] += v * (1 - pan); R[i] += v * pan;
  }
}
function tick(t0, amp) { // soft hat
  const s0 = Math.floor(t0 * RATE);
  for (let i = 0; i < RATE * 0.05 && s0 + i < n; i++) { const v = (rnd() * 2 - 1) * amp * Math.exp(-i / (RATE * 0.012)); L[s0 + i] += v; R[s0 + i] += v; }
}
function kick(t0, amp) {
  const s0 = Math.floor(t0 * RATE);
  for (let i = 0; i < RATE * 0.25 && s0 + i < n; i++) { const t = i / RATE, v = amp * Math.sin(2 * Math.PI * (48 + 90 * Math.exp(-t * 28)) * t) * Math.exp(-t * 9); L[s0 + i] += v; R[s0 + i] += v; }
}

for (let b = 0; b * bar < SECONDS; b++) {
  const t = b * bar, c = chords[b % 4], intensity = Math.min(1, t / 14);
  c.forEach((x, k) => tone(t, bar * 1.1, root + x, 0.05, 0.5, 0.45, 0.3 + 0.13 * k, true));          // pad
  if (t > 3) tone(t, bar, root + c[0] - 12, 0.13 * intensity, 0.03, 1.2);                              // bass
  if (t > 4) for (let k = 0; k < 8; k++) {                                                             // arpeggio
    if (rnd() < 0.15) continue;
    tone(t + k * (beat / 2), beat * 1.8, root + 12 + c[0] + PENTA[Math.floor(rnd() * 5)] + (rnd() < 0.3 ? 12 : 0), 0.085, 0.008, 3.4, 0.2 + rnd() * 0.6);
  }
  if (t > 10) for (let k = 0; k < 4; k++) kick(t + k * beat, 0.16 * intensity);
  if (t > 10) for (let k = 0; k < 8; k++) tick(t + k * (beat / 2) + beat / 4, 0.03 * intensity);
}
let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = 0.8 / peak, fadeIn = RATE * 1.5, fadeOut = RATE * 4;
const buf = Buffer.alloc(44 + n * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write("WAVEfmt ", 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(RATE, 24); buf.writeUInt32LE(RATE * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(n * 4, 40);
for (let i = 0; i < n; i++) {
  const f = Math.min(1, i / fadeIn, (n - i) / fadeOut) * g;
  buf.writeInt16LE(Math.max(-1, Math.min(1, L[i] * f)) * 32767, 44 + i * 4);
  buf.writeInt16LE(Math.max(-1, Math.min(1, R[i] * f)) * 32767, 46 + i * 4);
}
fs.writeFileSync(process.argv[2] || "soundtrack.wav", buf);
console.log("soundtrack written");
