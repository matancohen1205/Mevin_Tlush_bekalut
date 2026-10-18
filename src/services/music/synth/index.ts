/**
 * Offline demo audio: a short generative piece per demo track, served as a WAV.
 * Lets the player make real sound with no network and no licensed audio.
 */
import { composeTrack } from "./compose";
import { encodeWav } from "./wav";

const SAMPLE_RATE = 22050;
export const SYNTH_SECONDS = 45;

const blobs = new Map<number, Blob>();
const urls = new Map<number, string>();

/** The WAV for demo track `seed`, rendered once and cached. */
function wavFor(seed: number): Blob {
  let blob = blobs.get(seed);
  if (!blob) {
    blob = encodeWav(composeTrack(seed, SYNTH_SECONDS, SAMPLE_RATE), SAMPLE_RATE);
    blobs.set(seed, blob);
  }
  return blob;
}

/** Blob URL for demo track `seed` (generated on first use, then cached). */
export function synthUrl(seed: number): string {
  let url = urls.get(seed);
  if (!url) {
    url = URL.createObjectURL(wavFor(seed));
    urls.set(seed, url);
  }
  return url;
}

/** Same audio as a data: URL, for environments whose security policy refuses blob: media. */
export function synthDataUrl(seed: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(wavFor(seed));
  });
}
