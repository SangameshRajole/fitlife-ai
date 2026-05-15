// =============================================
// pages/WorkoutTracker.jsx
// =============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Dumbbell, Plus, Trash2, Clock,
  Flame, ChevronDown, Zap,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar  from '../components/Navbar';

const API = 'http://localhost:5000/api';

// Workout types config
const workoutTypes = [
  { label: 'Cardio',    emoji: '🏃', color: 'bg-red-500'    },
  { label: 'Strength',  emoji: '🏋️', color: 'bg-blue-500'   },
  { label: 'Yoga',      emoji: '🧘', color: 'bg-purple-500' },
  { label: 'Sports',    emoji: '⚽', color: 'bg-green-500'  },
  { label: 'HIIT',      emoji: '⚡', color: 'bg-orange-500' },
  { label: 'Other',     emoji: '💪', color: 'bg-gray-500'   },
];

// Intensity options
const intensities = [
  { label: 'Low',    emoji: '😌', color: 'text-green-500'  },
  { label: 'Medium', emoji: '😤', color: 'text-yellow-500' },
  { label: 'High',   emoji: '🔥', color: 'text-red-500'    },
];

// Quick workout templates
const workoutTemplates = [
  { name: 'Morning Run',      type: 'Cardio',   duration: 30,  calories: 250, emoji: '🏃' },
  { name: 'Push-ups',         type: 'Strength', duration: 15,  calories: 80,  emoji: '💪' },
  { name: 'Cycling',          type: 'Cardio',   duration: 45,  calories: 350, emoji: '🚴' },
  { name: 'Yoga Session',     type: 'Yoga',     duration: 30,  calories: 120, emoji: '🧘' },
  { name: 'Weight Training',  type: 'Strength', duration: 60,  calories: 400, emoji: '🏋️' },
  { name: 'HIIT Workout',     type: 'HIIT',     duration: 20,  calories: 300, emoji: '⚡' },
  { name: 'Swimming',         type: 'Cardio',   duration: 30,  calories: 280, emoji: '🏊' },
  { name: 'Jump Rope',        type: 'Cardio',   duration: 15,  calories: 180, emoji: '🪢' },
];

const getTypeConfig = (type) =>
  workoutTypes.find((t) => t.label === type) || workoutTypes[5];

