/** Opens the recording browser, the stage page (phone frame + captions) and the app inside it. */
const { chromium } = require("playwright");
const path = require("path");
const { APP_URL, PROMO_DIR, ROOT, VIEWPORT } = require("./config.cjs");
const { appFontCss } = require("./fonts.cjs");
const { base64 } = require("./util.cjs");

/** Preferences stored for the app so the tour starts past onboarding, in English, light theme. */
const SEED_STORAGE = {
  "wavely.prefs.v1": JSON.stringify({ onboarded: true, genres: ["pop", "indie", "jazz"], country: "il", source: "itunes" }),
  "wavely.lang": "en",
  "wavely.theme": "light",
};

/** Starts recording; returns { browser, ctx, page, frame, createdAt } with the app loaded and styled. */
async function openStage(videoDir) {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const ctx = await browser.newContext({ viewport: VIEWPORT, locale: "en-US", recordVideo: { dir: videoDir, size: VIEWPORT } });
  const createdAt = Date.now();
  await ctx.addInitScript(([origin, storage]) => {
    if (location.origin !== origin) return;
    Object.entries(storage).forEach(([key, value]) => localStorage.setItem(key, value));
  }, [new URL(APP_URL).origin, SEED_STORAGE]);

  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("page error:", e.message));
  await page.goto("file://" + path.join(PROMO_DIR, "promo.html") + "?app=" + encodeURIComponent(APP_URL));
  const desktopShot = "data:image/png;base64," + base64(path.join(ROOT, "docs", "screenshots", "08-desktop.png"));
  await page.evaluate((src) => (document.getElementById("desk").src = src), desktopShot);

  const frame = page.frames().find((f) => f !== page.mainFrame());
  await frame.waitForSelector(".row .t", { timeout: 20000 });
  await frame.addStyleTag({ content: appFontCss() });
  await frame.evaluate(() => document.fonts.ready);
  return { browser, ctx, page, frame, createdAt };
}

module.exports = { openStage };
