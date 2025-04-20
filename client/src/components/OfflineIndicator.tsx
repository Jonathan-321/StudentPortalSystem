import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { WifiOff, Database, AlertTriangle } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showFirstTimeDialog, setShowFirstTimeDialog] = useState(false);
  const [syncCount, setSyncCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    // Check if this is the first time we're showing the offline dialog
    const hasSeenOfflineMessage = localStorage.getItem('hasSeenOfflineMessage');
    
    function updateOnlineStatus() {
      const currentOfflineStatus = !navigator.onLine;
      setIsOffline(currentOfflineStatus);
      
      // If we're going offline and the user hasn't seen the message before
      if (currentOfflineStatus && !hasSeenOfflineMessage) {
        setShowFirstTimeDialog(true);
        localStorage.setItem('hasSeenOfflineMessage', 'true');
      }
      
      // If we're coming back online, check for pending sync operations
      if (!currentOfflineStatus && syncCount === 0) {
        checkPendingSyncOperations();
      }
    }

    async function checkPendingSyncOperations() {
      try {
        // Use IndexedDB to check for pending sync operations
        const db = await window.indexedDB.open('university-portal', 1);
        db.onsuccess = (event) => {
          const database = (event.target as IDBOpenDBRequest).result;
          const transaction = database.transaction(['offlineRequests'], 'readonly');
          const objectStore = transaction.objectStore('offlineRequests');
          const countRequest = objectStore.count();
          
          countRequest.onsuccess = () => {
            setSyncCount(countRequest.result);
            database.close();
          };
        };
      } catch (err) {
        console.error('Error checking for pending sync operations:', err);
      }
    }

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    
    // Initial check
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, [syncCount]);

  // Reset the sync count after displaying it
  useEffect(() => {
    if (syncCount > 0 && !isOffline) {
      const timer = setTimeout(() => {
        setSyncCount(0);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [syncCount, isOffline]);

  if (!isOffline && syncCount === 0) return null;

  return (
    <>
      {isOffline ? (
        // Offline indicator
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-100 border-t border-yellow-500 text-yellow-800 p-2 z-50 flex items-center justify-center shadow-md animate-pulse">
          <WifiOff className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{t('You are currently offline. Some features may be limited.')}</span>
        </div>
      ) : syncCount > 0 ? (
        // Syncing indicator (when back online)
        <div className="fixed bottom-0 left-0 right-0 bg-blue-100 border-t border-blue-500 text-blue-800 p-2 z-50 flex items-center justify-center shadow-md">
          <Database className="h-4 w-4 mr-2 animate-pulse" />
          <span className="text-sm font-medium">
            {t('Syncing {{count}} changes made while offline...', { count: syncCount })}
          </span>
        </div>
      ) : null}

      {/* First time offline educational dialog */}
      <AlertDialog open={showFirstTimeDialog} onOpenChange={setShowFirstTimeDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <WifiOff className="mr-2 h-5 w-5 text-yellow-500" />
              {t('Offline Mode Activated')}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>{t('You are currently offline. Don\'t worry, University of Rwanda Portal supports offline mode!')}</p>
              
              <h3 className="text-sm font-medium mt-2">{t('What you can do while offline:')}</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>{t('View previously loaded courses and academic information')}</li>
                <li>{t('Check your cached timetable')}</li>
                <li>{t('Read downloaded resources')}</li>
                <li>{t('Create drafts of assignments and messages')}</li>
              </ul>
              
              <h3 className="text-sm font-medium mt-2">{t('What happens when you reconnect:')}</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>{t('All drafts and changes will sync automatically')}</li>
                <li>{t('You\'ll get notifications about any important updates')}</li>
              </ul>
              
              <div className="flex items-center mt-3 p-2 bg-yellow-50 rounded-md border border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-2" />
                <p className="text-xs text-yellow-800">
                  {t('For the best experience, try to connect to Wi-Fi or mobile data when possible.')}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>
              {t('Got it')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
