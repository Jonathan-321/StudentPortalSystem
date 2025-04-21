import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import LanguageSelector from "./LanguageSelector";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

interface NavItemProps {
  href: string;
  icon: string;
  children: React.ReactNode;
  badge?: number;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const NavItem = ({ href, icon, children, badge, isActive = false, onClick, className = "" }: NavItemProps) => {
  const baseClassName = "flex items-center px-4 py-3 hover:bg-gray-100";
  const activeClassName = "text-primary-500 border-l-4 border-primary-500 bg-blue-50";
  
  return (
    <Link href={href}>
      <a 
        className={`${baseClassName} ${isActive ? activeClassName : ""} ${className}`}
        onClick={onClick}
      >
        <i className={`${icon} w-6`}></i>
        <span>{children}</span>
        {badge !== undefined && (
          <span className="ml-auto bg-secondary-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">{badge}</span>
        )}
      </a>
    </Link>
  );
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user, logoutMutation } = useAuth();
  const { t } = useTranslation();
  const [location] = useLocation();
  
  if (!user) return null;

  return (
    <>
      {/* Mobile Navigation Menu */}
      <div 
        className={`fixed inset-0 bg-gray-800 bg-opacity-75 z-40 lg:hidden ${isOpen ? "" : "hidden"}`}
      >
        <div className="bg-white h-full w-4/5 max-w-xs pt-16 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-200">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mr-3">
                <svg className="h-12 w-12 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h2 className="font-heading font-bold text-primary-500">{t('University of Rwanda')}</h2>
                <p className="text-sm text-gray-600">{t('Student Portal')}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="h-12 w-12 rounded-full bg-primary-700 text-white flex items-center justify-center font-semibold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
              <div>
                <p className="font-semibold">{user.firstName} {user.lastName}</p>
                <p className="text-sm text-gray-500">{user.studentId || user.id}</p>
              </div>
            </div>
          </div>
          <nav>
            <ul className="py-2">
              <li>
                <NavItem 
                  href="/"
                  icon="fas fa-home"
                  isActive={location === "/"}
                >
                  {t('Dashboard')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/academics"
                  icon="fas fa-book"
                  isActive={location === "/academics"}
                >
                  {t('Academics')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/course-registration"
                  icon="fas fa-clipboard-list"
                  isActive={location === "/course-registration"}
                >
                  {t('Course Registration')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/results"
                  icon="fas fa-chart-bar"
                  isActive={location === "/results"}
                >
                  {t('Results & Transcripts')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/finance"
                  icon="fas fa-money-bill-wave"
                  isActive={location === "/finance"}
                >
                  {t('Finance')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/timetable"
                  icon="fas fa-calendar-alt"
                  isActive={location === "/timetable"}
                >
                  {t('Timetable')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/resources"
                  icon="fas fa-folder-open"
                  isActive={location === "/resources"}
                >
                  {t('Resources')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/messages"
                  icon="fas fa-envelope"
                  isActive={location === "/messages"}
                  badge={2}
                >
                  {t('Messages')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/lifecycle"
                  icon="fas fa-graduation-cap"
                  isActive={location === "/lifecycle"}
                >
                  {t('Student Lifecycle')}
                </NavItem>
              </li>
              <li className="border-t border-gray-200 mt-4 pt-4">
                <NavItem 
                  href="/settings"
                  icon="fas fa-cog"
                  isActive={location === "/settings"}
                >
                  {t('Settings')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/help"
                  icon="fas fa-question-circle"
                  isActive={location === "/help"}
                >
                  {t('Help & Support')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="#"
                  icon="fas fa-sign-out-alt"
                  className="text-red-600"
                  onClick={() => logoutMutation.mutate()}
                >
                  {t('Logout')}
                </NavItem>
              </li>
            </ul>
          </nav>
        </div>
        <button 
          className="absolute top-4 left-4 text-white text-2xl"
          onClick={() => setIsOpen(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 fixed h-screen bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center mb-6">
            <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center mr-3">
              <svg className="h-12 w-12 text-primary-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h2 className="font-heading font-bold text-primary-500">{t('University of Rwanda')}</h2>
              <p className="text-sm text-gray-600">{t('Student Portal')}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-semibold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <p className="font-semibold">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-gray-500">{user.studentId || user.id}</p>
            </div>
          </div>
        </div>
        
        <nav className="mt-2">
          <ul className="py-2">
            <li>
              <NavItem 
                href="/"
                icon="fas fa-home"
                isActive={location === "/"}
              >
                {t('Dashboard')}
              </NavItem>
            </li>
            <li>
              <NavItem 
                href="/academics"
                icon="fas fa-book"
                isActive={location === "/academics"}
              >
                {t('Academics')}
              </NavItem>
            </li>
            <li>
              <NavItem 
                href="/course-registration"
                icon="fas fa-clipboard-list"
                isActive={location === "/course-registration"}
              >
                {t('Course Registration')}
              </NavItem>
            </li>
            <li>
              <NavItem 
                href="/results"
                icon="fas fa-chart-bar"
                isActive={location === "/results"}
              >
                {t('Results & Transcripts')}
              </NavItem>
            </li>
            <li>
              <NavItem 
                href="/finance"
                icon="fas fa-money-bill-wave"
                isActive={location === "/finance"}
              >
                {t('Finance')}
              </NavItem>
            </li>
            <li>
              <NavItem 
                href="/timetable"
                icon="fas fa-calendar-alt"
                isActive={location === "/timetable"}
              >
                {t('Timetable')}
              </NavItem>
            </li>
            <li>
              <NavItem 
                href="/resources"
                icon="fas fa-folder-open"
                isActive={location === "/resources"}
              >
                {t('Resources')}
              </NavItem>
            </li>
            <li>
              <NavItem 
                href="/messages"
                icon="fas fa-envelope"
                isActive={location === "/messages"}
                badge={2}
              >
                {t('Messages')}
              </NavItem>
            </li>
            <li>
              <NavItem 
                href="/lifecycle"
                icon="fas fa-graduation-cap"
                isActive={location === "/lifecycle"}
              >
                {t('Student Lifecycle')}
              </NavItem>
            </li>
          </ul>
          
          <div className="border-t border-gray-200 mt-4 pt-2">
            <ul>
              <li>
                <NavItem 
                  href="/settings"
                  icon="fas fa-cog"
                  isActive={location === "/settings"}
                >
                  {t('Settings')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="/help"
                  icon="fas fa-question-circle"
                  isActive={location === "/help"}
                >
                  {t('Help & Support')}
                </NavItem>
              </li>
              <li>
                <NavItem 
                  href="#"
                  icon="fas fa-sign-out-alt"
                  className="text-red-600"
                  onClick={() => logoutMutation.mutate()}
                >
                  {t('Logout')}
                </NavItem>
              </li>
            </ul>
          </div>
        </nav>
        
        {/* Desktop Language Selector */}
        <LanguageSelector />
      </aside>
    </>
  );
}
