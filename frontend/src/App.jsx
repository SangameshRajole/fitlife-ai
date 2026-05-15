import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster }        from 'react-hot-toast';
import { AuthProvider }   from './context/AuthContext';
import ProtectedRoute     from './components/ProtectedRoute';
import Login              from './pages/Login';
import Register           from './pages/Register';
import Dashboard          from './pages/Dashboard';
import BMITracker         from './pages/BMITracker';
import WaterTracker       from './pages/WaterTracker';
import CaloriesTracker    from './pages/CaloriesTracker';
import WorkoutTracker     from './pages/WorkoutTracker';
import AISuggestions      from './pages/AISuggestions';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#f9fafb',
              borderRadius: '12px',
              border: '1px solid #374151',
            },
          }}
        />
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/bmi" element={
            <ProtectedRoute><BMITracker /></ProtectedRoute>
          } />
          <Route path="/water" element={
            <ProtectedRoute><WaterTracker /></ProtectedRoute>
          } />
          <Route path="/calories" element={
            <ProtectedRoute><CaloriesTracker /></ProtectedRoute>
          } />
          <Route path="/workout" element={
            <ProtectedRoute><WorkoutTracker /></ProtectedRoute>
          } />
          <Route path="/ai" element={
            <ProtectedRoute><AISuggestions /></ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;