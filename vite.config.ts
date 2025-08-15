import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 本地开发代理，避免CORS问题
      "/ext-timeline": {
        target: "https://web-production-136f4.up.railway.app",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/ext-timeline/, ""),
      },
    },
  },
});
