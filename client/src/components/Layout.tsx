import { ReactNode, useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, WifiOff, Wifi } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import OfflineIndicator from "./OfflineIndicator";
import useOfflineSync from "@/hooks/use-offline-sync";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { isOnline, pendingChanges, isSyncing } = useOfflineSync();
  const { t } = useTranslation();

  // Set the favicon based on online/offline status
  useEffect(() => {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = isOnline ? '/favicon.svg' : '/favicon-offline.svg';
    }
  }, [isOnline]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-body">
      {/* Mobile Header */}
      <Navbar 
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        notificationsOpen={notificationsOpen}
        setNotificationsOpen={setNotificationsOpen}
        title={title}
      />

      {/* Sidebar */}
      <Sidebar 
        isOpen={mobileMenuOpen} 
        setIsOpen={setMobileMenuOpen} 
      />

      {/* Main Content */}
      <main className="w-full lg:ml-64 flex-1">
        {/* Desktop Header (visible only on desktop) */}
        <header className="hidden lg:flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold font-heading text-gray-800">{t(title)}</h1>
          <div className="flex items-center space-x-6">
            {/* Connection Status Indicator */}
            <div className="flex items-center">
              {isOnline ? (
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 border-green-200">
                  <Wifi className="h-3.5 w-3.5" />
                  <span className="text-xs">{t('Online')}</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                  <WifiOff className="h-3.5 w-3.5" />
                  <span className="text-xs">{t('Offline')}</span>
                </Badge>
              )}
              {pendingChanges > 0 && isOnline && (
                <Badge variant="outline" className="ml-2 flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-700 border-blue-200">
                  <span className="text-xs">
                    {isSyncing 
                      ? t('Syncing...') 
                      : t('{{count}} pending', { count: pendingChanges })}
                  </span>
                </Badge>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(true)}
                className="text-gray-600 hover:text-primary"
              >
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-primary-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
            </div>

            {/* User Menu */}
            <div className="relative group">
              <button className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-semibold">
                  {(user.firstName || user.first_name || 'U')[0]}{(user.lastName || user.last_name || 'U')[0]}
                </div>
                <span className="font-semibold">{user.firstName || user.first_name || 'User'} {user.lastName || user.last_name || ''}</span>
                <i className="fas fa-chevron-down text-xs text-gray-500"></i>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('Profile')}</a>
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('Account Settings')}</a>
                <button 
                  onClick={() => {
                    document.location.href = "/auth";
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  {t('Logout')}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
          {/* We still use the full OfflineIndicator for better mobile visibility */}
          <OfflineIndicator />
          {children}
        </div>
      </main>

      {/* Notifications Panel */}
      <NotificationPanel 
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
      />
    </div>
  );
}
