// =============================================
// components/ProtectedRoute.jsx
// Protects pages from unauthenticated users
// =============================================
// If user is not logged in → redirect to login page
// If user is logged in → show the page

import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  // If not logged in → go to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in → show the protected page
  return children;
};

export default ProtectedRoute;