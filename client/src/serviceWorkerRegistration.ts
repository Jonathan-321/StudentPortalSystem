// This optional code is used to register a service worker.
// register() is not called by default.

import { Workbox } from 'workbox-window';

// This lets the app know when the SW is ready or controlling the page
type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: Config) {
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
  const wb = new Workbox(swUrl);

  wb.addEventListener('installed', event => {
    // An update is available but waiting to be activated.
    if (event.isUpdate && config?.onUpdate) {
      config.onUpdate(wb.active as ServiceWorkerRegistration);
    }
    // First time installation.
    else if (config?.onSuccess) {
      config.onSuccess(wb.active as ServiceWorkerRegistration);
    }
  });

  wb.addEventListener('controlling', () => {
    window.location.reload();
  });

  // Set up the handler to prompt for update when a new service worker is installed
  wb.addEventListener('waiting', event => {
    if (confirm('New version available! Would you like to update?')) {
      wb.messageSkipWaiting();
    }
  });

  wb.register();
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}