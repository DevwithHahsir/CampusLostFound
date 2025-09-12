import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./AuthContext/AuthContext";
import App from "./App.jsx";

// Load Bootstrap CSS asynchronously to prevent blocking
const loadBootstrapCSS = () => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
  link.crossOrigin = "anonymous";
  document.head.appendChild(link);
};

// Load Bootstrap JS asynchronously
const loadBootstrapJS = () => {
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
};

// Load Bootstrap assets after DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  loadBootstrapCSS();
  loadBootstrapJS();
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </AuthProvider>
  </StrictMode>
);
