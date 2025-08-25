import useSWR from 'swr';
import { useState, useMemo } from 'react';
import { UsersService, UsersQueryParams } from '@/lib/services/usersService';
import { UsersAPIResponse, APIUser, AllUsers } from '@/types/usertypes';
import {
  transformUsersData,
  filterUsersByVerificationStatus,
  getVerificationRequestsCount,
  getVerifiedUsersCount,
} from '@/lib/utils/userUtils';

interface UseUsersOptions extends UsersQueryParams {
  revalidateOnFocus?: boolean;
  refreshInterval?: number;
}

interface UseUsersReturn {
  // Data
  users: AllUsers[];
  rawUsers: APIUser[];
  verificationRequests: AllUsers[];
  verifiedUsers: AllUsers[];

  // Counts
  totalUsers: number;
  verificationRequestsCount: number;
  verifiedUsersCount: number;

  // Meta
  meta: UsersAPIResponse['meta'] | undefined;

  // State
  loading: boolean;
  error: Error | null;

  // Actions
  refresh: () => void;
  mutate: (data?: UsersAPIResponse) => void;
}

export function useUsers(options: UseUsersOptions = {}): UseUsersReturn {
  const [queryParams] = useState<UsersQueryParams>({
    page: options.page || 1,
    limit: options.limit || 10,
    ...options,
  });

  const swrKey = useMemo(() => {
    return ['users', queryParams];
  }, [queryParams]);

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => UsersService.getAllUsers(queryParams),
    {
      revalidateOnFocus: options.revalidateOnFocus ?? false,
      refreshInterval: options.refreshInterval,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  // Transform and filter data
  const processedData = useMemo(() => {
    if (!data?.data) {
      return {
        users: [],
        rawUsers: [],
        verificationRequests: [],
        verifiedUsers: [],
        totalUsers: 0,
        verificationRequestsCount: 0,
        verifiedUsersCount: 0,
      };
    }

    const rawUsers = data.data;
    const users = transformUsersData(rawUsers);

    // Filter users by verification status
    const needsVerificationUsers = filterUsersByVerificationStatus(
      rawUsers,
      true
    );
    const verifiedUsersRaw = filterUsersByVerificationStatus(rawUsers, false);

    const verificationRequests = transformUsersData(needsVerificationUsers);
    const verifiedUsers = transformUsersData(verifiedUsersRaw);

    return {
      users,
      rawUsers,
      verificationRequests,
      verifiedUsers,
      totalUsers: rawUsers.length,
      verificationRequestsCount: getVerificationRequestsCount(rawUsers),
      verifiedUsersCount: getVerifiedUsersCount(rawUsers),
    };
  }, [data]);

  const refresh = () => {
    mutate();
  };

  return {
    ...processedData,
    meta: data?.meta,
    loading: isLoading,
    error,
    refresh,
    mutate,
  };
}

// Hook for fetching a single user
export function useUser(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? ['user', userId] : null,
    () => UsersService.getUserById(userId),
    {
      revalidateOnFocus: false,
      errorRetryCount: 3,
    }
  );

  return {
    user: data,
    loading: isLoading,
    error,
    refresh: () => mutate(),
    mutate,
  };
}

// Hook for searching users
export function useUserSearch(
  searchTerm: string,
  options: Omit<UseUsersOptions, 'search'> = {}
) {
  const [isSearching, setIsSearching] = useState(false);

  const swrKey = useMemo(() => {
    return searchTerm ? ['users-search', searchTerm, options] : null;
  }, [searchTerm, options]);

  const { data, error, isLoading, mutate } = useSWR(
    swrKey,
    () => {
      setIsSearching(true);
      return UsersService.searchUsers(searchTerm, options).finally(() => {
        setIsSearching(false);
      });
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 2000, // Prevent too frequent searches
    }
  );

  const processedData = useMemo(() => {
    if (!data?.data) {
      return {
        users: [],
        rawUsers: [],
        totalUsers: 0,
      };
    }

    const rawUsers = data.data;
    const users = transformUsersData(rawUsers);

    return {
      users,
      rawUsers,
      totalUsers: rawUsers.length,
    };
  }, [data]);

  return {
    ...processedData,
    meta: data?.meta,
    loading: isLoading || isSearching,
    error,
    refresh: () => mutate(),
    mutate,
  };
}