const WorkoutTracker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todayData,   setTodayData]   = useState({
    workouts: [], totalDuration: 0, totalCalories: 0, count: 0,
  });
  const [history,  setHistory]  = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading,  setLoading]  = useState(false);

  // Form state
  const [form, setForm] = useState({
    workoutName:    '',
    workoutType:    'Cardio',
    duration:       '',
    caloriesBurned: '',
    intensity:      'Medium',
    notes:          '',
  });

  useEffect(() => {
    fetchToday();
    fetchHistory();
  }, []);

  const fetchToday = async () => {
    try {
      const res = await axios.get(`${API}/workout/today`);
      setTodayData(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/workout/history`);
      setHistory(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.workoutName || !form.duration || !form.caloriesBurned) {
      return toast.error('Please fill in all required fields!');
    }
    setLoading(true);
    try {
      await axios.post(`${API}/workout/add`, {
        ...form,
        duration:       parseInt(form.duration),
        caloriesBurned: parseInt(form.caloriesBurned),
      });
      toast.success('Workout logged! 💪');
      setForm({
        workoutName: '', workoutType: 'Cardio',
        duration: '', caloriesBurned: '', intensity: 'Medium', notes: '',
      });
      setShowForm(false);
      fetchToday();
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplate = async (template) => {
    setLoading(true);
    try {
      await axios.post(`${API}/workout/add`, {
        workoutName:    template.name,
        workoutType:    template.type,
        duration:       template.duration,
        caloriesBurned: template.calories,
        intensity:      'Medium',
        notes:          '',
      });
      toast.success(`${template.emoji} ${template.name} logged!`);
      fetchToday();
      fetchHistory();
    } catch (err) {
      toast.error('Failed to log workout');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/workout/${id}`);
      toast.success('Workout removed!');
      fetchToday();
      fetchHistory();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title="Workout Tracker" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ── Today's Summary ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-purple-500 to-indigo-600 text-white"
            >
              <p className="text-purple-100 text-sm font-medium mb-4">
                Today's Workout Summary
              </p>
              <div className="grid grid-cols-3 gap-4">
                {/* Workouts count */}
                <div className="text-center bg-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-bold">{todayData.count}</p>
                  <p className="text-purple-200 text-xs mt-1">Workouts</p>
                </div>
                {/* Duration */}
                <div className="text-center bg-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-bold">{todayData.totalDuration}</p>
                  <p className="text-purple-200 text-xs mt-1">Minutes</p>
                </div>
                {/* Calories */}
                <div className="text-center bg-white/10 rounded-2xl p-4">
                  <p className="text-3xl font-bold">{todayData.totalCalories}</p>
                  <p className="text-purple-200 text-xs mt-1">Kcal Burned</p>
                </div>
              </div>

              {todayData.count === 0 && (
                <p className="text-center text-purple-200 text-sm mt-4">
                  No workouts yet today. Let's get moving! 🚀
                </p>
              )}
            </motion.div>

            {/* ── Add Workout Button ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <button
                onClick={() => setShowForm(!showForm)}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25"
              >
                <Plus size={18} />
                {showForm ? 'Cancel' : 'Log Custom Workout'}
                <ChevronDown
                  size={16}
                  className={`transition-transform ${showForm ? 'rotate-180' : ''}`}
                />
              </button>

              {/* ── Custom Workout Form ── */}
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
                        Log Workout
                      </h3>

                      {/* Workout Type */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Workout Type
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {workoutTypes.map(({ label, emoji }) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setForm({ ...form, workoutType: label })}
                              className={`flex items-center gap-2 p-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                                form.workoutType === label
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-600'
                                  : 'border-gray-200 dark:border-gray-600 text-gray-500'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className="text-xs">{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Workout Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Workout Name *
                        </label>
                        <input
                          type="text"
                          value={form.workoutName}
                          onChange={(e) => setForm({ ...form, workoutName: e.target.value })}
                          placeholder="e.g. Morning Run"
                          className="input-field"
                        />
                      </div>

                      {/* Duration & Calories row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Duration *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={form.duration}
                              onChange={(e) => setForm({ ...form, duration: e.target.value })}
                              placeholder="30"
                              min="1"
                              className="input-field pr-14"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              mins
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Calories Burned *
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              value={form.caloriesBurned}
                              onChange={(e) => setForm({ ...form, caloriesBurned: e.target.value })}
                              placeholder="250"
                              min="1"
                              className="input-field pr-14"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                              kcal
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Intensity */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Intensity
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {intensities.map(({ label, emoji, color }) => (
                            <button
                              key={label}
                              type="button"
                              onClick={() => setForm({ ...form, intensity: label })}
                              className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border-2 transition-all text-sm font-medium ${
                                form.intensity === label
                                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                  : 'border-gray-200 dark:border-gray-600 text-gray-500'
                              }`}
                            >
                              <span>{emoji}</span>
                              <span className={color}>{label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Notes (optional)
                        </label>
                        <textarea
                          value={form.notes}
                          onChange={(e) => setForm({ ...form, notes: e.target.value })}
                          placeholder="How did it feel? Any achievements?"
                          rows={2}
                          className="input-field resize-none"
                        />
                      </div>

                      <button
                        onClick={handleAdd}
                        disabled={loading}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <><Dumbbell size={18} /> Log Workout</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ── Quick Templates ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap size={18} className="text-purple-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Quick Add Templates
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {workoutTemplates.map((template) => (
                  <motion.button
                    key={template.name}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleTemplate(template)}
                    disabled={loading}
                    className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-xl transition-all text-left border border-purple-100 dark:border-purple-900/30"
                  >
                    <span className="text-2xl">{template.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        {template.duration}min · {template.calories} kcal
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* ── Today's Workouts ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-gray-400" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Today's Workouts
                </h3>
                <span className="ml-auto text-sm text-gray-400">
                  {todayData.count} sessions
                </span>
              </div>

              {todayData.workouts.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">🏋️</span>
                  <p className="text-gray-400 mt-2 text-sm">
                    No workouts logged today. Get moving!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayData.workouts.map((workout) => {
                    const typeConfig = getTypeConfig(workout.workoutType);
                    const intensity  = intensities.find(
                      (i) => i.label === workout.intensity
                    );
                    return (
                      <motion.div
                        key={workout._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-100 dark:border-purple-900/30"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`${typeConfig.color} p-2 rounded-xl`}>
                              <span className="text-lg">{typeConfig.emoji}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 dark:text-white">
                                {workout.workoutName}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {workout.workoutType} · {intensity?.emoji} {workout.intensity}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDelete(workout._id)}
                            className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Stats row */}
                        <div className="flex gap-4 mt-3 pt-3 border-t border-purple-100 dark:border-purple-900/30">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Clock size={13} className="text-purple-400" />
                            {workout.duration} mins
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500">
                            <Flame size={13} className="text-orange-400" />
                            {workout.caloriesBurned} kcal burned
                          </div>
                          <div className="ml-auto text-xs text-gray-400">
                            {new Date(workout.createdAt).toLocaleTimeString([], {
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </div>
                        </div>

                        {/* Notes */}
                        {workout.notes && (
                          <p className="text-xs text-gray-400 mt-2 italic">
                            📝 {workout.notes}
                          </p>
                        )}
                      </motion.div>
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
                  {history.map((day) => (
                    <div
                      key={day.date}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {new Date(day.date).toLocaleDateString('en', {
                            weekday: 'short', month: 'short', day: 'numeric',
                          })}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {day.count} workout{day.count !== 1 ? 's' : ''} · {day.totalDuration} mins
                        </p>
                      </div>
                      <div className="text-right">
                        {day.count > 0 ? (
                          <>
                            <p className="text-sm font-bold text-purple-500">
                              {day.totalCalories} kcal
                            </p>
                            <p className="text-xs text-gray-400">burned</p>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">Rest day</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default WorkoutTracker;