// =============================================
// pages/BMITracker.jsx — with cm & feet toggle
// =============================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Scale, Clock } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar  from '../components/Navbar';

const API = 'http://localhost:5000/api';

const categoryConfig = {
  Underweight: { color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-900/20',     emoji: '🥗', tip: 'Consider eating more nutritious foods.'         },
  Normal:      { color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-900/20',   emoji: '✅', tip: 'Great job! Keep maintaining your healthy weight.' },
  Overweight:  { color: 'text-yellow-500', bg: 'bg-yellow-50 dark:bg-yellow-900/20', emoji: '⚠️', tip: 'Consider adding more exercise to your routine.'   },
  Obese:       { color: 'text-red-500',    bg: 'bg-red-50 dark:bg-red-900/20',       emoji: '🏃', tip: 'Please consult a doctor for a health plan.'        },
};

const getBMIPosition = (bmi) => {
  const clamped = Math.min(Math.max(bmi, 10), 40);
  return ((clamped - 10) / 30) * 100;
};

const BMITracker = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Unit toggle
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' or 'ft'

  // Inputs
  const [weight, setWeight] = useState('');
  const [heightCm, setHeightCm]     = useState('');   // used when cm
  const [feet, setFeet]             = useState('');   // used when ft
  const [inches, setInches]         = useState('');   // used when ft

  const [result,  setResult]  = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API}/bmi/history`);
      setHistory(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  // Convert feet+inches → cm
  const feetToCm = (ft, inch) => {
    const totalInches = parseFloat(ft || 0) * 12 + parseFloat(inch || 0);
    return (totalInches * 2.54).toFixed(1);
  };

  const handleCalculate = async (e) => {
    e.preventDefault();

    // Get height in cm based on selected unit
    let finalHeightCm;
    if (heightUnit === 'cm') {
      if (!heightCm) return toast.error('Please enter height in cm!');
      finalHeightCm = parseFloat(heightCm);
    } else {
      if (!feet) return toast.error('Please enter height in feet!');
      finalHeightCm = parseFloat(feetToCm(feet, inches));
    }

    if (!weight) return toast.error('Please enter your weight!');

    setLoading(true);
    try {
      const res = await axios.post(`${API}/bmi/calculate`, {
        weight: parseFloat(weight),
        height: finalHeightCm,
      });
      setResult(res.data.data);
      fetchHistory();
      toast.success('BMI calculated! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Calculation failed!');
    } finally {
      setLoading(false);
    }
  };

  // Reset height fields when switching unit
  const handleUnitSwitch = (unit) => {
    setHeightUnit(unit);
    setHeightCm('');
    setFeet('');
    setInches('');
    setResult(null);
  };

  const config = result ? categoryConfig[result.category] : null;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title="BMI Tracker" />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* ── Calculator Card ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500 p-2.5 rounded-xl">
                  <Scale size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    BMI Calculator
                  </h3>
                  <p className="text-sm text-gray-400">
                    Enter your measurements below
                  </p>
                </div>
              </div>

              <form onSubmit={handleCalculate} className="space-y-5">

                {/* ── Height Unit Toggle ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height Unit
                  </label>
                  <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl w-fit">
                    {['cm', 'ft'].map((unit) => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => handleUnitSwitch(unit)}
                        className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                          heightUnit === unit
                            ? 'bg-white dark:bg-gray-900 text-primary-500 shadow-sm'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
                        }`}
                      >
                        {unit === 'cm' ? '📏 Centimeters (cm)' : '🦶 Feet & Inches (ft)'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ── Height Input ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Height
                  </label>

                  {heightUnit === 'cm' ? (
                    /* CM input */
                    <div className="relative">
                      <input
                        type="number"
                        value={heightCm}
                        onChange={(e) => setHeightCm(e.target.value)}
                        placeholder="e.g. 175"
                        min="50" max="300"
                        className="input-field pr-14"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                        cm
                      </span>
                    </div>
                  ) : (
                    /* Feet + Inches inputs */
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input
                          type="number"
                          value={feet}
                          onChange={(e) => setFeet(e.target.value)}
                          placeholder="e.g. 5"
                          min="1" max="9"
                          className="input-field pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                          ft
                        </span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          value={inches}
                          onChange={(e) => setInches(e.target.value)}
                          placeholder="e.g. 9"
                          min="0" max="11"
                          className="input-field pr-12"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                          in
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Live conversion preview */}
                  {heightUnit === 'ft' && feet && (
                    <p className="text-xs text-primary-500 mt-1.5 font-medium">
                      ≈ {feetToCm(feet, inches)} cm
                    </p>
                  )}
                  {heightUnit === 'cm' && heightCm && (
                    <p className="text-xs text-primary-500 mt-1.5 font-medium">
                      ≈ {Math.floor(heightCm / 30.48)} ft{' '}
                      {Math.round((heightCm / 2.54) % 12)} in
                    </p>
                  )}
                </div>

                {/* ── Weight Input ── */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 70"
                      min="1" max="300"
                      className="input-field pr-12"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">
                      kg
                    </span>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <><Scale size={18} /> Calculate BMI</>
                  )}
                </button>
              </form>
            </motion.div>

            {/* ── Result Card ── */}
            {result && config && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`card border-2 ${config.bg}`}
              >
                <div className="text-center mb-6">
                  <span className="text-5xl">{config.emoji}</span>
                  <div className="mt-3">
                    <span className={`text-5xl font-bold ${config.color}`}>
                      {result.bmi}
                    </span>
                    <span className="text-gray-400 text-lg ml-1">kg/m²</span>
                  </div>
                  <span className={`inline-block mt-2 px-4 py-1 rounded-full text-sm font-semibold ${config.color} ${config.bg}`}>
                    {result.category}
                  </span>

                  {/* Show both units in result */}
                  <div className="flex justify-center gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>⚖️ {result.weight} kg</span>
                    <span>📏 {result.height} cm ({Math.floor(result.height / 30.48)}ft {Math.round((result.height / 2.54) % 12)}in)</span>
                  </div>
                </div>

                {/* BMI Scale */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                  <div className="relative h-3 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400">
                    <motion.div
                      initial={{ left: '0%' }}
                      animate={{ left: `${getBMIPosition(result.bmi)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-700 rounded-full shadow-md"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>&lt;18.5</span>
                    <span>18.5–24.9</span>
                    <span>25–29.9</span>
                    <span>≥30</span>
                  </div>
                </div>

                {/* Tip */}
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-xl p-3 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    💡 {config.tip}
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── BMI Categories ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                BMI Categories
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(categoryConfig).map(([cat, cfg]) => (
                  <div key={cat} className={`rounded-xl p-3 ${cfg.bg}`}>
                    <span className="text-lg">{cfg.emoji}</span>
                    <p className={`font-semibold text-sm mt-1 ${cfg.color}`}>{cat}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {cat === 'Underweight' && '< 18.5'}
                      {cat === 'Normal'      && '18.5 – 24.9'}
                      {cat === 'Overweight'  && '25 – 29.9'}
                      {cat === 'Obese'       && '≥ 30'}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* ── History ── */}
            {history.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock size={18} className="text-gray-400" />
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Recent History
                  </h3>
                </div>
                <div className="space-y-3">
                  {history.map((record) => {
                    const cfg = categoryConfig[record.category];
                    return (
                      <div
                        key={record._id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{cfg.emoji}</span>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              BMI: {record.bmi}
                            </p>
                            <p className="text-xs text-gray-400">
                              {record.weight}kg · {record.height}cm
                              ({Math.floor(record.height / 30.48)}ft{' '}
                              {Math.round((record.height / 2.54) % 12)}in)
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
                            {record.category}
                          </span>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(record.createdAt).toLocaleDateString()}
                          </p>
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

export default BMITracker;