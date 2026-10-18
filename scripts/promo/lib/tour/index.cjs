/** The tour: which app actions play during each stage scene, and the minimum seconds each scene lasts. */
const charts = require("./charts.cjs");
const community = require("./community.cjs");
const language = require("./language.cjs");
const player = require("./player.cjs");
const playlists = require("./playlists.cjs");

/** A scene with nothing to do in the app (the stage shows its own content). */
const none = async () => {};

/** Scenes 1–7 (scene 0, the intro, is handled by the renderer). */
module.exports = [
  { scene: 1, minSeconds: 6.5, actions: charts },
  { scene: 2, minSeconds: 8, actions: player },
  { scene: 3, minSeconds: 10, actions: playlists },
  { scene: 4, minSeconds: 8.5, actions: community },
  { scene: 5, minSeconds: 6.5, actions: language },
  { scene: 6, minSeconds: 4.5, actions: none }, // "installable, accessible" laptop scene
  { scene: 7, minSeconds: 4.5, actions: none }, // outro
];
