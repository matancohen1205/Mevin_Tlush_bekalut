/** Scene 5: switch the interface to Hebrew (right-to-left). */

/** Profile → language switch → back to Home. */
module.exports = async function language({ $, tap, sleep }) {
  await sleep(300);
  await tap($(".nav button", { hasText: "Profile" }), 300);
  await sleep(600);
  await tap($("button[lang='he']"), 300);
  await sleep(1000);
  await tap($(".nav button").first(), 300);
};
