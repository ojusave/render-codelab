import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: path.resolve(import.meta.dirname, "src/client"),
  publicDir: path.resolve(import.meta.dirname, "public"),
  resolve: {
    alias: {
      "@client": path.resolve(import.meta.dirname, "src/client"),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      "/api": { target: "http://127.0.0.1:8787", changeOrigin: true },
      "/ws": { target: "ws://127.0.0.1:8787", ws: true },
    },
  },
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/client"),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("@tanstack/react-query")) return "query";
            if (id.includes("react-dom") || id.includes("react-router")) return "react-vendor";
          }
        },
      },
    },
  },
  define: {
    "import.meta.env.VITE_API_BASE": JSON.stringify(""),
  },
});
