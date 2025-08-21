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
  _id: string;
  __v: number;
  account_status: string; // e.g. "inactive"
  business_document: string; // e.g. "submitted"
  bvn: string; // e.g. "22222222222"
  createdAt: string; // ISO date
  email: string;
  email_confirmed: boolean;
  firebaseUid: string;
  first_name: string;
  id_number: string; // e.g. "70123456789"
  id_type: string; // e.g. "nin"
  last_name: string;
  loan_agreement: string; // e.g. "not_signed"
  nature_of_solar_business: string; // e.g. "distributor"
  phn_no: string; // e.g. "+2349028990916"
  updatedAt: string;
  wallet_balance: number; // e.g. 10000
  role: string
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
