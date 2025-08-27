'use client';
import useSWR from 'swr';
import { getAdmins, AdminUser } from '@/lib/services/adminService';

export function useAdmins(params?: { page?: number; limit?: number }) {
  const key = ['/admin/all', params?.page ?? 1, params?.limit ?? 20] as const;
  const { data, error, isLoading, mutate } = useSWR(key, async () => {
    return getAdmins({ page: params?.page, limit: params?.limit });
  });

  const admins: AdminUser[] = data?.admins ?? [];
  const meta = {
    currentPage: data?.currentPage ?? 1,
    totalPages: data?.totalPages ?? 1,
    totalAdmins: data?.totalAdmins ?? admins.length,
  };

  return { admins, meta, error, isLoading, mutate };
}
