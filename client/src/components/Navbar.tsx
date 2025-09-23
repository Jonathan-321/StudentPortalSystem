import { useAuth } from "@/hooks/use-auth-supabase";
import LanguageSelector from "./LanguageSelector";

interface NavbarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  title: string;
}

export default function Navbar({ 
  mobileMenuOpen, 
  setMobileMenuOpen,
  notificationsOpen,
  setNotificationsOpen,
  title
}: NavbarProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <header className="bg-primary-500 text-white sticky top-0 z-50 shadow-md lg:hidden">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            id="mobile-menu-button" 
            className="mr-2 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div className="flex items-center">
            {/* Logo */}
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mr-2">
              <svg className="h-8 w-8 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-lg font-bold font-heading text-white">UR Student Portal</h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(true)}
            >
              <i className="fas fa-bell text-xl"></i>
              <span className="absolute -top-1 -right-1 bg-secondary-500 text-primary-900 text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
            </button>
          </div>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center text-sm font-semibold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </div>
        </div>
      </div>

      {/* Page Title Display */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      
      {/* Mobile Language Selector */}
      <LanguageSelector mobile />
    </header>
  );
}
