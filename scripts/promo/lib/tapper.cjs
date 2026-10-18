/** Helpers to drive the app inside the phone: a locator shortcut and a visible "tap" before each click. */
const { TAP_WAIT_MS } = require("./config.cjs");
const { sleep } = require("./util.cjs");

/** Returns { $, tap, sleep, frame }: `$(selector)` finds in the app, `tap(locator)` shows a ripple then clicks. */
function createTapper(page, frame) {
  /** Locator inside the app frame. */
  const $ = (selector, options) => frame.locator(selector, options);

  /** Shows the tap ripple over the element, waits, then clicks it. */
  async function tap(locator, wait = TAP_WAIT_MS) {
    await locator.scrollIntoViewIfNeeded();
    const box = await locator.boundingBox();
    await page.evaluate(([x, y]) => window.ripple(x, y), [box.x + box.width / 2, box.y + box.height / 2]);
    await sleep(wait);
    await locator.click({ force: true });
  }

  return { $, tap, sleep, frame };
}

module.exports = { createTapper };
