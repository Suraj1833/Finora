import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

/**
 * Compute __dirname for ESM modules (package.json has "type": "module")
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Export an async factory so we can safely await dynamic imports
 * without relying on top-level await (avoids TS/compiler errors).
 */
export default defineConfig(async () => {
  // default: no cartographer plugin
  let cartographerPlugin: any[] = [];

  // only load cartographer in dev on Replit
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    try {
      const m = await import("@replit/vite-plugin-cartographer");
      if (m && typeof m.cartographer === "function") {
        cartographerPlugin = [m.cartographer()];
      }
    } catch (err) {
      console.warn("Could not load @replit/vite-plugin-cartographer:", err);
    }
  }

  return {
    plugins: [
      react(),
      runtimeErrorOverlay(),
      ...cartographerPlugin,
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
