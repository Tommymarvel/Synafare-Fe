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
import useSWR from 'swr';
import axiosInstance from '@/lib/axiosInstance';
import { swrGet } from '@/lib/swrFetcher';

interface BankDetails {
  bank_code: string;
  bank_name: string;
  acc_name: string;
  acc_no: string;
  set: boolean;
  _id: string;
}

interface User {
  _id: string;
  __v: number;
  available_credit: number;
  account_status: string; // e.g. "inactive"
  avatar?: string; // Profile picture URL
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
  loan_balance: number; // e.g. 10000
  role: string;
  bank_details?: BankDetails;
  business?: {
    _id: string;
    business_name: string;
    reg_number: string;
    cac_certificate: string;
    bank_statement: string;
    business_address: string;
    city: string;
    state: string;
    country: string;
    user: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    business_logo?: string; // Optional business logo field
  };
}

interface WhoAmIResponse {
  data: User;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  // Use SWR for whoami with 90-second revalidation
  const {
    data: user,
    error: swrError,
    isLoading: loading,
    mutate: refreshUser,
  } = useSWR<User>(
    '/auth/whoami',
    (url: string) => swrGet<WhoAmIResponse>(url).then((res) => res.data),
    {
      refreshInterval: 90000, // 90 seconds
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
      onError: (err: unknown) => {
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
      },
    }
  );

  // Clear error when data is successfully fetched
  useEffect(() => {
    if (user && !swrError) {
      setError(null);
    }
  }, [user, swrError]);

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('authToken');
      await refreshUser(); // Clear SWR cache
      // Redirect will be handled by the component calling logout
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('authToken');
      await refreshUser(); // Clear SWR cache
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        loading,
        error,
        refreshUser: async () => {
          await refreshUser();
        },
        logout,
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
