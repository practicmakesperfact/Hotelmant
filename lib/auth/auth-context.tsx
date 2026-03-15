'use client';

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import type { User, UserRole } from '@/lib/types';
import { login as authLogin, verifyToken, getDashboardRoute, hasPermission } from './index';
import { getUserById } from '@/lib/mock-data';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkPermission: (permission: string) => boolean;
  getDashboard: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'habesha_hotel_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        // First check mock users
        let foundUser = getUserById(decoded.userId);
        // If not found, check localStorage registered users
        if (!foundUser) {
          try {
            const storedUsers = JSON.parse(localStorage.getItem('habesha_hotel_users') || '[]');
            foundUser = storedUsers.find((u: any) => u.id === decoded.userId);
          } catch {}
        }
        if (foundUser) {
          setUser(foundUser);
        } else {
          localStorage.removeItem(TOKEN_KEY);
        }
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = authLogin(email, password);
    
    if (result.success && result.token && result.user) {
      localStorage.setItem(TOKEN_KEY, result.token);
      setUser(result.user);
      return { success: true };
    }
    
    return { success: false, error: result.error };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const checkPermission = useCallback((permission: string) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  }, [user]);

  const getDashboard = useCallback(() => {
    if (!user) return '/login';
    return getDashboardRoute(user.role);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkPermission,
        getDashboard,
      }}
    >
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

// HOC for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles?: UserRole[]
) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      );
    }

    if (!isAuthenticated) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return null;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      if (typeof window !== 'undefined') {
        window.location.href = getDashboardRoute(user.role);
      }
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
