/** Scene timing: switches stage scenes, schedules captions, and keeps each scene long enough for its narration. */
const { GAP, LEAD } = require("./config.cjs");
const { sleep } = require("./util.cjs");
const { spokenSeconds } = require("./narration.cjs");

/** Creates the timeline; `t0` is the wall-clock time the video's first frame is based on. */
function createTimeline(page, narration, t0) {
  const starts = {};

  /** Seconds since t0. */
  const elapsed = () => (Date.now() - t0) / 1000;

  /** Switches the stage to scene `i` and schedules its captions in step with the narration. */
  async function scene(i) {
    starts[i] = elapsed();
    await page.evaluate((k) => window.setScene(k), i);
    let delay = LEAD * 1000;
    for (const clip of narration[i] || []) {
      setTimeout(() => page.evaluate((text) => window.setCaption(text), clip.text).catch(() => {}), delay);
      delay += (clip.seconds + GAP) * 1000;
    }
    setTimeout(() => page.evaluate(() => window.setCaption("")).catch(() => {}), delay + 400);
  }

  /** Runs a scene for at least `minSeconds` (longer if its actions or narration need it). */
  async function run(i, minSeconds, actions) {
    const minimum = Math.max(minSeconds, LEAD + spokenSeconds(narration, i) + 0.5);
    const startedAt = Date.now();
    await scene(i);
    await actions();
    const rest = minimum * 1000 - (Date.now() - startedAt);
    if (rest > 0) await sleep(rest);
  }

  /** Waits until `seconds` after t0. */
  async function waitUntil(seconds) {
    const wait = seconds * 1000 - (Date.now() - t0);
    if (wait > 0) await sleep(wait);
  }

  return { scene, run, waitUntil, starts, elapsed };
}

module.exports = { createTimeline };
