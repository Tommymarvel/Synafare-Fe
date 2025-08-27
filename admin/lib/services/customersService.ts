import api from '@/lib/axiosInstance';

export interface RawCustomer {
  _id: string;
  customer_name: string;
  customer_email: string;
  customer_phn: string;
  user: string;
  date_joined?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomersAPIResponse {
  data: RawCustomer[];
  meta?: unknown;
}

export class CustomersService {
  static async getCustomersByUser(
    userId: string
  ): Promise<CustomersAPIResponse> {
    const { data } = await api.get(`/customer/admin/view/${userId}`);
    return data as CustomersAPIResponse;
  }
}
