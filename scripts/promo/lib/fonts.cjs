/** Fonts for the promo: copied next to the stage page, and injected as data URLs into the app inside the phone. */
const fs = require("fs");
const path = require("path");
const { ROOT, PROMO_DIR } = require("./config.cjs");
const { base64 } = require("./util.cjs");

const POPPINS_WEIGHTS = [400, 500, 600, 700];
const HEEBO_WEIGHTS = [400, 500, 700, 800];

/** Folder of an @fontsource package's font files. */
const fontFiles = (pkg) => path.join(ROOT, "node_modules", "@fontsource", pkg, "files");

/** Copies Poppins into scripts/promo/fonts so promo.html can load it with relative URLs. */
function copyStageFonts() {
  const target = path.join(PROMO_DIR, "fonts");
  fs.mkdirSync(target, { recursive: true });
  for (const w of POPPINS_WEIGHTS) {
    const name = `poppins-latin-${w}-normal.woff2`;
    fs.copyFileSync(path.join(fontFiles("poppins"), name), path.join(target, name));
  }
}

/** One @font-face rule with the font embedded as a data URL. */
function faceRule(family, weight, file, extra = "") {
  return `@font-face{font-family:"${family}";font-weight:${weight};${extra}src:url(data:font/woff2;base64,${base64(file)})}`;
}

/** CSS injected into the app: embedded fonts, no offline banner, no scrollbars. */
function appFontCss() {
  const poppins = POPPINS_WEIGHTS.map((w) => faceRule("Poppins", w, path.join(fontFiles("poppins"), `poppins-latin-${w}-normal.woff2`)));
  const heebo = HEEBO_WEIGHTS.flatMap((w) =>
    ["hebrew", "latin"].map((subset) =>
      faceRule("Heebo", w, path.join(fontFiles("heebo"), `heebo-${subset}-${w}-normal.woff2`), subset === "hebrew" ? "unicode-range:U+0590-05FF,U+200C-2010,U+20AA;" : ""),
    ),
  );
  return [...poppins, ...heebo, ".banner{display:none!important} ::-webkit-scrollbar{display:none} *{scrollbar-width:none}"].join("\n");
}

module.exports = { copyStageFonts, appFontCss };
