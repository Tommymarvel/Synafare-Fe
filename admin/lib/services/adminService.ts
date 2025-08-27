import axiosInstance from '@/lib/axiosInstance';

export interface AdminPermissionsModule {
  view?: boolean;
  manage?: boolean;
}

export interface AdminPermissions {
  users?: AdminPermissionsModule;
  loans?: AdminPermissionsModule;
  invoices?: AdminPermissionsModule;
  marketplace?: AdminPermissionsModule;
  transactions?: AdminPermissionsModule;
  team_members?: AdminPermissionsModule;
  // allow custom modules as well
  [k: string]: AdminPermissionsModule | undefined;
}

export interface AdminUser {
  _id: string;
  firebaseUid: string;
  email: string;
  email_confirmed: boolean;
  first_name?: string;
  last_name?: string;
  account_status: string;
  business_document: string;
  loan_agreement: string;
  role: string;
  permissions?: AdminPermissions;
  createdAt: string;
  updatedAt: string;
  phn_no?: string;
}

export interface AdminListResponse {
  message: string;
  currentPage: number;
  totalPages: number;
  totalAdmins: number;
  admins: AdminUser[];
}

export async function getAdmins(params?: { page?: number; limit?: number }) {
  const res = await axiosInstance.get<AdminListResponse>('/admin/all', {
    params,
  });
  return res.data;
}

export interface CreateAdminPayload {
  email: string;
  role: 'admin' | 'admin_operations' | 'admin_finance' | 'admin_custom';
  permissions?: AdminPermissions;
  first_name?: string;
  last_name?: string;
  phn_no?: string;
}

export async function createAdmin(payload: CreateAdminPayload) {
  const res = await axiosInstance.post('/auth/create/admin', payload);
  return res.data as { message?: string };
}
