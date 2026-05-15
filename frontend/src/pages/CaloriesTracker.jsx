// =============================================
// pages/CaloriesTracker.jsx
// =============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Flame, Plus, Trash2, Target, Clock, ChevronDown } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar  from '../components/Navbar';

const API = 'http://localhost:5000/api';

// Meal type config
const mealTypes = [
  { label: 'Breakfast', emoji: '🌅', color: 'bg-yellow-500' },
  { label: 'Lunch',     emoji: '☀️', color: 'bg-orange-500' },
  { label: 'Dinner',    emoji: '🌙', color: 'bg-blue-500'   },
  { label: 'Snack',     emoji: '🍎', color: 'bg-green-500'  },
];

// Common meals for quick add
const commonMeals = [
  { name: 'Rice Bowl',       calories: 350, emoji: '🍚' },
  { name: 'Chicken Breast',  calories: 165, emoji: '🍗' },
  { name: 'Egg (boiled)',    calories: 78,  emoji: '🥚' },
  { name: 'Banana',          calories: 89,  emoji: '🍌' },
  { name: 'Bread Slice',     calories: 80,  emoji: '🍞' },
  { name: 'Dal & Rice',      calories: 400, emoji: '🍛' },
  { name: 'Chapati',         calories: 120, emoji: '🫓' },
  { name: 'Coffee (black)',  calories: 5,   emoji: '☕' },
];

const getMealConfig = (type) =>
  mealTypes.find((m) => m.label === type) || mealTypes[3];

