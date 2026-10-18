/** What the stage shows in each scene (title, subtitle, tags, layout). Order = video order. */
window.SCENES = [
  { mode: "center", kicker: "", title: "Wavely", sub: "great music for everyone", step: -1 },
  { kicker: "Discover", title: "Charts from around the world", sub: "Pick a country or a mood, then press play.", step: 0 },
  { kicker: "Listen", title: "A player that feels alive", sub: "Queue, shuffle, seek and lock-screen controls.", step: 1 },
  { kicker: "Create", title: "Describe a vibe, get a playlist", sub: "Smart create turns one sentence into songs.", step: 2 },
  { kicker: "Share", title: "Your music, your people", sub: "A feed with likes, comments and private profiles.", step: 3 },
  { kicker: "Everywhere", title: "Hebrew and English, RTL ready", sub: "The whole interface flips direction.", step: 4 },
  { mode: "wide", kicker: "Built right", title: "Installable, accessible, fast", sub: "", tags: ["PWA", "Offline shell", "axe-core clean", "Responsive"], step: -1, laptop: true },
  { mode: "center", kicker: "", title: "Wavely", sub: "great music for everyone", tags: ["React", "TypeScript", "PWA", "i18n"], step: -1 },
];
