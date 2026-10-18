/**
 * Renders the Wavely promo video (≈55-60 s, 1920x1080, with narration, captions and soundtrack).
 *
 * Needs: the app running (build WITHOUT Supabase variables, then `npm run preview`), `playwright` + a Chromium,
 * ffmpeg, and for the default voice `festival festvox-us-slt-hts` (see narrate.cjs). NARRATION=0 renders without a voice.
 *   node scripts/promo/render.cjs        -> docs/wavely-promo.mp4
 * Environment: APP_URL, OUT, CHROMIUM, NARRATION_DIR.
 */
const { execFileSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { OUT, PROMO_DIR, LEAD } = require("./lib/config.cjs");
const { copyStageFonts } = require("./lib/fonts.cjs");
const { encode } = require("./lib/mix.cjs");
const { generateNarration, spokenSeconds } = require("./lib/narration.cjs");
const { openStage } = require("./lib/stage.cjs");
const { createTapper } = require("./lib/tapper.cjs");
const { createTimeline } = require("./lib/timeline.cjs");
const tour = require("./lib/tour/index.cjs");

const INTRO_MIN_SECONDS = 4.5;

/** Records the whole tour and returns what the encoder needs. */
async function record(tmp, narration) {
  const stage = await openStage(tmp);
  const t0 = Date.now();
  const timeline = createTimeline(stage.page, narration, t0);
  const helpers = createTapper(stage.page, stage.frame);

  await timeline.scene(0);
  await timeline.waitUntil(Math.max(INTRO_MIN_SECONDS, LEAD + spokenSeconds(narration, 0) + 0.8));
  for (const { scene, minSeconds, actions } of tour) await timeline.run(scene, minSeconds, () => actions(helpers));

  const total = timeline.elapsed();
  const video = stage.page.video();
  await stage.ctx.close();
  await stage.browser.close();
  return { webm: await video.path(), total, sceneStarts: timeline.starts, offset: (t0 - stage.createdAt) / 1000 };
}

/** Pipeline: narration clips → recording → soundtrack sized to the recording → encode. */
async function main() {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "wavely-promo-"));
  copyStageFonts();
  console.log("0/3 narration");
  const narration = generateNarration(tmp);
  console.log("1/3 recording");
  const rec = await record(tmp, narration);
  console.log("2/3 soundtrack");
  const length = Math.ceil(rec.total + 0.5);
  const soundtrack = path.join(tmp, "soundtrack.wav");
  execFileSync("node", [path.join(PROMO_DIR, "music.cjs"), soundtrack, String(length)]);
  console.log("3/3 encoding");
  encode({ webm: rec.webm, soundtrack, narration, sceneStarts: rec.sceneStarts, offset: rec.offset, length, out: OUT });
  console.log("done ->", OUT);
}

main().catch((e) => { console.error("FAILED:", e); process.exit(1); });
