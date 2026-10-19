/** When the app is opened from a share link, shows the shared playlist so it can be saved. */
import { useEffect } from "react";
import { SHARE_PARAM, decodePayload } from "../../domain/shareLink";
import { readQueryParam, removeQueryParam } from "../../services/browser/urlParams";
import { useUi } from "../ui";

/** Runs once on start: reads `?share=`, opens the preview dialog, and cleans the address bar. */
export function useIncomingShare(): void {
  const { setSheet } = useUi();
  useEffect(() => {
    const code = readQueryParam(SHARE_PARAM);
    if (!code) return;
    removeQueryParam(SHARE_PARAM);
    const payload = decodePayload(code);
    if (payload) setSheet({ kind: "shared", payload });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
