// =============================================
// pages/Dashboard.jsx — Main Dashboard
// =============================================

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Scale,
  Droplets,
  Flame,
  Dumbbell,
  TrendingUp,
  TrendingDown,
  Brain,
  ChevronRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

// ── Animation variants ──
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0 },
};

// ── Stat Card Component ──
const StatCard = ({ icon: Icon, label, value, unit, color, trend, to }) => (
  <motion.div variants={fadeUp}>
    <Link to={to} className="block">
      <div className="card hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={22} className="text-white" />
          </div>
          <ChevronRight
            size={18}
            className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-colors"
          />
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </p>
        <div className="flex items-end gap-1">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </span>
          <span className="text-sm text-gray-400 mb-0.5">{unit}</span>
        </div>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend > 0 ? (
              <TrendingUp size={14} className="text-green-500" />
            ) : (
              <TrendingDown size={14} className="text-red-500" />
            )}
            <span className={`text-xs font-medium ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(trend)}% from yesterday
            </span>
          </div>
        )}
      </div>
    </Link>
  </motion.div>
);

// ── Quick Action Component ──
const QuickAction = ({ icon: Icon, label, desc, color, to }) => (
  <Link to={to}>
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-gray-300" />
    </motion.div>
  </Link>
);

// ── Main Dashboard ──
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Get current time for greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' :
    hour < 17 ? 'Good Afternoon' :
                'Good Evening';

  // Stat cards data
  const stats = [
    {
      icon: Scale,
      label: 'BMI Score',
      value: '--',
      unit: 'kg/m²',
      color: 'bg-blue-500',
      trend: null,
      to: '/bmi',
    },
    {
      icon: Droplets,
      label: 'Water Intake',
      value: '--',
      unit: 'L today',
      color: 'bg-cyan-500',
      trend: null,
      to: '/water',
    },
    {
      icon: Flame,
      label: 'Calories',
      value: '--',
      unit: 'kcal',
      color: 'bg-orange-500',
      trend: null,
      to: '/calories',
    },
    {
      icon: Dumbbell,
      label: 'Workouts',
      value: '--',
      unit: 'this week',
      color: 'bg-purple-500',
      trend: null,
      to: '/workout',
    },
  ];

  // Quick actions
  const quickActions = [
    {
      icon: Scale,
      label: 'Calculate BMI',
      desc: 'Check your body mass index',
      color: 'bg-blue-500',
      to: '/bmi',
    },
    {
      icon: Droplets,
      label: 'Log Water',
      desc: 'Track your daily water intake',
      color: 'bg-cyan-500',
      to: '/water',
    },
    {
      icon: Flame,
      label: 'Add Meal',
      desc: 'Log calories for today',
      color: 'bg-orange-500',
      to: '/calories',
    },
    {
      icon: Dumbbell,
      label: 'Log Workout',
      desc: 'Record your exercise session',
      color: 'bg-purple-500',
      to: '/workout',
    },
    {
      icon: Brain,
      label: 'AI Suggestions',
      desc: 'Get personalized health tips',
      color: 'bg-pink-500',
      to: '/ai',
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Navbar */}
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          title="Dashboard"
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
            className="max-w-5xl mx-auto space-y-6"
          >

            {/* ── Greeting Banner ── */}
            <motion.div
              variants={fadeUp}
              className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-100 text-sm font-medium mb-1">
                    {greeting} 👋
                  </p>
                  <h2 className="text-2xl font-bold">
                    {user?.name?.split(' ')[0] || 'User'}!
                  </h2>
                  <p className="text-primary-100 text-sm mt-1">
                    Track your health and stay fit today 💪
                  </p>
                </div>
                <div className="hidden sm:block text-6xl">🏃</div>
              </div>

              {/* Progress bar — placeholder */}
              <div className="mt-4">
                <div className="flex justify-between text-xs text-primary-100 mb-1">
                  <span>Daily Goal Progress</span>
                  <span>0%</span>
                </div>
                <div className="bg-white/20 rounded-full h-2">
                  <div
                    className="bg-white rounded-full h-2 transition-all duration-500"
                    style={{ width: '0%' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* ── Stats Grid ── */}
            <div>
              <motion.h3
                variants={fadeUp}
                className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Today's Summary
              </motion.h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>
            </div>

            {/* ── Quick Actions ── */}
            <div>
              <motion.h3
                variants={fadeUp}
                className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-3"
              >
                Quick Actions
              </motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <QuickAction key={action.label} {...action} />
                ))}
              </div>
            </div>

            {/* ── Tip Banner ── */}
            <motion.div
              variants={fadeUp}
              className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-5 text-white"
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🤖</span>
                <div>
                  <p className="font-semibold">AI Health Tip of the Day</p>
                  <p className="text-purple-100 text-sm mt-0.5">
                    Start logging your meals and workouts to get personalized AI health suggestions!
                  </p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;