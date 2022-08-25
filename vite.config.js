import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import VitePluginStyleInject from 'vite-plugin-style-inject';

export default defineConfig({
  plugins: [react(), VitePluginStyleInject()],
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    lib: {
      entry: "./src/index.jsx",
      name: "componentsName",
      formats: ["es"],
      fileName: () => `index.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "antd"],
      output: {
        globals: {
          react: "react",
          antd: "antd",
          "react-dom": "react-dom",
        },
      },
    },
  },
});
