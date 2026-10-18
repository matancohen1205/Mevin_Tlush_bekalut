/** Encodes raw samples as a 16-bit mono PCM WAV file. */

/** Writes an ASCII tag into a DataView at `offset`. */
function writeTag(view: DataView, offset: number, text: string): void {
  [...text].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
}

/** Builds the 44-byte RIFF/WAVE header for `sampleCount` mono 16-bit samples. */
function writeHeader(view: DataView, sampleCount: number, rate: number): void {
  const dataBytes = sampleCount * 2;
  writeTag(view, 0, "RIFF"); view.setUint32(4, 36 + dataBytes, true); writeTag(view, 8, "WAVE");
  writeTag(view, 12, "fmt "); view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, rate, true); view.setUint32(28, rate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  writeTag(view, 36, "data"); view.setUint32(40, dataBytes, true);
}

/** Converts float samples in [-1, 1] to a WAV Blob. */
export function encodeWav(samples: Float32Array, rate: number): Blob {
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);
  writeHeader(view, samples.length, rate);
  samples.forEach((s, i) => view.setInt16(44 + i * 2, Math.max(-1, Math.min(1, s)) * 32767, true));
  return new Blob([buffer], { type: "audio/wav" });
}
