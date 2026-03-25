'use client';

import { type ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/components/LoginPage';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthConfigured } = useAuth();

  // If Auth0 is not configured, bypass login and show WelcomeScreen for new users
  // This allows the app to work in offline-only mode for developers
  if (!isAuthConfigured) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg dark:shadow-neutral-900/50 p-6">
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-neutral-400 text-lg mb-4">Loading...</div>
            <p className="text-gray-400 dark:text-neutral-500">Please wait while we authenticate you.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;



