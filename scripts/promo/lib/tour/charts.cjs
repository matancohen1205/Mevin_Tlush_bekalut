/** Scene 1: browse charts by country and mood. */

/** Taps a country chip and a mood chip. */
module.exports = async function charts({ $, tap, sleep }) {
  await sleep(900);
  await tap($(".chip-row button", { hasText: "Japan" }).first());
  await sleep(800);
  await tap($(".chip-row button", { hasText: "Chill" }).first());
};
