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

interface Permissions {
  users: {
    view: boolean;
    manage: boolean;
  };
  loans: {
    view: boolean;
    manage: boolean;
  };
  invoices: {
    view: boolean;
    manage: boolean;
  };
  marketplace: {
    view: boolean;
    manage: boolean;
  };
  transactions: {
    view: boolean;
    manage: boolean;
  };
  team_members: {
    view: boolean;
    manage: boolean;
  };
}

interface User {
  _id: string;
  __v: number;
  account_status: string; // e.g. "inactive"
  business_document: string; // e.g. "submitted"
  bvn?: string; // e.g. "22222222222"
  createdAt: string; // ISO date
  email: string;
  email_confirmed: boolean;
  firebaseUid: string;
  first_name: string;
  id_number?: string; // e.g. "70123456789"
  id_type?: string; // e.g. "nin"
  last_name: string;
  loan_agreement: string; // e.g. "not_signed"
  nature_of_solar_business?: string; // e.g. "distributor"
  phn_no?: string; // e.g. "+2349028990916"
  updatedAt: string;
  wallet_balance?: number; // e.g. 10000
  role: string;
  avatar?: string; // Profile picture URL
  permissions: Permissions;
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
  hasPermission: (
    module: keyof Permissions,
    action: 'view' | 'manage'
  ) => boolean;
  canView: (module: keyof Permissions) => boolean;
  canManage: (module: keyof Permissions) => boolean;
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

  const hasPermission = (
    module: keyof Permissions,
    action: 'view' | 'manage'
  ): boolean => {
    if (!user || !user.permissions) return false;
    return user.permissions[module]?.[action] ?? false;
  };

  const canView = (module: keyof Permissions): boolean => {
    return hasPermission(module, 'view');
  };

  const canManage = (module: keyof Permissions): boolean => {
    return hasPermission(module, 'manage');
  };

  const logout = async (): Promise<void> => {
    try {
      await axiosInstance.post('/auth/logout');
      localStorage.removeItem('authToken');
      await refreshUser(); // Clear SWR cache
      // Redirect will be handled by the component calling logout
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
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
        hasPermission,
        canView,
        canManage,
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
