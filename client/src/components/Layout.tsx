import { ReactNode, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import NotificationPanel from "./NotificationPanel";
import OfflineIndicator from "./OfflineIndicator";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { t } = useTranslation();

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
          <h1 className="text-2xl font-bold font-heading text-primary">{t(title)}</h1>
          <div className="flex items-center space-x-6">
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(true)}
                className="text-gray-600 hover:text-primary"
              >
                <i className="fas fa-bell text-xl"></i>
                <span className="absolute -top-1 -right-1 bg-secondary-500 text-primary-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-semibold">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <span className="font-semibold">{user.firstName} {user.lastName}</span>
                <i className="fas fa-chevron-down text-xs text-gray-500"></i>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('Profile')}</a>
                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">{t('Account Settings')}</a>
                <button 
                  onClick={() => user && user.logoutMutation.mutate()}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  {t('Logout')}
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-6">
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
