import useSWR from 'swr';
import { LoansService, APILoanItem } from '@/lib/services/loansService';
import { STATUSCONST } from '@/lib/constants';
import { UserLoanRecord } from '@/types/usertypes';

function toStatus(api: APILoanItem): UserLoanRecord['status'] {
  switch (api.loan_status) {
    case 'active':
      return STATUSCONST.ACTIVE;
    case 'completed':
      return STATUSCONST.COMPLETED;
    case 'overdue':
      return STATUSCONST.OVERDUE;
    case 'awaiting_downpayment':
      return STATUSCONST.AWAITING_DOWNPAYMENT;
    case 'awaiting_loan_disbursement':
      return STATUSCONST.AWAITING_LOAN_DISBURSEMENT;
    case 'offer_received':
      return STATUSCONST.OFFER_RECEIVED;
    default:
      return STATUSCONST.PENDING;
  }
}

function money(n?: number) {
  if (n === undefined || n === null) return '---';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(n);
}

type APICustomerLoanItem = APILoanItem & {
  customer?: {
    _id?: string;
    customer_name?: string;
    customer_email?: string;
  };
};

function mapLoan(item: APICustomerLoanItem): UserLoanRecord {
  const name = item.customer?.customer_name || '---';
  const email = item.customer?.customer_email || '---';
  return {
    id: item._id,
    name,
    email,
    transactionCost: money(item.transaction_cost),
    loanAmount: money(item.loan_amount ?? item.loan_amount_requested),
    dateRequested: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : '---',
    duration: item.loan_duration_in_months
      ? `${item.loan_duration_in_months} months`
      : '---',
    nextPayment: item.next_payment
      ? new Date(item.next_payment).toLocaleDateString()
      : undefined,
    status: toStatus(item),
  } as UserLoanRecord;
}

export function useCustomerLoans(userId?: string, customerId?: string) {
  const key =
    userId && customerId ? ['customer-loans', userId, customerId] : null;
  const { data, error, isLoading, mutate } = useSWR(key, () =>
    LoansService.getLoansByUserCustomer(userId as string, customerId as string)
  );

  const loans: UserLoanRecord[] = (data || []).map(mapLoan);

  return { loans, loading: isLoading, error, refresh: () => mutate() };
}
