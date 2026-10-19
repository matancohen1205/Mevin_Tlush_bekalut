/** The browser's native share sheet (Web Share API), where available. */

export type ShareOutcome = "shared" | "cancelled" | "unsupported";

/** Opens the system share sheet for a link; "unsupported" means the caller should fall back to copying. */
export async function shareLink(data: { title: string; text?: string; url: string }): Promise<ShareOutcome> {
  if (typeof navigator === "undefined" || typeof navigator.share !== "function") return "unsupported";
  try {
    await navigator.share(data);
    return "shared";
  } catch (e) {
    return (e as DOMException)?.name === "AbortError" ? "cancelled" : "unsupported";
  }
}
