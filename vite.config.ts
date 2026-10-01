import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/** Fills Open Graph / Twitter tags (LinkedIn link preview). Absolute URLs are needed for the image. */
function socialTags(): Plugin {
  const host = process.env.VITE_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "");
  return {
    name: "social-tags",
    transformIndexHtml: () => [
      { tag: "meta", attrs: { property: "og:type", content: "website" }, injectTo: "head" },
      { tag: "meta", attrs: { property: "og:title", content: "Wavely – music from around the world" }, injectTo: "head" },
      { tag: "meta", attrs: { property: "og:description", content: "Play music from every country, build playlists and share them in a social feed. Hebrew + English, installable PWA." }, injectTo: "head" },
      { tag: "meta", attrs: { property: "og:image", content: `${host}/og.png` }, injectTo: "head" },
      { tag: "meta", attrs: { property: "og:image:width", content: "1200" }, injectTo: "head" },
      { tag: "meta", attrs: { property: "og:image:height", content: "630" }, injectTo: "head" },
      ...(host ? [{ tag: "meta", attrs: { property: "og:url", content: host }, injectTo: "head" as const }] : []),
      { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" }, injectTo: "head" },
    ],
  };
}

export default defineConfig({ plugins: [react(), socialTags()] });
