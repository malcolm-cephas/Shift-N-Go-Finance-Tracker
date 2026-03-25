'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUser, Auth0Provider } from '@auth0/nextjs-auth0';
import { isAuth0ConfiguredClient } from '@/lib/auth0-client';

interface AuthContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  isLoading: boolean;
  isAuthConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // If Auth0 is not configured, skip the Auth0Provider and return mock context
  if (!isAuth0ConfiguredClient) {
    return (
      <AuthContext.Provider value={{ user: null, error: null, isLoading: false, isAuthConfigured: false }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <Auth0Provider>
      <AuthContextWrapper>{children}</AuthContextWrapper>
    </Auth0Provider>
  );
}

function AuthContextWrapper({ children }: { children: ReactNode }) {
  const { user, error, isLoading } = useUser();

  return (
    <AuthContext.Provider value={{ user, error, isLoading, isAuthConfigured: true }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}



