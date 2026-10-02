/**
 * Generates the narration clips (one WAV per sentence) and a manifest with their durations.
 *   node narrate.cjs <outDir>
 * Voice: Festival "slt" HTS (apt: festival festvox-us-slt-hts), the clearest free offline voice available.
 * To use your own recording or a cloud voice instead, put files named  s<scene>_<index>.wav  (0-based, e.g. s3_1.wav)
 * into a folder and run with NARRATION_DIR=<folder>; they are only normalised and measured.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const out = process.argv[2];
fs.mkdirSync(out, { recursive: true });
const script = JSON.parse(fs.readFileSync(path.join(__dirname, "narration.json"), "utf8"));
const custom = process.env.NARRATION_DIR;
const manifest = {};

const norm = (src, dst) =>
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-i", src, "-ar", "44100", "-ac", "1",
    "-af", "highpass=f=90,acompressor=threshold=-20dB:ratio=3:attack=5:release=80,loudnorm=I=-16:TP=-1.5:LRA=7", dst]);
const dur = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

for (const [scene, sentences] of Object.entries(script)) {
  manifest[scene] = [];
  sentences.forEach((text, k) => {
    const raw = path.join(out, `raw_s${scene}_${k}.wav`);
    const wav = path.join(out, `s${scene}_${k}.wav`);
    if (custom) fs.copyFileSync(path.join(custom, `s${scene}_${k}.wav`), raw);
    else {
      const esc = text.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      execFileSync("festival", ["--pipe"], {
        input: `(voice_cmu_us_slt_arctic_hts)\n(set! hts_duration_stretch 1.06)\n(utt.save.wave (utt.synth (Utterance Text "${esc}")) "${raw}" 'riff)\n`,
      });
    }
    norm(raw, wav);
    manifest[scene].push({ text, file: wav, seconds: dur(wav) });
  });
}
fs.writeFileSync(path.join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log("narration clips:", Object.values(manifest).flat().length);
