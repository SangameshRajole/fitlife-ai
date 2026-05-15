// =============================================
// components/Navbar.jsx — with Dark Mode Toggle
// =============================================

import { Menu, Bell, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ onMenuClick, title }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">

      {/* Left — Menu + Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
        >
          <Menu size={22} />
        </button>

        <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
          {title}
        </h2>
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">

        {/* Notification Bell */}
        <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 relative transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-500 rounded-full" />
        </button>

        {/* Dark / Light Mode Toggle */}
        <motion.button
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors overflow-hidden"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate: 90,  opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Sun size={20} className="text-yellow-400" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90,  opacity: 0 }}
                animate={{ rotate: 0,   opacity: 1 }}
                exit={{   rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Moon size={20} className="text-gray-600" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

      </div>
    </header>
  );
};

export default Navbar;