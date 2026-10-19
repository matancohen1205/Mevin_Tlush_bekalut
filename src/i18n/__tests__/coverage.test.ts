import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { en } from "../en";

const SRC = join(__dirname, "..", "..");
const HEBREW = /[֐-׿]/;

/** All .ts/.tsx files under `dir`, excluding tests and the dictionaries themselves. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "__tests__" || name === "en" ? [] : sourceFiles(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

describe("English dictionary coverage", () => {
  it("has a translation for every Hebrew string passed to tr() or showToast()", () => {
    const missing = new Set<string>();
    const call = /\b(?:tr|trn|showToast)\(\s*"((?:[^"\\]|\\.)*)"/g;
    for (const file of sourceFiles(SRC)) {
      for (const [, text] of readFileSync(file, "utf8").matchAll(call)) {
        if (HEBREW.test(text) && !(text in en)) missing.add(text);
      }
    }
    expect([...missing]).toEqual([]);
  });

  it("translates every catalogue label (countries, moods, genres)", () => {
    const catalog = readFileSync(join(SRC, "services/music/catalog.ts"), "utf8");
    const labels = [...catalog.matchAll(/(?:name|label): "([^"]+)"/g)].map((m) => m[1]);
    expect(labels.filter((l) => !(l in en))).toEqual([]);
  });
});
