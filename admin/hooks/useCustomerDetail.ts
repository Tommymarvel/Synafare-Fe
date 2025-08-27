import useSWR from 'swr';
import { CustomersService, RawCustomer } from '@/lib/services/customersService';

export interface CustomerDetail {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  dateJoined: string;
}

function formatDate(iso?: string): string {
  if (!iso) return '---';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return '---';
  }
}

export function useCustomerDetail(ownerUserId?: string, customerId?: string) {
  const { data, error, isLoading } = useSWR(
    ownerUserId ? ['/customers', ownerUserId] : null,
    () => CustomersService.getCustomersByUser(ownerUserId as string)
  );

  const raw: RawCustomer | undefined = (data?.data || []).find(
    (c: RawCustomer) => c._id === customerId
  );

  const detail: CustomerDetail | null = raw
    ? {
        id: raw._id,
        name: raw.customer_name,
        email: raw.customer_email,
        phoneNumber: raw.customer_phn,
        dateJoined: formatDate(
          raw.date_joined || raw.createdAt || raw.updatedAt
        ),
      }
    : null;

  return { detail, loading: isLoading, error };
}
