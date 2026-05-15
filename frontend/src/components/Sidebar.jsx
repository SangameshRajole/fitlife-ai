// =============================================
// components/Sidebar.jsx
// =============================================

import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Scale,
  Droplets,
  Flame,
  Dumbbell,
  Brain,
  LogOut,
  Activity,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Navigation menu items
const navItems = [
  { path: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard'    },
  { path: '/bmi',        icon: Scale,            label: 'BMI Tracker'  },
  { path: '/water',      icon: Droplets,         label: 'Water Intake' },
  { path: '/calories',   icon: Flame,            label: 'Calories'     },
  { path: '/workout',    icon: Dumbbell,         label: 'Workout'      },
  { path: '/ai',         icon: Brain,            label: 'AI Suggestions'},
];

const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-30 flex flex-col lg:translate-x-0 lg:static lg:z-auto"
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="bg-primary-500 p-2 rounded-xl">
              <Activity size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-lg leading-none">
                FitLife AI
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">Health Tracker</p>
            </div>
          </div>
          {/* Close button (mobile) */}
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
            <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full transition-all duration-200"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;