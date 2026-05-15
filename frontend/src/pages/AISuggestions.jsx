// =============================================
// pages/AISuggestions.jsx — Enhanced
// =============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Brain, RefreshCw, Trophy, AlertCircle,
  Info, CheckCircle, Zap, Heart, Dumbbell,
  Utensils, Leaf, Drumstick,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar  from '../components/Navbar';

const API = 'http://localhost:5000/api';

const priorityConfig = {
  high:   { color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20',       border: 'border-red-200 dark:border-red-800'    },
  medium: { color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800' },
  low:    { color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20',   border: 'border-green-200 dark:border-green-800'  },
};

const categoryColors = {
  Nutrition:  'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  Exercise:   'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  Hydration:  'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  Wellness:   'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  Medical:    'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  Recovery:   'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  Tracking:   'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const intensityColors = {
  High:   'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  Medium: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  Low:    'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  Rest:   'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400',
};

// Health Score Ring
const ScoreRing = ({ score, grade }) => {
  const r = 65, stroke = 10;
  const circ   = 2 * Math.PI * (r - stroke / 2);
  const offset = circ - (score / 100) * circ;
  const color  = score >= 85 ? '#22c55e' : score >= 70 ? '#3b82f6' : score >= 50 ? '#eab308' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg width="144" height="144" className="-rotate-90">
          <circle cx="72" cy="72" r={r - stroke / 2} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-gray-100 dark:text-gray-700" />
          <motion.circle cx="72" cy="72" r={r - stroke / 2} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }} transition={{ duration: 1.5, ease: 'easeOut' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">{score}</span>
          <span className="text-xs text-gray-400">/ 100</span>
        </div>
      </div>
      <span className="text-2xl mt-1">{grade.emoji}</span>
      <p className="font-bold text-gray-900 dark:text-white">{grade.label}</p>
      <p className="text-xs text-gray-400">Health Score</p>
    </div>
  );
};

const AISuggestions = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data,        setData]        = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [refreshing,  setRefreshing]  = useState(false);
  const [dietType,    setDietType]    = useState('veg'); // 'veg' or 'nonVeg'
  const [activeTab,   setActiveTab]   = useState('suggestions'); // tabs

  useEffect(() => { fetchSuggestions(); }, []);

  const fetchSuggestions = async () => {
    try {
      const res = await axios.get(`${API}/ai/suggestions`);
      setData(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const tabs = [
    { id: 'suggestions', label: 'AI Tips',      icon: Brain     },
    { id: 'workout',     label: 'Workout Plan', icon: Dumbbell  },
    { id: 'diet',        label: 'Diet Plan',    icon: Utensils  },
    { id: 'lifestyle',   label: 'Lifestyle',    icon: Heart     },
  ];

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title="AI Suggestions" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-5">

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full" />
                <p className="mt-4 text-gray-500 font-medium">🤖 AI is analyzing your health data...</p>
              </div>
            ) : data && (
              <>
                {/* ── Header ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-2.5 rounded-xl"><Brain size={24} /></div>
                      <div>
                        <h2 className="text-xl font-bold">FitLife AI Analysis</h2>
                        <p className="text-purple-100 text-sm">Personalized plans based on your health data</p>
                      </div>
                    </div>
                    <button onClick={() => { setRefreshing(true); fetchSuggestions(); }} className="bg-white/20 hover:bg-white/30 p-2 rounded-xl transition-all">
                      <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </motion.div>

                {/* ── Health Score ── */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <ScoreRing score={data.healthScore} grade={data.grade} />
                    <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                      {[
                        { label: 'BMI',             value: data.summary.bmi ? `${data.summary.bmi} (${data.summary.bmiCategory})` : 'Not set', icon: '⚖️', color: 'bg-blue-50 dark:bg-blue-900/20'   },
                        { label: 'Water Today',     value: `${data.summary.waterToday}ml`,      icon: '💧', color: 'bg-cyan-50 dark:bg-cyan-900/20'   },
                        { label: 'Calories',        value: `${data.summary.caloriesToday} kcal`, icon: '🔥', color: 'bg-orange-50 dark:bg-orange-900/20' },
                        { label: 'Workouts / week', value: `${data.summary.workoutsWeek} sessions`, icon: '💪', color: 'bg-purple-50 dark:bg-purple-900/20' },
                      ].map((s) => (
                        <div key={s.label} className={`${s.color} rounded-xl p-3`}>
                          <span className="text-lg">{s.icon}</span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white mt-0.5">{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* ── Tabs ── */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex gap-2 overflow-x-auto pb-1">
                  {tabs.map(({ id, label, icon: Icon }) => (
                    <button key={id} onClick={() => setActiveTab(id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${activeTab === id ? 'bg-purple-500 text-white shadow-md' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}`}>
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}
                </motion.div>

                {/* ══════════════════════════════ */}
                {/* TAB: AI SUGGESTIONS           */}
                {/* ══════════════════════════════ */}
                {activeTab === 'suggestions' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

                    {/* Achievements */}
                    {data.achievements.length > 0 && (
                      <div className="card space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Trophy size={18} className="text-yellow-500" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Achievements 🏆</h3>
                        </div>
                        {data.achievements.map((a, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                            <span className="text-2xl">{a.icon}</span>
                            <div className="flex-1">
                              <p className="font-semibold text-green-700 dark:text-green-400">{a.title}</p>
                              <p className="text-sm text-green-600 dark:text-green-500">{a.desc}</p>
                            </div>
                            <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {data.suggestions.length > 0 && (
                      <div className="card space-y-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap size={18} className="text-purple-500" />
                          <h3 className="font-bold text-gray-900 dark:text-white">Recommendations</h3>
                          <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 px-2 py-1 rounded-full">{data.suggestions.length} tips</span>
                        </div>
                        {data.suggestions.map((s, i) => {
                          const p = priorityConfig[s.priority];
                          const c = categoryColors[s.category] || categoryColors.Tracking;
                          return (
                            <div key={i} className={`p-4 rounded-xl border ${p.bg} ${p.border}`}>
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">{s.icon}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <p className={`font-semibold ${p.color}`}>{s.title}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c}`}>{s.category}</span>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">{s.desc}</p>
                                </div>
                                {s.priority === 'high' && <AlertCircle size={16} className="text-red-500 flex-shrink-0" />}
                                {s.priority === 'medium' && <Info size={16} className="text-yellow-500 flex-shrink-0" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* ══════════════════════════════ */}
                {/* TAB: WORKOUT PLAN             */}
                {/* ══════════════════════════════ */}
                {activeTab === 'workout' && data.workoutPlan && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

                    {/* Plan Header */}
                    <div className="card bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/20 p-2 rounded-xl"><Dumbbell size={20} /></div>
                        <div>
                          <h3 className="font-bold">Your Weekly Workout Plan</h3>
                          <p className="text-purple-100 text-sm">Based on your BMI: {data.summary.bmiCategory || 'Normal'}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="bg-white/15 rounded-xl px-3 py-2">
                          <p className="text-xs text-purple-100">Goal</p>
                          <p className="text-sm font-semibold">{data.workoutPlan.goal}</p>
                        </div>
                        <div className="bg-white/15 rounded-xl px-3 py-2">
                          <p className="text-xs text-purple-100">Target</p>
                          <p className="text-sm font-semibold">{data.workoutPlan.weeklyTarget}</p>
                        </div>
                      </div>
                    </div>

                    {/* 7-Day Plan */}
                    <div className="space-y-3">
                      {data.workoutPlan.plan.map((day, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-bold text-gray-900 dark:text-white">{day.day}</p>
                              <p className="text-sm text-purple-500 font-medium">{day.workout}</p>
                            </div>
                            <div className="flex gap-2">
                              {day.duration !== '—' && (
                                <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">{day.duration}</span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${intensityColors[day.intensity]}`}>{day.intensity}</span>
                            </div>
                          </div>
                          {day.exercises.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                              {day.exercises.map((ex, j) => (
                                <div key={j} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                  <span className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                                  {ex}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ══════════════════════════════ */}
                {/* TAB: DIET PLAN                */}
                {/* ══════════════════════════════ */}
                {activeTab === 'diet' && data.dietPlan && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">

                    {/* Diet Header */}
                    <div className="card bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-white/20 p-2 rounded-xl"><Utensils size={20} /></div>
                        <div>
                          <h3 className="font-bold">Your Personalized Diet Plan</h3>
                          <p className="text-green-100 text-sm">Goal: {data.dietPlan.goal}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-3 mb-4">
                        <div className="bg-white/15 rounded-xl px-3 py-2">
                          <p className="text-xs text-green-100">Target Calories</p>
                          <p className="text-sm font-semibold">{data.dietPlan.targetCalories}</p>
                        </div>
                        <div className="bg-white/15 rounded-xl px-3 py-2">
                          <p className="text-xs text-green-100">Key Nutrients</p>
                          <p className="text-sm font-semibold">{data.dietPlan.keyNutrients.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>

                      {/* Veg / Non-Veg Toggle */}
                      <div className="flex gap-2">
                        <button onClick={() => setDietType('veg')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${dietType === 'veg' ? 'bg-white text-green-600' : 'bg-white/20 text-white'}`}>
                          <Leaf size={15} /> Vegetarian
                        </button>
                        <button onClick={() => setDietType('nonVeg')}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${dietType === 'nonVeg' ? 'bg-white text-green-600' : 'bg-white/20 text-white'}`}>
                          <Drumstick size={15} /> Non-Vegetarian
                        </button>
                      </div>
                    </div>

                    {/* Meal Plan */}
                    {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => {
                      const mealData = data.dietPlan[dietType][meal];
                      const mealEmoji = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snacks: '🍎' };
                      const mealLabel = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' };
                      return (
                        <motion.div key={meal} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">{mealEmoji[meal]}</span>
                            <h3 className="font-bold text-gray-900 dark:text-white">{mealLabel[meal]}</h3>
                            <span className="ml-auto text-xs text-gray-400">Choose any one</span>
                          </div>
                          <div className="space-y-2">
                            {mealData.map((option, i) => (
                              <div key={i} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                                <span className="text-green-500 font-bold text-sm mt-0.5 flex-shrink-0">
                                  {i + 1}.
                                </span>
                                <p className="text-sm text-gray-700 dark:text-gray-300">{option}</p>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}

                    {/* Foods to Avoid */}
                    <div className="card border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">🚫</span>
                        <h3 className="font-bold text-red-600 dark:text-red-400">Foods to Avoid</h3>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {data.dietPlan[dietType].avoid.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                            <span className="w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ══════════════════════════════ */}
                {/* TAB: LIFESTYLE                */}
                {/* ══════════════════════════════ */}
                {activeTab === 'lifestyle' && data.lifestyleTips && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    {data.lifestyleTips.map((section, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="card">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-2xl">{section.icon}</span>
                          <h3 className="font-bold text-gray-900 dark:text-white">{section.title}</h3>
                          <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full">{section.category}</span>
                        </div>
                        <div className="space-y-2">
                          {section.tips.map((tip, j) => (
                            <div key={j} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                              <CheckCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5" />
                              <p className="text-sm text-gray-700 dark:text-gray-300">{tip}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}

                    {/* Disclaimer */}
                    <p className="text-center text-xs text-gray-400 pb-4">
                      🤖 AI suggestions are based on your logged data.
                      Always consult a healthcare professional for medical advice.
                    </p>
                  </motion.div>
                )}

              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AISuggestions;