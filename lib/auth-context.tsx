'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { tokenStorage } from './api';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('linkee_user');
    if (storedUser && tokenStorage.getAccessToken()) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('linkee_user');
      }
    }
    setIsLoading(false);
  }, []);

  const logout = () => {
    tokenStorage.clearTokens();
    localStorage.removeItem('linkee_user');
    setUser(null);
  };

  const handleSetUser = (newUser: User | null) => {
    setUser(newUser);
    if (newUser) {
      localStorage.setItem('linkee_user', JSON.stringify(newUser));
    } else {
      localStorage.removeItem('linkee_user');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        setUser: handleSetUser,
        logout,
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
