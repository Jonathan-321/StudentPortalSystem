import { useState, useEffect } from 'react';
import offlineStorage from '@/lib/offlineStorage';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { processOfflineRequests } from '@/lib/queryClient';

/**
 * Custom hook to manage offline data synchronization
 * This hook handles syncing when the user comes back online
 */
export function useOfflineSync() {
  // Skip offline features in development mode
  const isDev = import.meta.env.DEV;
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Check for pending offline requests
  const checkPendingChanges = async () => {
    // Skip in development mode
    if (isDev) {
      return 0;
    }
    
    try {
      // Check if IndexedDB is available
      if (!window.indexedDB) {
        console.log('IndexedDB is not supported in this browser');
        return 0;
      }
      
      const requests = await offlineStorage.getOfflineRequests();
      setPendingChanges(requests ? requests.length : 0);
      return requests ? requests.length : 0;
    } catch (error) {
      console.error('Error checking pending changes:', error);
      return 0;
    }
  };

  // Synchronize offline changes when coming back online
  const syncOfflineChanges = async () => {
    // Skip in development mode
    if (isDev) {
      return;
    }
    
    if (!navigator.onLine || isSyncing) return;

    const count = await checkPendingChanges();
    if (count > 0) {
      setIsSyncing(true);
      
      // Show toast notification about syncing
      toast({
        title: t('Syncing offline changes'),
        description: t('Syncing {{count}} changes made while offline...', { count }),
        duration: 3000,
      });

      try {
        // Process all pending offline requests
        await processOfflineRequests();
        
        // Update pending changes count
        await checkPendingChanges();
        
        // Show success toast
        toast({
          title: t('Sync completed'),
          description: t('All your offline changes have been synchronized'),
          duration: 3000,
        });
      } catch (error) {
        console.error('Error syncing offline changes:', error);
        toast({
          title: t('Sync error'),
          description: t('Failed to sync some offline changes. Will retry automatically.'),
          variant: 'destructive',
          duration: 5000,
        });
      } finally {
        setIsSyncing(false);
      }
    }
  };

  // Handle online/offline status changes
  useEffect(() => {
    // Skip in development mode
    if (isDev) {
      return;
    }
    
    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineChanges();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };

    // Add event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check initial status
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
      checkPendingChanges();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Periodically check for pending changes while online
  useEffect(() => {
    // Skip in development mode
    if (isDev) {
      return;
    }
    
    if (isOnline && !isSyncing) {
      const interval = setInterval(() => {
        checkPendingChanges();
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [isOnline, isSyncing]);

  // Provide methods and state
  return {
    isOnline,
    isSyncing,
    pendingChanges,
    syncOfflineChanges,
    checkPendingChanges
  };
}

export default useOfflineSync;