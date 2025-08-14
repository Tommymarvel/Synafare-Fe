export interface CustomerAPI {
  _id: string;
  customer_name: string;
  customer_email: string;
  customer_phn: string;
  date_joined?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CustomersListResponse {
  data: CustomerAPI[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export function toCustomer(api: CustomerAPI): Customer {
  return {
    id: api._id,
    name: api.customer_name,
    email: api.customer_email,
    phone: api.customer_phn,
    createdAt: api.date_joined ?? api.createdAt ?? new Date().toISOString(),
  };
}

export interface Invoice {
  id: string;
  customerId: string;
  customerName: string;
  amount: number;
  dateIssued: string; // ISO
  dueDate: string; // ISO
  status: 'PENDING' | 'PAID';
  issueDate?: Date; // ISO
  customerEmail?: string;
}