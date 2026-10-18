import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Track } from "../../../types";
import { createErrorPolicy, type ErrorContext } from "../playbackErrors";

beforeAll(() => {
  // the policy checks `audio.src === location.href` to tell "cleared source" from a real failure
  vi.stubGlobal("location", { href: "http://localhost/" });
});

const track = (id: string): Track => ({ id, title: id, artist: "a", artwork: "", durationMs: 1000, source: "itunes", previewUrl: "https://x/" + id });

/** Builds an error context with spies; the audio element has a real (http) source. */
function context(overrides: Partial<ErrorContext> = {}): ErrorContext & { skipTo: ReturnType<typeof vi.fn>; stop: ReturnType<typeof vi.fn>; notify: ReturnType<typeof vi.fn> } {
  return {
    audio: { src: "https://x/a.mp3" } as HTMLAudioElement,
    track: track("t0"), index: 0, queueLength: 3,
    skipTo: vi.fn(), stop: vi.fn(), notify: vi.fn(),
    ...overrides,
  } as never;
}

describe("playback error policy", () => {
  it("ignores errors caused by clearing the source on purpose", () => {
    const ctx = context({ audio: { src: "" } as HTMLAudioElement });
    createErrorPolicy().onError(ctx);
    expect(ctx.skipTo).not.toHaveBeenCalled();
    expect(ctx.stop).not.toHaveBeenCalled();
  });

  it("skips to the next track when one fails", () => {
    const ctx = context();
    createErrorPolicy().onError(ctx);
    expect(ctx.skipTo).toHaveBeenCalledWith(1);
    expect(ctx.notify).toHaveBeenCalled();
  });

  it("stops at the end of the queue instead of skipping", () => {
    const ctx = context({ index: 2 });
    createErrorPolicy().onError(ctx);
    expect(ctx.stop).toHaveBeenCalled();
    expect(ctx.skipTo).not.toHaveBeenCalled();
  });

  it("stops after too many consecutive failures, and success resets the counter", () => {
    const policy = createErrorPolicy();
    const long = { queueLength: 20 };
    const results = Array.from({ length: 6 }, (_, i) => { const c = context({ ...long, index: i }); policy.onError(c); return c; });
    expect(results[4].skipTo).not.toHaveBeenCalled();
    expect(results[4].stop).toHaveBeenCalled();
    policy.onSuccess();
    const again = context(long);
    policy.onError(again);
    expect(again.skipTo).toHaveBeenCalled();
  });
});
