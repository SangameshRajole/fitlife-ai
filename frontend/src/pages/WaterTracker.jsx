// =============================================
// pages/WaterTracker.jsx
// =============================================

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Droplets, Plus, Trash2, Target, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar  from '../components/Navbar';

const API = 'http://localhost:5000/api';

// Quick add buttons
const quickAmounts = [
  { label: 'Sip',    amount: 100,  emoji: '💧' },
  { label: 'Glass',  amount: 250,  emoji: '🥛' },
  { label: 'Bottle', amount: 500,  emoji: '🍶' },
  { label: 'Large',  amount: 1000, emoji: '🫙' },
];

const WaterTracker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [todayData,   setTodayData]   = useState({ entries: [], total: 0, goal: 2000, percentage: 0 });
  const [customAmt,   setCustomAmt]   = useState('');
  const [label,       setLabel]       = useState('');
  const [goal,        setGoal]        = useState(2000);
  const [loading,     setLoading]     = useState(false);
  const [history,     setHistory]     = useState([]);

  useEffect(() => {
    fetchToday();
    fetchHistory();
  }, []);

  const fetchToday = async () => {
    try {
      const res = await axios.get(`${API}/water/today`);
      setTodayData(res.data.data);
    } catch (err) { console.error(err); }
  };

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/water/history`);
      setHistory(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (amount) => {
    setLoading(true);
    try {
      await axios.post(`${API}/water/add`, {
        amount,
        label: label || 'Water',
        dailyGoal: goal,
      });
      toast.success(`+${amount}ml logged! 💧`);
      setCustomAmt('');
      setLabel('');
      fetchToday();
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log water');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/water/${id}`);
      toast.success('Entry removed!');
      fetchToday();
      fetchHistory();
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  // Water fill level for the bottle animation
  const fillPercent = Math.min(todayData.percentage, 100);

  // Color based on progress
  const progressColor =
    fillPercent >= 100 ? 'bg-green-500' :
    fillPercent >= 60  ? 'bg-cyan-500'  :
    fillPercent >= 30  ? 'bg-blue-400'  : 'bg-blue-300';

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title="Water Intake" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ── Progress Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card bg-gradient-to-br from-cyan-500 to-blue-600 text-white"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-cyan-100 text-sm font-medium">Today's Intake</p>
                  <div className="flex items-end gap-2 mt-1">
                    <span className="text-4xl font-bold">
                      {todayData.total >= 1000
                        ? `${(todayData.total / 1000).toFixed(1)}L`
                        : `${todayData.total}ml`}
                    </span>
                    <span className="text-cyan-200 text-sm mb-1">
                      / {goal >= 1000 ? `${goal / 1000}L` : `${goal}ml`}
                    </span>
                  </div>
                </div>

                {/* Water drop icon with fill */}
                <div className="relative w-16 h-20">
                  <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-4xl">
                    💧
                  </div>
                  <div className="absolute bottom-0 right-0 bg-white text-cyan-600 text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {fillPercent}%
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex justify-between text-xs text-cyan-100 mb-2">
                  <span>Progress</span>
                  <span>{todayData.total}ml / {goal}ml</span>
                </div>
                <div className="bg-white/20 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fillPercent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-white rounded-full relative"
                  >
                    {fillPercent > 10 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-cyan-600">
                        {fillPercent}%
                      </span>
                    )}
                  </motion.div>
                </div>

                {fillPercent >= 100 ? (
                  <p className="text-center text-white font-semibold mt-2 text-sm">
                    🎉 Daily goal reached! Amazing!
                  </p>
                ) : (
                  <p className="text-cyan-100 text-xs mt-2 text-center">
                    {goal - todayData.total}ml more to reach your goal
                  </p>
                )}
              </div>
            </motion.div>

            {/* ── Daily Goal Setter ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Target size={18} className="text-primary-500" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Daily Goal
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(parseInt(e.target.value) || 2000)}
                    min="500"
                    max="5000"
                    step="100"
                    className="input-field pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    ml
                  </span>
                </div>
                <div className="flex gap-2">
                  {[1500, 2000, 2500, 3000].map((g) => (
                    <button
                      key={g}
                      onClick={() => setGoal(g)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        goal === g
                          ? 'bg-cyan-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {g / 1000}L
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ── Quick Add Buttons ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="card"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                Quick Add
              </h3>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {quickAmounts.map(({ label: lbl, amount, emoji }) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleAdd(amount)}
                    disabled={loading}
                    className="flex flex-col items-center gap-1.5 p-3 bg-cyan-50 dark:bg-cyan-900/20 hover:bg-cyan-100 dark:hover:bg-cyan-900/40 rounded-xl transition-all border border-cyan-100 dark:border-cyan-800"
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                      {lbl}
                    </span>
                    <span className="text-xs text-cyan-500">{amount}ml</span>
                  </motion.button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                  Custom Amount
                </p>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={customAmt}
                      onChange={(e) => setCustomAmt(e.target.value)}
                      placeholder="Enter amount (ml)"
                      min="1"
                      className="input-field pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      ml
                    </span>
                  </div>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    placeholder="Label (optional)"
                    className="input-field flex-1"
                  />
                  <button
                    onClick={() => customAmt && handleAdd(parseInt(customAmt))}
                    disabled={loading || !customAmt}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap"
                  >
                    <Plus size={18} />
                    Add
                  </button>
                </div>
              </div>
            </motion.div>

            {/* ── Today's Log ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-gray-400" />
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Today's Log
                </h3>
                <span className="ml-auto text-sm text-gray-400">
                  {todayData.entries.length} entries
                </span>
              </div>

              {todayData.entries.length === 0 ? (
                <div className="text-center py-8">
                  <span className="text-4xl">💧</span>
                  <p className="text-gray-400 mt-2 text-sm">
                    No water logged today. Start drinking!
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-2">
                    {todayData.entries.map((entry) => (
                      <motion.div
                        key={entry._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center justify-between p-3 bg-cyan-50 dark:bg-cyan-900/10 rounded-xl border border-cyan-100 dark:border-cyan-900/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">💧</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              {entry.amount}ml
                            </p>
                            <p className="text-xs text-gray-400">
                              {entry.label} · {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="p-1.5 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
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
                    const pct = Math.min(Math.round((day.total / day.goal) * 100), 100);
                    return (
                      <div key={day.date}>
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>{new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          <span>{day.total}ml / {day.goal}ml ({pct}%)</span>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.8 }}
                            className={`h-full rounded-full ${pct >= 100 ? 'bg-green-500' : 'bg-cyan-500'}`}
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

export default WaterTracker;