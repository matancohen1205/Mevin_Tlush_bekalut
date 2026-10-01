const { chromium } = require("playwright");
const OUT = __dirname + "/../docs/screenshots/";
const shot = async (p, name) => { await p.addStyleTag({ content: ".banner{display:none!important}" }); await p.waitForTimeout(800); await p.screenshot({ path: OUT + name + ".png" }); };
(async () => {
  const b = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  // ---- mobile, English (portfolio is read mostly in English)
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: "en-US" });
  const p = await ctx.newPage();
  p.on("pageerror", (e) => console.log("PAGEERR", e.message));
  await p.goto("" + (process.env.URL || "http://localhost:4173") + "");
  await shot(p, "01-onboarding");
  for (const g of ["Pop", "Indie", "Jazz"]) await p.click(".tile >> text=" + g);
  await p.click("text=Let's go");
  await p.waitForSelector(".row .t");
  await shot(p, "02-home");
  await p.click(".row >> nth=2"); await p.waitForTimeout(1200);
  await p.click(".mini .open"); await p.waitForSelector(".full"); await p.waitForTimeout(500);
  await shot(p, "03-player");
  await p.click(".full [aria-label='Close player']");
  await p.click(".nav >> text=Library");
  await p.click("text=New");
  await p.fill("#pr", "Night drive with mellow rock");
  await p.click("text=Create playlist");
  await p.waitForSelector(".mosaic");
  await p.waitForTimeout(600);
  await p.click(".row >> nth=0");
  await shot(p, "04-playlist");
  await p.click("[aria-label=Back]");
  await p.click(".nav >> text=Community"); await p.waitForSelector(".post");
  await shot(p, "05-community");
  await p.click(".nav >> text=Profile");
  await shot(p, "06-profile");
  // ---- Hebrew RTL
  const he = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: "he-IL" })).newPage();
  await he.goto("" + (process.env.URL || "http://localhost:4173") + "");
  await he.click("text=דלגו בינתיים"); await he.waitForSelector(".row .t");
  await shot(he, "07-hebrew-rtl");
  // ---- desktop
  const d = await (await b.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-US" })).newPage();
  await d.goto("" + (process.env.URL || "http://localhost:4173") + "");
  await d.click("text=Skip for now"); await d.waitForSelector(".row .t");
  await d.click(".row >> nth=1"); await d.waitForTimeout(1500);
  await shot(d, "08-desktop");
  await b.close();
})().catch((e) => { console.log("FAIL", e.message); process.exit(1); });
