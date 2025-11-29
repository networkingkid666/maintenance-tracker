import { useState, useEffect } from 'react';

const SIDEBAR_STORAGE_KEY = 'mrt_sidebar_open';

export const useSidebar = () => {
  const [isOpen, setIsOpen] = useState(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return stored ? JSON.parse(stored) : true; // Default to open
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(isOpen));
  }, [isOpen]);

  const toggle = () => setIsOpen(!isOpen);

  return { isOpen, toggle };
};

