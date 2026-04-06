'use client';

import { ReactNode, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginPage from './LoginPage';
import { WelcomePage as WelcomeScreen } from '@/app/welcome/page';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading, isAuthConfigured, role, canClaim, refreshRole } = useAuth();
  const [isClaiming, setIsClaiming] = useState(false);

  async function handleClaim() {
    setIsClaiming(true);
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: user.email, 
          name: user.name, 
          bootstrap: true 
        }),
      });

      if (res.ok) {
        await refreshRole();
      } else {
        alert('Failed to claim ownership. Someone else may have already claimed it.');
      }
    } catch (_error) {
      alert('Network error during initialization');
    } finally {
      setIsClaiming(false);
    }
  }

  // If Auth0 is not configured, bypass login and show WelcomeScreen for new users
  if (!isAuthConfigured) {
    return <WelcomeScreen />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900 transition-colors duration-200">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 font-medium animate-pulse">Establishing Secure Session...</p>
        </div>
      </div>
    );
  }

  // BOOTSTRAP CASE: First time setup
  if (canClaim && user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl p-10 border border-neutral-100 dark:border-neutral-800 text-center">
          <div className="text-6xl mb-6">🏆</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">First Launch Detected</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 font-medium leading-relaxed">
            The dealership system is currently uninitialized. Would you like to claim **Owner Privileges (Admin)** for this account?
          </p>
          <div className="bg-neutral-50 dark:bg-neutral-800/50 p-4 rounded-2xl mb-8 border dark:border-neutral-700">
            <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1 text-left">Identity Detected</p>
            <p className="text-sm font-bold text-gray-800 dark:text-neutral-200 text-left truncate">{user.email}</p>
          </div>
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className="w-full bg-brand-red hover:bg-brand-red-dark text-white font-black py-4 rounded-2xl shadow-xl shadow-red-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isClaiming ? 'INITIALIZING...' : 'CLAIM ADMIN ACCESS'}
          </button>
        </div>
      </div>
    );
  }

  // AUTH PROTECTED CASE
  if (!user && !isLoading) {
    return <LoginPage />;
  }

  // ROLE AUTHENTICATION CASE
  if (allowedRoles && !allowedRoles.includes(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-md w-full bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl p-10 border border-neutral-100 dark:border-neutral-800 text-center">
          <div className="text-6xl mb-6">🚫</div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight mb-4">Access Restricted</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 font-medium leading-relaxed">
            Your current role (**{role}**) does not have permission to access this dealership unit.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/" className="bg-neutral-800 text-white font-bold py-3 rounded-xl hover:bg-neutral-700 transition-colors">
              Return to Summary
            </Link>
            <a href="/auth/logout" className="text-brand-red font-bold py-2 hover:underline">
              Sign in with different account
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
