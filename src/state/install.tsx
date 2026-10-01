import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Chrome/Edge/Android "install app" prompt. `install` is null when unavailable or already installed. */
export function useInstall() {
  const [evt, setEvt] = useState<BeforeInstallPromptEvent | null>(null);
  useEffect(() => {
    const on = (e: Event) => { e.preventDefault(); setEvt(e as BeforeInstallPromptEvent); };
    const done = () => setEvt(null);
    addEventListener("beforeinstallprompt", on);
    addEventListener("appinstalled", done);
    return () => { removeEventListener("beforeinstallprompt", on); removeEventListener("appinstalled", done); };
  }, []);
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !matchMedia("(display-mode: standalone)").matches;
  return { install: evt ? async () => { await evt.prompt(); setEvt(null); } : null, ios };
}
