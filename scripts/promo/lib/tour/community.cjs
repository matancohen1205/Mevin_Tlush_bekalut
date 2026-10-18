/** Scene 4: the community feed: like, comment. */

/** Community → like the first post → open comments → type and send a comment. */
module.exports = async function community({ $, tap, sleep }) {
  await sleep(300);
  await tap($(".nav button", { hasText: "Community" }), 300);
  await sleep(900);
  await tap($(".post").first().locator("[aria-label='Like']"), 300);
  await sleep(400);
  await tap($(".post").first().locator("[aria-label='Comments']"), 300);
  await sleep(600);
  await tap($("[aria-label='Comment']"), 200);
  await $("[aria-label='Comment']").pressSequentially("Love this one 🎧", { delay: 50 });
  await sleep(300);
  await tap($(".inline-form .btn"), 300);
  await sleep(900);
  await tap($("[aria-label='Close']"), 300);
};
