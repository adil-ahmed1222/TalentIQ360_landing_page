import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: { port: 8080, host: true },
  resolve: { tsconfigPaths: true },
  plugins: [
    tailwindcss(),
    ...tanstackStart({
      server: { entry: "server" },
    }),
    viteReact(),
    nitro({
      preset: "node-server",
      routeRules: {
        "/**": {
          headers: {
            "x-content-type-options": "nosniff",
            "referrer-policy": "strict-origin-when-cross-origin",
            "x-frame-options": "SAMEORIGIN",
            "permissions-policy": "camera=(), microphone=(), geolocation=()",
          },
        },
      },
    }),
  ],
});
