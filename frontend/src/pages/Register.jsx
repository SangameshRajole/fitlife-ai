// =============================================
// pages/Register.jsx — Register Page with Dark Mode
// =============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff, User, Activity, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

// ── Small Theme Toggle Button ──
const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
    >
      {theme === 'dark'
        ? <Sun  size={18} className="text-yellow-400" />
        : <Moon size={18} />
      }
    </button>
  );
};

const Register = () => {
  const navigate      = useNavigate();
  const { register }  = useAuth();

  const [formData, setFormData] = useState({
    name:            '',
    email:           '',
    password:        '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading,    setIsLoading]    = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Account created! Welcome to FitLife AI 🎉');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* ── Left Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-500 to-primary-700 flex-col items-center justify-center p-12 relative overflow-hidden"
      >
        <div className="absolute top-[-80px] left-[-80px] w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute bottom-[-60px] right-[-60px] w-80 h-80 bg-white/10 rounded-full" />

        <div className="relative z-10 text-center text-white">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-white/20 p-4 rounded-2xl">
              <Activity size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Join FitLife AI</h1>
          <p className="text-xl text-primary-100 mb-8">
            Start your health journey today
          </p>
          <div className="space-y-4 text-left">
            {[
              '✅ Free forever — no credit card needed',
              '✅ AI-powered health suggestions',
              '✅ Track BMI, water, calories & workouts',
              '✅ Beautiful charts and analytics',
            ].map((item, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-primary-100 font-medium"
              >
                {item}
              </motion.p>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Right Panel ── */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300"
      >
        <div className="w-full max-w-md">

          {/* Top bar — logo + theme toggle */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 lg:hidden">
              <Activity size={28} className="text-primary-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                FitLife AI
              </span>
            </div>
            <div className="hidden lg:block" />
            <ThemeToggleButton />
          </div>

          {/* Title */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create account 🚀
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Join thousands tracking their health with AI
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className="input-field pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-500 font-semibold hover:text-primary-600"
            >
              Login here
            </Link>
          </p>

        </div>
      </motion.div>
    </div>
  );
};

export default Register;