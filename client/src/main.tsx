import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import { initServiceWorker, checkPWAInstallability } from "./lib/registerSW";

// Create the root element
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

// Render the application
root.render(<App />);

// Initialize the service worker for offline capabilities
// Temporarily disabled while we fix deployment issues
// if (import.meta.env.PROD) {
//   // Only register the service worker in production to avoid issues during development
//   initServiceWorker();
// } else {
//   console.log('Service Worker registration skipped in development mode');
// }

// Check and enable PWA installability
// window.addEventListener('load', () => {
//   checkPWAInstallability();
// });
