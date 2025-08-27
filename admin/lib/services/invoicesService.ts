import axiosInstance from '@/lib/axiosInstance';

export interface APIInvoiceItem {
  _id: string;
  receipient?: {
    _id: string;
    customer_name?: string;
    customer_email?: string;
  };
  issue_date?: string;
  invoice_number?: number;
  due_date?: string;
  subtotal?: number;
  discount?: number;
  total?: number;
  status?: string;
  owner?: string;
  createdAt?: string;
  updatedAt?: string;
  tax?: number;
}

export interface APIInvoicesResponse {
  data: APIInvoiceItem[];
  meta: {
    total_invoices: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export class InvoicesService {
  static async getInvoicesByCustomer(customerId: string) {
    const { data } = await axiosInstance.get<APIInvoicesResponse>(
      `/invoice/admin/cusinvoice/${customerId}`
    );
    return data;
  }

  static async getInvoicesByUser(userId: string) {
    const { data } = await axiosInstance.get<APIInvoicesResponse>(
      `/invoice/admin/userInvoice/${userId}`
    );
    return data;
  }
}
