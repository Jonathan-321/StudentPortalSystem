import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    function updateOnlineStatus() {
      setIsOffline(!navigator.onLine);
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="mb-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded flex items-center animate-pulse">
      <i className="fas fa-wifi-slash mr-2"></i>
      <span>{t('You are currently in offline mode')}</span>
    </div>
  );
}
