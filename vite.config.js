import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/storage",
    ],
  },
  build: {
    // Optimize build for better performance
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Firebase chunks
          if (id.includes("firebase")) {
            if (id.includes("firebase/auth")) return "firebase-auth";
            if (id.includes("firebase/firestore")) return "firebase-firestore";
            if (id.includes("firebase/app")) return "firebase-core";
            return "firebase-other";
          }

          // React ecosystem
          if (id.includes("react") || id.includes("React")) {
            if (id.includes("react-router")) return "router";
            if (id.includes("react-hook-form")) return "forms";
            if (id.includes("react-icons")) return "icons";
            return "react-vendor";
          }

          // Large university data
          if (id.includes("Universities.js")) return "university-data";

          // Other vendor libraries
          if (id.includes("node_modules")) return "vendor";
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
