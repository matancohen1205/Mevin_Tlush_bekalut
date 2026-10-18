/** The architecture rules, as data, so they are easy to read and change in one place. */

/** Maximum lines per source file. */
const MAX_LINES = 150;

/**
 * Which top-level folders of src/ each layer may import from (besides itself).
 * Rule of thumb: dependencies only point "downwards" – UI → state → services/domain → types.
 */
const ALLOWED_IMPORTS = {
  types: [],
  domain: ["types"],
  services: ["types", "domain"],
  data: ["types", "services"],
  i18n: ["services", "types"],
  hooks: ["types", "domain", "services", "i18n"],
  state: ["types", "domain", "services", "data", "i18n", "hooks"],
  components: ["types", "domain", "state", "hooks", "i18n"],
  pages: ["types", "domain", "state", "hooks", "i18n", "components"],
  app: ["types", "domain", "state", "hooks", "i18n", "components", "pages"],
  styles: [],
  // main.tsx: the single place that wires everything together
  entry: ["app", "services", "styles", "types", "i18n"],
};

/** Words that may only appear in one layer (single responsibility for I/O). */
const FORBIDDEN_OUTSIDE = [
  { pattern: /\blocalStorage\b|\bsessionStorage\b/, allowedIn: ["services/storage/"], message: "storage access belongs in services/storage" },
  { pattern: /\bfetch\(/, allowedIn: ["services/"], message: "network calls belong in services/" },
  { pattern: /services\/cloud\/supabase/, allowedIn: ["services/"], message: "Supabase client may only be used inside services/" },
  { pattern: /from "react"/, allowedIn: ["state/", "hooks/", "components/", "pages/", "app/", "i18n/", "main.tsx"], message: "React is not allowed in domain/, services/ and data/" },
];

module.exports = { MAX_LINES, ALLOWED_IMPORTS, FORBIDDEN_OUTSIDE };
