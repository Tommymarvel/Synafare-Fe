import useSWR from 'swr';
import {
  InvoicesService,
  APIInvoiceItem,
} from '@/lib/services/invoicesService';
import { STATUSCONST } from '@/lib/constants';
import { Invoice } from '@/types/usertypes';

function toInvoiceStatus(status?: string): Invoice['status'] {
  if (!status) return STATUSCONST.PENDING;
  switch (status.toLowerCase()) {
    case 'paid':
      return STATUSCONST.PAID;
    default:
      return STATUSCONST.PENDING;
  }
}

export function useCustomerInvoices(customerId?: string) {
  const key = customerId ? ['customer-invoices', customerId] : null;
  const { data, error, isLoading, mutate } = useSWR(key, () =>
    InvoicesService.getInvoicesByCustomer(customerId as string)
  );

  const invoices: Invoice[] = (data?.data || []).map((row: APIInvoiceItem) => ({
    _id: String(row._id),
    invoiceId: String(row.invoice_number ?? row._id ?? '---'),
    customerName: row.receipient?.customer_name || '---',
    customerEmail: row.receipient?.customer_email || '---',
    issueDate: row.issue_date
      ? new Date(row.issue_date).toLocaleDateString()
      : '---',
    dueDate: row.due_date ? new Date(row.due_date).toLocaleDateString() : '---',
    amount: row.total ?? 0,
    status: toInvoiceStatus(row.status),
  }));

  return { invoices, loading: isLoading, error, refresh: () => mutate() };
}
