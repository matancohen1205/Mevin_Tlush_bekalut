/** Scene 2: play a song, open the full player, seek and like. */

/** Sets the seek slider to `seconds` the way a user drag would. */
async function seekTo(frame, seconds) {
  await frame.evaluate((value) => {
    const slider = document.querySelector(".seek input");
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(slider, value);
    slider.dispatchEvent(new Event("input", { bubbles: true }));
  }, seconds);
}

/** Plays the second chart row, opens the full player, seeks, likes, closes. */
module.exports = async function player({ $, tap, sleep, frame }) {
  await sleep(500);
  await tap($(".rows button.row").nth(1));
  await sleep(600);
  await tap($(".mini .open"));
  await sleep(1300);
  await seekTo(frame, 18);
  await sleep(700);
  await tap($(".full .info .icon-btn"));
  await sleep(900);
  await tap($(".full [aria-label='Close player']"));
};
