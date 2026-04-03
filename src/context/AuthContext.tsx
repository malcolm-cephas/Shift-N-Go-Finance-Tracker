'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { useUser, Auth0Provider } from '@auth0/nextjs-auth0';
import { isAuth0ConfiguredClient } from '@/lib/auth0-client';
import { getUserRole, type UserRole } from '@/lib/roles';

interface AuthContextType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
  isLoading: boolean;
  isAuthConfigured: boolean;
  role: UserRole;
  canClaim: boolean;
  refreshRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // If Auth0 is not configured, skip the Auth0Provider and return mock context
  if (!isAuth0ConfiguredClient) {
    return (
      <AuthContext.Provider value={{ user: null, error: null, isLoading: false, isAuthConfigured: false, role: 'ADMIN', canClaim: false, refreshRole: async () => {} }}>
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
  const { user, error, isLoading: isAuthLoading } = useUser();
  const [dbRole, setDbRole] = useState<UserRole>('UNAUTHORIZED');
  const [canClaim, setCanClaim] = useState(false);
  const [isRoleLoading, setIsRoleLoading] = useState(true);

  async function fetchRole() {
    if (user) {
      try {
        const res = await fetch('/api/users/me');
        const data = await res.json();
        setDbRole(data.role || 'UNAUTHORIZED');
        setCanClaim(data.canClaim || false);
      } catch (err) {
        console.error('Failed to fetch role:', err);
        setDbRole('UNAUTHORIZED');
      } finally {
        setIsRoleLoading(false);
      }
    } else {
      setIsRoleLoading(false);
    }
  }

  useEffect(() => {
    if (!isAuthLoading) {
      fetchRole();
    }
  }, [user, isAuthLoading]);

  const isLoading = isAuthLoading || isRoleLoading;

  return (
    <AuthContext.Provider value={{ user, error, isLoading, isAuthConfigured: true, role: dbRole, canClaim, refreshRole: fetchRole }}>
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



