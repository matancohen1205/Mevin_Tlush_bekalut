/** Audio mix and final encode: narration over a ducked soundtrack, muxed with the recorded video. */
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { GAP, LEAD } = require("./config.cjs");

/** Where each narration clip starts (seconds from t0), given the scene start times. */
function clipPlacements(narration, sceneStarts) {
  return Object.entries(narration).flatMap(([scene, clips]) => {
    let at = sceneStarts[scene] + LEAD;
    return clips.map((clip) => {
      const placement = { file: clip.file, at };
      at += clip.seconds + GAP;
      return placement;
    });
  });
}

/** ffmpeg filter graph: delay each clip, mix them, duck the music under the voice, fade, mix again. */
function buildFilter(clips, length) {
  const fades = `afade=in:st=0:d=1,afade=out:st=${length - 4}:d=4`;
  if (!clips.length) return `[1:a]${fades}[mix]`;
  const delayed = clips.map((c, k) => `[${k + 2}:a]adelay=${Math.round(c.at * 1000)}|${Math.round(c.at * 1000)}[c${k}]`).join(";");
  const labels = clips.map((_, k) => `[c${k}]`).join("");
  return `${delayed};${labels}amix=inputs=${clips.length}:normalize=0,asplit=2[n1][n2];` +
    `[1:a][n1]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=450:makeup=1[duck];` +
    `[duck]volume=0.85[d];[d][n2]amix=inputs=2:normalize=0:duration=first,${fades}[mix]`;
}

/** Encodes `webm` + soundtrack + narration into an H.264/AAC mp4 at `out`. */
function encode({ webm, soundtrack, narration, sceneStarts, offset, length, out }) {
  fs.mkdirSync(path.dirname(out), { recursive: true });
  const clips = clipPlacements(narration, sceneStarts);
  const inputs = ["-ss", offset.toFixed(2), "-i", webm, "-i", soundtrack, ...clips.flatMap((c) => ["-i", c.file])];
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", buildFilter(clips, length),
    "-map", "0:v", "-map", "[mix]", "-t", String(length), "-vf", "fps=30,format=yuv420p",
    "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", out]);
}

module.exports = { encode };
