/** Tiny helpers shared by the renderer modules. */
const fs = require("fs");

/** Resolves after `ms` milliseconds. */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Base64 of a file's bytes (for embedding fonts and images as data URLs). */
const base64 = (file) => fs.readFileSync(file).toString("base64");

module.exports = { sleep, base64 };
