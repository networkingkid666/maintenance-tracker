import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { authService } from '../../services/authService';
import { useSidebar } from '../../hooks/useSidebar';
import { useWindowSize } from '../../hooks/useWindowSize';
import ProfileDropdown from './ProfileDropdown';

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchValue?: string;
}

export default function Header({ onSearch, searchValue = '' }: HeaderProps) {
  const { isOpen } = useSidebar();
  const { width } = useWindowSize();
  const isDesktop = width >= 1024;
  const [searchQuery, setSearchQuery] = useState(searchValue);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const user = authService.getCurrentUser();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <motion.header
      animate={{
        left: isDesktop ? (isOpen ? '256px' : '80px') : '0px'
      }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-md h-16 flex items-center justify-between px-6 fixed top-0 right-0 z-30"
    >
      {/* Search Bar - Center */}
      <div className="flex-1 max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mid-blue focus:border-transparent outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Profile Photo - Top Right */}
      <div className="relative ml-4">
        <button
          onClick={() => setShowProfileDropdown(!showProfileDropdown)}
          className="flex items-center space-x-2 focus:outline-none"
        >
          <div className="w-10 h-10 bg-mid-blue rounded-full flex items-center justify-center text-white font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </button>

        <AnimatePresence>
          {showProfileDropdown && (
            <ProfileDropdown
              onClose={() => setShowProfileDropdown(false)}
            />
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}

