/** Paths and timing constants of the promo renderer. */
const path = require("path");

const ROOT = path.join(__dirname, "..", "..", "..");

module.exports = {
  ROOT,
  PROMO_DIR: path.join(__dirname, ".."),
  /** URL of the running app (build it without Supabase variables so there is no login screen). */
  APP_URL: process.env.APP_URL || "http://localhost:4173",
  OUT: process.env.OUT || path.join(ROOT, "docs", "wavely-promo.mp4"),
  VIEWPORT: { width: 1920, height: 1080 },
  /** Pause between narrated sentences, in seconds. */
  GAP: 0.25,
  /** Delay between a scene starting and its narration starting, in seconds. */
  LEAD: 0.5,
  /** Tap indicator → click delay, in milliseconds. */
  TAP_WAIT_MS: 420,
};
