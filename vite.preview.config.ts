import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

// Single-file build used for sharing a live preview: `npm run build:preview`
export default defineConfig({ plugins: [react(), viteSingleFile()], build: { outDir: "dist-preview" } });
