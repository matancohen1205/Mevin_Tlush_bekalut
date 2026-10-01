import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Offline shell. Skipped in dev and wherever service workers are unavailable (e.g. embedded previews).
if (import.meta.env.PROD && "serviceWorker" in navigator && location.protocol.startsWith("http")) {
  addEventListener("load", () => navigator.serviceWorker.register("/sw.js").catch(() => undefined));
}
