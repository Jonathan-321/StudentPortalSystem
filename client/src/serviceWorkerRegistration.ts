// This optional code is used to register a service worker.
// register() is not called by default.

import { Workbox } from 'workbox-window';

// This lets the app know when the SW is ready or controlling the page
type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
  // Skip service worker registration in development mode
  if (import.meta.env.DEV) {
    console.log('Service Worker registration skipped in development mode');
    return;
  }
  
  if ('serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(window.location.href);

    // For production builds, check if the service worker can be found.
    window.addEventListener('load', () => {
      const swUrl = `/sw.js`;

      registerValidSW(swUrl, config);
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  try {
    const wb = new Workbox(swUrl);

    // Set up notification for success
    if (config?.onSuccess) {
      wb.addEventListener('activated', (event) => {
        if (!event.isUpdate) {
          navigator.serviceWorker.ready.then(config.onSuccess);
        }
      });
    }

    // Set up notification for updates
    if (config?.onUpdate) {
      wb.addEventListener('waiting', () => {
        console.log('A new service worker has installed, but is waiting to activate.');
        navigator.serviceWorker.ready.then(registration => {
          if (config && typeof config.onUpdate === 'function') {
            config.onUpdate(registration);
          }
        });
      });
    }

    // When service worker takes control, reload the page for a clean state
    wb.addEventListener('controlling', () => {
      window.location.reload();
    });

    // User confirmation for updates
    wb.addEventListener('waiting', () => {
      if (confirm('New version available! Would you like to update?')) {
        wb.messageSkipWaiting();
      }
    });

    // Register the service worker
    wb.register().catch(error => {
      console.error('Service worker registration failed:', error);
    });
  } catch (error) {
    console.error('Service worker registration failed:', error);
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error('Service worker unregistration failed:', error);
      });
  }
}