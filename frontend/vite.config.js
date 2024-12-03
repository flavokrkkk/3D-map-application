import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"
import cesium from "vite-plugin-cesium"
export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  esbuild: {
    target: "esnext",
    platform: "node"
  },
  plugins: [react(), cesium()],
  resolve: {
    alias: {
      "@app": path.resolve(__dirname, "./src/app"),
      "@pages": path.resolve(__dirname, "./src/pages"),
      "@widgets": path.resolve(__dirname, "./src/widgets"),
      "@features": path.resolve(__dirname, "./src/features"),
      "@entities": path.resolve(__dirname, "./src/entities"),
      "@shared": path.resolve(__dirname, "./src/shared"),
      "@lib": path.resolve(__dirname, "./src/lib")
    }
  },

  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "[name]-[hash].js"
      }
    }
  }
})
