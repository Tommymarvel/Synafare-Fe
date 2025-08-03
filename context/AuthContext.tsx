// context/AuthContext.tsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import axios, { AxiosError } from 'axios';
import axiosInstance from '@/lib/axiosInstance';

interface User {
  id: string;
  email: string;
  bvn: string;
  cacFile: string;
  business_document: string;
}

interface WhoAmIResponse {
  data: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWhoAmI = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<WhoAmIResponse>('/auth/whoami');
      setUser(response.data.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(
          axiosErr.response?.data?.message ??
            axiosErr.message ??
            'Failed to fetch user'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchWhoAmI();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser: fetchWhoAmI,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
