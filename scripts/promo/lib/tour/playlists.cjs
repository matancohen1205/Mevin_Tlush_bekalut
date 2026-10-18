/** Scene 3: create a playlist from a sentence ("smart create") and open it. */

/** Library → New → type a description → Create → open the new playlist. */
module.exports = async function playlists({ $, tap, sleep }) {
  await sleep(300);
  await tap($(".nav button", { hasText: "Library" }), 300);
  await sleep(400);
  await tap($(".topbar .btn"), 300);
  await sleep(500);
  await tap($("#pr"), 200);
  await $("#pr").pressSequentially("Night drive with mellow rock", { delay: 45 });
  await sleep(300);
  await tap($(".sheet .btn.primary.wide"), 300);
  await $(".mosaic").first().waitFor();
  await sleep(900);
  await tap($(".rows button.row").first(), 300);
};
