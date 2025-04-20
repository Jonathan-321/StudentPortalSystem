import * as serviceWorkerRegistration from '../serviceWorkerRegistration';

/**
 * Initialize the service worker for the application
 */
export function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    // Register the service worker
    serviceWorkerRegistration.register({
      onSuccess: () => {
        console.log('Service Worker registered successfully!');
      },
      onUpdate: (registration) => {
        console.log('New content is available; please refresh.');
        
        // Show a simple alert for now - in production we'd use a nicer UI
        const updateAvailable = window.confirm(
          'A new version of the application is available. Click OK to update.'
        );
        
        if (updateAvailable && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      },
    });
  }
}

/**
 * Check if the app can be installed as a PWA
 */
export function checkPWAInstallability() {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Store the event so it can be triggered later
    (window as any).deferredPrompt = e;
    
    // Show your custom "Add to Home Screen" UI
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'block';
      
      installButton.addEventListener('click', async () => {
        // Show the install prompt
        const promptEvent = (window as any).deferredPrompt;
        if (!promptEvent) {
          return;
        }
        
        // Show the prompt
        promptEvent.prompt();
        
        try {
          // Wait for the user to respond to the prompt
          const choiceResult = await promptEvent.userChoice;
          console.log(`User response to install prompt: ${choiceResult.outcome}`);
          
          // Clear the saved prompt since it can't be used again
          (window as any).deferredPrompt = null;
          
          // Hide the button
          installButton.style.display = 'none';
        } catch (error) {
          console.error('Error during PWA installation:', error);
        }
      });
    }
  });
  
  // Listen for the appinstalled event
  window.addEventListener('appinstalled', () => {
    console.log('PWA was installed');
    // Hide the install button if it exists
    const installButton = document.getElementById('pwa-install-button');
    if (installButton) {
      installButton.style.display = 'none';
    }
    // Remove the stored prompt
    (window as any).deferredPrompt = null;
  });
}