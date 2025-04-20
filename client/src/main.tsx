import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/i18n";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

// Create the root element
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);

// Render the application
root.render(
  <>
    <App />
    <Toaster />
  </>
);

// Register the service worker for offline capabilities
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('Service Worker registered successfully!');
  },
  onUpdate: (registration) => {
    console.log('New content is available; please refresh.');
    // You can add a toast notification here if you want
    const ServiceWorkerToast = () => {
      const { toast } = useToast();
      
      toast({
        title: "New Version Available",
        description: "A new version of the application is available. Click to update.",
        action: (
          <button 
            onClick={() => {
              // Send a message to the service worker to skip waiting
              if (registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
              }
            }}
            className="bg-primary text-white px-3 py-1 rounded-md hover:bg-primary/90 transition-colors"
          >
            Update
          </button>
        ),
        duration: 10000, // 10 seconds
      });
      
      return null;
    };
    
    // Create a temporary element to render the toast
    const tempElement = document.createElement('div');
    document.body.appendChild(tempElement);
    
    createRoot(tempElement).render(<ServiceWorkerToast />);
  },
});
