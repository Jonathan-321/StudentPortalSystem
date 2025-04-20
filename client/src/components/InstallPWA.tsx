import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstallPWA() {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if it's iOS device
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // Handle beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 76+ from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    // Add the event listener
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);

    // Check if the app is already installed (PWA mode)
    const isInStandaloneMode = () => {
      return (window.matchMedia('(display-mode: standalone)').matches) || 
             ((window as any).navigator.standalone) || 
             document.referrer.includes('android-app://');
    };

    // Hide the install button if the app is already installed
    if (isInStandaloneMode()) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;
    
    // Show the prompt
    installPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await installPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Clear the saved prompt since it can't be used again
    setInstallPrompt(null);
    setIsInstallable(false);
  };

  // Don't show anything if not installable
  if (!isInstallable && !isIOS) return null;

  // For iOS devices which don't support beforeinstallprompt event
  if (isIOS) {
    return (
      <div className="fixed bottom-16 inset-x-0 p-4 z-40 flex justify-center">
        <div className="bg-white rounded-lg shadow-lg p-4 max-w-md w-full border border-primary/20">
          <h3 className="font-semibold text-lg mb-2 flex items-center">
            <Download className="mr-2 h-5 w-5 text-primary" />
            {t('Install University of Rwanda Portal')}
          </h3>
          <p className="text-sm mb-4">
            {t('To install this app on your iPhone/iPad:')}
          </p>
          <ol className="list-decimal pl-5 text-sm space-y-2 mb-4">
            <li>{t('Tap the Share button')}</li>
            <li>{t('Scroll down and tap "Add to Home Screen"')}</li>
            <li>{t('Tap "Add" in the upper right corner')}</li>
          </ol>
        </div>
      </div>
    );
  }

  // For other devices that support the beforeinstallprompt event
  return (
    <div className="fixed bottom-16 right-4 z-40">
      <Button 
        onClick={handleInstallClick}
        className="flex items-center space-x-2 shadow-lg"
        size="lg"
      >
        <Download className="h-5 w-5" />
        <span>{t('Install App')}</span>
      </Button>
    </div>
  );
}