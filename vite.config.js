import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    // when testing locally with `vercel dev` (see README-DEPLOY.md),
    // that runs on :3000 and serves both the api/ functions and this app.
    // When just using `npm run dev` for UI-only work, /api calls will 404 —
    // that's expected, test the full thing with `vercel dev` instead.
  },
  build: { outDir: "dist" },
});
