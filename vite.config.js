import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize build for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          firebase: ["firebase/app", "firebase/auth", "firebase/firestore"],
          forms: ["react-hook-form"],
          icons: ["react-icons"],
        },
      },
    },
    // Enable source maps for better debugging in production
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 600,
  },
  server: {
    // Optimize dev server
    hmr: {
      overlay: false,
    },
  },
});
