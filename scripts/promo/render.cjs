/**
 * Renders the Wavely promo video (≈55-60 s, 1920x1080, with soundtrack).
 *
 * Prerequisites: the app running (e.g. `npm run build && npm run preview`, built WITHOUT Supabase variables so no login screen),
 * `npm i -D playwright` (+ `npx playwright install chromium`), and ffmpeg on PATH.
 *   node scripts/promo/render.cjs            -> docs/wavely-promo.mp4
 * Narration: needs festival + festvox-us-slt-hts (apt) and ffmpeg, or NARRATION_DIR (see narrate.cjs). Set NARRATION=0 to render without a voice.
 * Environment: APP_URL (default http://localhost:4173), CHROMIUM (path to a chromium binary, optional)
 */
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const APP = process.env.APP_URL || "http://localhost:4173";
const OUT = process.env.OUT || path.join(ROOT, "docs", "wavely-promo.mp4");
const TMP = fs.mkdtempSync(path.join(require("os").tmpdir(), "wavely-promo-"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b64 = (f) => fs.readFileSync(f).toString("base64");

// fonts for the stage (copied next to promo.html) and for the app inside the phone (injected as data URLs)
const fonts = (pkg) => path.join(ROOT, "node_modules", "@fontsource", pkg, "files");
fs.mkdirSync(path.join(__dirname, "fonts"), { recursive: true });
for (const w of [400, 500, 600, 700]) fs.copyFileSync(path.join(fonts("poppins"), `poppins-latin-${w}-normal.woff2`), path.join(__dirname, "fonts", `poppins-latin-${w}-normal.woff2`));
const appFontCss = [
  ...[400, 500, 600, 700].map((w) => `@font-face{font-family:"Poppins";font-weight:${w};src:url(data:font/woff2;base64,${b64(path.join(fonts("poppins"), `poppins-latin-${w}-normal.woff2`))})}`),
  ...[400, 500, 700, 800].flatMap((w) => ["hebrew", "latin"].map((s) => `@font-face{font-family:"Heebo";font-weight:${w};${s === "hebrew" ? "unicode-range:U+0590-05FF,U+200C-2010,U+20AA;" : ""}src:url(data:font/woff2;base64,${b64(path.join(fonts("heebo"), `heebo-${s}-${w}-normal.woff2`))})}`)),
  ".banner{display:none!important} ::-webkit-scrollbar{display:none} *{scrollbar-width:none}",
].join("\n");

(async () => {
  const withVoice = process.env.NARRATION !== "0";
  let narr = {};
  if (withVoice) {
    console.log("0/3 narration");
    execFileSync("node", [path.join(__dirname, "narrate.cjs"), path.join(TMP, "narr")], { stdio: "inherit" });
    narr = JSON.parse(fs.readFileSync(path.join(TMP, "narr", "manifest.json"), "utf8"));
  }
  const GAP = 0.25, LEAD = 0.5; // pause between sentences, delay after a scene starts
  const spoken = (i) => (narr[i] || []).reduce((a, c) => a + c.seconds + GAP, 0);
  const starts = {};   // scene -> seconds since T0
  console.log("1/3 recording");
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: "en-US", recordVideo: { dir: TMP, size: { width: 1920, height: 1080 } } });
  const created = Date.now();
  await ctx.addInitScript((origin) => {
    if (location.origin !== origin) return;
    localStorage.setItem("wavely.prefs.v1", JSON.stringify({ onboarded: true, genres: ["pop", "indie", "jazz"], country: "il", source: "itunes" }));
    localStorage.setItem("wavely.lang", "en");
    localStorage.setItem("wavely.theme", "light");
  }, new URL(APP).origin);
  const page = await ctx.newPage();
  page.on("pageerror", (e) => console.log("page error:", e.message));
  const desk = "data:image/png;base64," + b64(path.join(ROOT, "docs", "screenshots", "08-desktop.png"));
  await page.goto("file://" + path.join(__dirname, "promo.html") + "?app=" + encodeURIComponent(APP));
  await page.evaluate((d) => (document.getElementById("desk").src = d), desk);
  const frame = page.frames().find((f) => f !== page.mainFrame());
  await frame.waitForSelector(".row .t", { timeout: 20000 });
  await frame.addStyleTag({ content: appFontCss });
  await frame.evaluate(() => document.fonts.ready);
  const T0 = Date.now();
  const offset = (T0 - created) / 1000;
  const at = async (s) => { const d = s * 1000 - (Date.now() - T0); if (d > 0) await sleep(d); };

  const $ = (sel, opts) => frame.locator(sel, opts);
  const tap = async (loc, wait = 420) => {
    await loc.scrollIntoViewIfNeeded();
    const bb = await loc.boundingBox();
    await page.evaluate(([x, y]) => window.ripple(x, y), [bb.x + bb.width / 2, bb.y + bb.height / 2]);
    await sleep(wait);
    await loc.click({ force: true });
  };
  const scene = async (i) => {
    starts[i] = (Date.now() - T0) / 1000;
    await page.evaluate((k) => window.setScene(k), i);
    let t = LEAD * 1000;
    for (const c of narr[i] || []) {
      setTimeout(() => page.evaluate((x) => window.setCaption(x), c.text).catch(() => {}), t);
      t += (c.seconds + GAP) * 1000;
    }
    setTimeout(() => page.evaluate(() => window.setCaption("")).catch(() => {}), t + 400);
  };

  // Scenes run one after another. Each lasts at least `min` seconds so captions can be read,
  // longer if its actions take longer. The soundtrack is sized to the real total afterwards.
  const run = async (i, min, actions) => {
    min = Math.max(min, LEAD + spoken(i) + 0.5);
    const t = Date.now();
    await scene(i);
    await actions();
    const rest = min * 1000 - (Date.now() - t);
    if (rest > 0) await sleep(rest);
  };

  await scene(0);
  await at(Math.max(4.5, LEAD + spoken(0) + 0.8)); // intro

  await run(1, 6.5, async () => {
    await sleep(900);
    await tap($(".chip-row button", { hasText: "Japan" }).first());
    await sleep(800);
    await tap($(".chip-row button", { hasText: "Chill" }).first());
  });

  await run(2, 8, async () => {
    await sleep(500);
    await tap($(".rows button.row").nth(1));
    await sleep(600);
    await tap($(".mini .open"));
    await sleep(1300);
    await frame.evaluate(() => {
      const r = document.querySelector(".seek input");
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(r, 18);
      r.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await sleep(700);
    await tap($(".full .info .icon-btn"));
    await sleep(900);
    await tap($(".full [aria-label='Close player']"));
  });

  await run(3, 10, async () => {
    await sleep(300);
    await tap($(".nav button", { hasText: "Library" }), 300);
    await sleep(400);
    await tap($(".topbar .btn"), 300);
    await sleep(500);
    await tap($("#pr"), 200);
    await $("#pr").pressSequentially("Night drive with mellow rock", { delay: 45 });
    await sleep(300);
    await tap($(".sheet .btn.primary.wide"), 300);
    await $(".mosaic").first().waitFor();
    await sleep(900);
    await tap($(".rows button.row").first(), 300);
  });

  await run(4, 8.5, async () => {
    await sleep(300);
    await tap($(".nav button", { hasText: "Community" }), 300);
    await sleep(900);
    await tap($(".post").first().locator("[aria-label='Like']"), 300);
    await sleep(400);
    await tap($(".post").first().locator("[aria-label='Comments']"), 300);
    await sleep(600);
    await tap($("[aria-label='Comment']"), 200);
    await $("[aria-label='Comment']").pressSequentially("Love this one 🎧", { delay: 50 });
    await sleep(300);
    await tap($(".inline-form .btn"), 300);
    await sleep(900);
    await tap($("[aria-label='Close']"), 300);
  });

  await run(5, 6.5, async () => {
    await sleep(300);
    await tap($(".nav button", { hasText: "Profile" }), 300);
    await sleep(600);
    await tap($("button[lang='he']"), 300);
    await sleep(1000);
    await tap($(".nav button").first(), 300);
  });

  await run(6, 4.5, async () => {});
  await run(7, 4.5, async () => {});
  const total = (Date.now() - T0) / 1000;
  const video = page.video();
  await ctx.close();
  await browser.close();
  const webm = await video.path();

  console.log("2/3 soundtrack");
  const wav = path.join(TMP, "soundtrack.wav");
  const length = Math.ceil(total + 0.5);
  execFileSync("node", [path.join(__dirname, "music.cjs"), wav, String(length)]);

  console.log("3/3 encoding");
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  const clips = [];
  for (const [i, list] of Object.entries(narr)) {
    let t = starts[i] + LEAD;
    for (const c of list) { clips.push({ file: c.file, at: t }); t += c.seconds + GAP; }
  }
  const inputs = ["-ss", offset.toFixed(2), "-i", webm, "-i", wav, ...clips.flatMap((c) => ["-i", c.file])];
  const fades = `afade=in:st=0:d=1,afade=out:st=${length - 4}:d=4`;
  let filter, map;
  if (clips.length) {
    const delayed = clips.map((c, k) => `[${k + 2}:a]adelay=${Math.round(c.at * 1000)}|${Math.round(c.at * 1000)}[c${k}]`).join(";");
    const labels = clips.map((_, k) => `[c${k}]`).join("");
    // music ducks under the voice, then both are mixed
    filter = `${delayed};${labels}amix=inputs=${clips.length}:normalize=0,asplit=2[n1][n2];` +
      `[1:a][n1]sidechaincompress=threshold=0.02:ratio=10:attack=15:release=450:makeup=1[duck];` +
      `[duck]volume=0.85[d];[d][n2]amix=inputs=2:normalize=0:duration=first,${fades}[mix]`;
    map = ["-map", "0:v", "-map", "[mix]"];
  } else {
    filter = `[1:a]${fades}[mix]`;
    map = ["-map", "0:v", "-map", "[mix]"];
  }
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", filter, ...map, "-t", String(length),
    "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "19", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", OUT]);
  console.log("done ->", OUT);
})().catch((e) => { console.error("FAILED:", e); process.exit(1); });
