import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../../services/authService';
import { useSidebar } from '../../hooks/useSidebar';
import {
  DashboardIcon,
  IssuesIcon,
  ReportsIcon,
  ProfileIcon,
  SettingsIcon,
  LogoutIcon,
} from '../Icons';

const getMenuItems = (userRole: string) => {
  const items = [
    { path: '/dashboard', label: 'Dashboard', Icon: DashboardIcon },
    { path: '/issues', label: 'Issues', Icon: IssuesIcon },
    { path: '/profile', label: 'Profile', Icon: ProfileIcon },
  ];

  // Hide Reports for Technician
  if (userRole !== 'technician') {
    items.splice(2, 0, { path: '/reports', label: 'Reports', Icon: ReportsIcon });
  }

  return items;
};

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  const menuItems = getMenuItems(user?.role || 'technician');
  const { isOpen, toggle } = useSidebar();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <>
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? '256px' : '80px' }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-full bg-white shadow-xl z-40 flex flex-col"
      >
        {/* Header with Toggle */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {isOpen && <h2 className="text-xl font-bold text-mid-blue">M&R Tracker</h2>}
          <motion.button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </motion.button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.Icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-mid-blue to-mid-blue-dark text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                title={!isOpen ? item.label : ''}
                onClick={(e) => {
                  // Only close on mobile
                  if (window.innerWidth < 1024) {
                    toggle();
                  }
                }}
              >
                <IconComponent size={20} className="flex-shrink-0" />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 space-y-2">
          <Link
            to="/settings"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition-all ${
              location.pathname === '/settings' ? 'bg-gray-100' : ''
            }`}
            title={!isOpen ? 'Settings' : ''}
            onClick={(e) => {
              // Only close on mobile
              if (window.innerWidth < 1024) {
                toggle();
              }
            }}
          >
            <SettingsIcon size={20} className="flex-shrink-0" />
            {isOpen && <span className="font-medium">Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
            title={!isOpen ? 'Logout' : ''}
          >
            <LogoutIcon size={20} className="flex-shrink-0" />
            {isOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={toggle}
        />
      )}
    </>
  );
}
