/** Registers the offline-shell service worker. */

/** Registers /sw.js in production over http(s); silently skipped in dev and in environments without service workers. */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;
  addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => undefined));
}
