import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./AuthContext/AuthContext";
// import { Analytics } from "@vercel/analytics/next"
import App from "./App.jsx";

// Optimized Bootstrap loading with better performance
const loadBootstrapAssets = () => {
  // Only load Bootstrap CSS if not already loaded
  if (!document.querySelector('link[href*="bootstrap"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
    link.crossOrigin = "anonymous";
    link.media = "print";
    link.onload = function () {
      this.media = "all";
    };
    document.head.appendChild(link);
  }

  // Load Bootstrap JS with intersection observer for better performance
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
};

// Load Bootstrap assets efficiently
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadBootstrapAssets);
} else {
  // DOM already ready
  loadBootstrapAssets();
}

// Remove loading fallback and render app
const rootElement = document.getElementById("root");
if (rootElement.firstChild) {
  rootElement.removeChild(rootElement.firstChild);
}

createRoot(rootElement).render(
  <StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </AuthProvider>
  </StrictMode>
);
