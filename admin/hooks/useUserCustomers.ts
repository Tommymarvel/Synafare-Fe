import useSWR from 'swr';
import { CustomersService, RawCustomer } from '@/lib/services/customersService';
import { UserCustomer } from '@/types/usertypes';

function formatDate(iso?: string): string {
  if (!iso) return '---';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return '---';
  }
}

export function useUserCustomers(userId?: string) {
  const { data, error, isLoading } = useSWR(
    userId ? ['/customers', userId] : null,
    () => CustomersService.getCustomersByUser(userId as string)
  );

  const customers: UserCustomer[] = (data?.data || []).map(
    (c: RawCustomer): UserCustomer => ({
      id: c._id,
      name: c.customer_name,
      email: c.customer_email,
      phoneNumber: c.customer_phn,
      dateAdded: formatDate(c.date_joined || c.createdAt || c.updatedAt),
    })
  );

  return { customers, loading: isLoading, error };
}
