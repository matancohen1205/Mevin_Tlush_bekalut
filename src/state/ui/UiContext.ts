/** Ephemeral UI state shared across the app: open dialog, current sub-page, toast message. */
import { createContext, useContext } from "react";
import type { SharePayload, Track } from "../../types";

export type Sheet =
  | { kind: "add"; track: Track }
  | { kind: "new" }
  | { kind: "comments"; postId: string }
  | { kind: "compose" }
  | { kind: "editProfile" }
  | { kind: "collab"; playlistId: string }
  | { kind: "shared"; payload: SharePayload }
  | { kind: "more"; postId?: string; userId: string }
  | null;

/** Pages that replace the current tab content (with a back button). */
export type Route = { kind: "user"; id: string } | { kind: "notifs" } | null;

export interface UiApi {
  sheet: Sheet;
  setSheet: (s: Sheet) => void;
  route: Route;
  setRoute: (r: Route) => void;
  toast: string | null;
  /** Shows a message (translated) for a couple of seconds. */
  showToast: (message: string) => void;
}

export const UiContext = createContext<UiApi | null>(null);

/** Access UI state from any component under UiProvider. */
export function useUi(): UiApi {
  const api = useContext(UiContext);
  if (!api) throw new Error("useUi outside UiProvider");
  return api;
}
