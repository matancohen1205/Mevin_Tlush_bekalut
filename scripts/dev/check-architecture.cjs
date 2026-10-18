/**
 * Enforces the project's architecture rules (see architecture-rules.cjs):
 *   1. no file longer than MAX_LINES (src/ and scripts/)
 *   2. every top-level function has a comment above it
 *   3. layers only import from the layers they are allowed to
 *   4. I/O (storage, network, Supabase) stays in services/
 * usage: node scripts/dev/check-architecture.cjs
 */
const fs = require("fs");
const path = require("path");
const { MAX_LINES, ALLOWED_IMPORTS, FORBIDDEN_OUTSIDE } = require("./architecture-rules.cjs");

const ROOT = path.join(__dirname, "..", "..");
const SRC = path.join(ROOT, "src");
const SCRIPTS = path.join(ROOT, "scripts");
const problems = [];

/** All files under `dir` (recursive). */
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

/** Path relative to src/, with forward slashes. */
const rel = (file) => path.relative(ROOT, file).split(path.sep).join("/").replace(/^src\//, "");

/** Layer of a src-relative path: its first folder if that is a known layer, else "entry" (main.tsx, env typings). */
const layerOf = (relPath) => {
  const first = relPath.split("/")[0];
  return ALLOWED_IMPORTS[first] ? first : "entry";
};

/** Records a rule violation. */
const report = (file, line, rule, text) => problems.push(`${rel(file)}${line ? ":" + line : ""}  [${rule}] ${text}`);

/** Rule 1: file length. */
function checkLength(file, lines) {
  if (/\.(tsx?|cjs|js|css|html)$/.test(file) && lines.length > MAX_LINES) report(file, 0, "size", `${lines.length} lines (max ${MAX_LINES}); split it`);
}

/** Rule 2: a comment must sit directly above every top-level function or arrow-function constant. */
function checkComments(file, lines) {
  if (!/\.(tsx?|cjs|js)$/.test(file) || file.includes("__tests__")) return;
  const decl = /^(export\s+)?(default\s+)?(async\s+)?function\s+\w+|^(export\s+)?const\s+\w+\s*(:[^=]+)?=\s*(async\s*)?(\([^)]*\)|\w+)\s*(:[^=]+)?=>/;
  lines.forEach((text, i) => {
    if (!decl.test(text)) return;
    const above = (lines[i - 1] ?? "").trim();
    if (!(above.endsWith("*/") || above.startsWith("//"))) report(file, i + 1, "comment", `function without a comment: ${text.trim().slice(0, 60)}`);
  });
}

/** Rule 3: layer imports. */
function checkImports(file, lines) {
  const layer = layerOf(rel(file));
  if (!ALLOWED_IMPORTS[layer] || !/\.(tsx?|css)$/.test(file)) return;
  lines.forEach((text, i) => {
    const m = text.match(/(?:from\s+|import\s+)["'](\.[^"']*)["']/);
    if (!m) return;
    const target = rel(path.resolve(path.dirname(file), m[1]));
    const targetLayer = layerOf(target);
    if (targetLayer !== layer && ALLOWED_IMPORTS[targetLayer] && !ALLOWED_IMPORTS[layer].includes(targetLayer))
      report(file, i + 1, "layer", `${layer}/ must not import from ${targetLayer}/ (${m[1]})`);
  });
}

/** Rule 4: I/O confinement. */
function checkIo(file, lines) {
  const where = rel(file);
  if (!/\.tsx?$/.test(file) || where.includes("__tests__")) return;
  for (const rule of FORBIDDEN_OUTSIDE)
    lines.forEach((text, i) => {
      if (text.trim().startsWith("//") || text.trim().startsWith("*")) return;
      if (rule.pattern.test(text) && !rule.allowedIn.some((a) => where.startsWith(a) || where === a)) report(file, i + 1, "io", rule.message);
    });
}

/** True for generated or vendored files that the rules do not apply to. */
const ignored = (file) => /node_modules|[\\/]fonts[\\/]/.test(file);

for (const file of walk(SRC)) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  checkLength(file, lines);
  checkComments(file, lines);
  checkImports(file, lines);
  checkIo(file, lines);
}
// build and tooling scripts: size and comment rules only
for (const file of walk(SCRIPTS).filter((f) => !ignored(f))) {
  const lines = fs.readFileSync(file, "utf8").split("\n");
  checkLength(file, lines);
  checkComments(file, lines);
}

if (problems.length) {
  console.log(problems.join("\n"));
  console.log(`\n${problems.length} architecture problem(s).`);
  process.exit(1);
}
console.log("Architecture check passed.");