const CaloriesTracker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todayData,   setTodayData]   = useState({
    meals: [], total: 0, goal: 2000, remaining: 2000, percentage: 0,
  });
  const [history,  setHistory]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [goal,     setGoal]     = useState(2000);

  // Form state
  const [form, setForm] = useState({
    mealName: '',
    calories: '',
    mealType: 'Breakfast',
  });

  useEffect(() => {
    fetchToday();
    fetchHistory();
  }, []);

  const fetchToday = async () => {
    try {
      const res = await axios.get(`${API}/calories/today`);
      setTodayData(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/calories/history`);
      setHistory(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.mealName || !form.calories) {
      return toast.error('Please fill in meal name and calories!');
    }
    setLoading(true);
    try {
      await axios.post(`${API}/calories/add`, {
        mealName: form.mealName,
        calories: parseInt(form.calories),
        mealType: form.mealType,
        dailyGoal: goal,
      });
      toast.success('Meal logged! 🍽️');
      setForm({ mealName: '', calories: '', mealType: 'Breakfast' });
      setShowForm(false);
      fetchToday();
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAdd = async (meal) => {
    setLoading(true);
    try {
      await axios.post(`${API}/calories/add`, {
        mealName: meal.name,
        calories: meal.calories,
        mealType: form.mealType,
        dailyGoal: goal,
      });
      toast.success(`${meal.emoji} ${meal.name} logged!`);
      fetchToday();
      fetchHistory();
    } catch (err) {
      toast.error('Failed to log meal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/calories/${id}`);
      toast.success('Meal removed!');
      fetchToday();
      fetchHistory();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const pct = todayData.percentage;

  // Color based on how close to goal
  const barColor =
    pct >= 100 ? 'bg-red-500' :
    pct >= 75  ? 'bg-orange-500' :
    pct >= 50  ? 'bg-yellow-500' : 'bg-green-500';

  // Group today's meals by type
  const groupedMeals = mealTypes.map(({ label, emoji }) => ({
    label,
    emoji,
    meals: todayData.meals.filter((m) => m.mealType === label),
  })).filter((g) => g.meals.length > 0);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title="Calories Tracker" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ── Summary Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-orange-500 to-red-500 text-white"
            >
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-orange-100 text-xs mb-1">Consumed</p>
                  <p className="text-2xl font-bold">{todayData.total}</p>
                  <p className="text-orange-200 text-xs">kcal</p>
                </div>
                <div className="text-center border-x border-white/20">
                  <p className="text-orange-100 text-xs mb-1">Goal</p>
                  <p className="text-2xl font-bold">{goal}</p>
                  <p className="text-orange-200 text-xs">kcal</p>
                </div>
                <div className="text-center">
                  <p className="text-orange-100 text-xs mb-1">Remaining</p>
                  <p className="text-2xl font-bold">{todayData.remaining}</p>
                  <p className="text-orange-200 text-xs">kcal</p>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-orange-100 mb-2">
                  <span>Daily Progress</span>
                  <span>{pct}%</span>
                </div>
                <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <p className="text-orange-100 text-xs mt-2 text-center">
                  {pct >= 100
                    ? '⚠️ Daily calorie goal reached!'
                    : `${todayData.remaining} kcal left for today`}
                </p>
              </div>
            </motion.div>

            {/* ── Goal Setter ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-orange-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Daily Calorie Goal
                </h3>
              </div>
              <div className="flex gap-3 flex-wrap">
                {[1500, 1800, 2000, 2200, 2500].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGoal(g)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      goal === g
                        ? 'bg-orange-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-orange-50'
                    }`}
                  >
                    {g} kcal
                  </button>
                ))}
              </div>
            </motion.div>

            {/* ── Add Meal Button ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                {showForm ? 'Cancel' : 'Add Meal'}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showForm ? 'rotate-180' : ''}`}
                />
              </button>

              {/* ── Add Meal Form ── */}
              <AnimatePresence>
                {showForm && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="card mt-3 space-y-4">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        Log a Meal
                      </h3>

                      {/* Meal Type Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Meal Type
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {mealTypes.map(({ label, emoji }) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setForm({ ...form, mealType: label })}
                              className={`flex flex-col items-center gap-1 p-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                                form.mealType === label
                                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-600'
                                  : 'border-gray-200 dark:border-gray-600 text-gray-500 hover:border-orange-300'
                              }`}
                            >
                              <span className="text-xl">{emoji}</span>
                              <span className="text-xs">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Meal Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Meal Name
                        </label>
                        <input
                          type="text"
                          value={form.mealName}
                          onChange={(e) => setForm({ ...form, mealName: e.target.value })}
                          placeholder="e.g. Chicken Rice"
                          className="input-field"
                        />
                      </div>

                      {/* Calories */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Calories (kcal)
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            value={form.calories}
                            onChange={(e) => setForm({ ...form, calories: e.target.value })}
                            placeholder="e.g. 350"
                            min="1"
                            className="input-field pr-16"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                            kcal
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="btn-primary w-full flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <><Flame size={18} /> Log Meal</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Quick Add Common Meals ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Quick Add Common Meals
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {commonMeals.map((meal) => (
                  <motion.button
                    key={meal.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuickAdd(meal)}
                    disabled={loading}
                    className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20 rounded-xl transition-all text-left border border-orange-100 dark:border-orange-900/30"
                  >
                    <span className="text-2xl">{meal.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {meal.name}
                      </p>
                      <p className="text-xs text-orange-500 font-medium">
                        {meal.calories} kcal
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ── Today's Meals by Group ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-gray-400" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Today's Meals
                </h3>
                <span className="ml-auto text-sm text-gray-400">
                  {todayData.meals.length} items
                </span>
              </div>

              {todayData.meals.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">🍽️</span>
                  <p className="text-gray-400 mt-2 text-sm">
                    No meals logged today. Add your first meal!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {groupedMeals.map(({ label, emoji, meals }) => {
                    const groupTotal = meals.reduce((s, m) => s + m.calories, 0);
                    return (
                      <div key={label}>
                        {/* Group header */}
                        <div className="flex items-center gap-2 mb-2">
                          <span>{emoji}</span>
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {label}
                          </span>
                          <span className="ml-auto text-xs font-medium text-orange-500">
                            {groupTotal} kcal
                          </span>
                        </div>
                        {/* Meals in group */}
                        <div className="space-y-2 ml-6">
                          {meals.map((meal) => (
                            <motion.div
                              key={meal._id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20"
                            >
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {meal.mealName}
                                </p>
                                <p className="text-xs text-gray-400">
                                  {new Date(meal.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit', minute: '2-digit',
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-orange-500">
                                  {meal.calories} kcal
                                </span>
                                <button
                                  onClick={() => handleDelete(meal._id)}
                                  className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>

            {/* ── 7-Day History ── */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Last 7 Days
                </h3>
                <div className="space-y-3">
                  {history.map((day) => {
                    const p = Math.min(Math.round((day.total / day.goal) * 100), 100);
                    return (
                      <div key={day.date}>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>
                            {new Date(day.date).toLocaleDateString('en', {
                              weekday: 'short', month: 'short', day: 'numeric',
                            })}
                          </span>
                          <span>{day.total} / {day.goal} kcal ({p}%)</span>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${p}%` }}
                            transition={{ duration: 0.8 }}
                            className={`h-full rounded-full ${
                              p >= 100 ? 'bg-red-500' :
                              p >= 75  ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default CaloriesTracker;