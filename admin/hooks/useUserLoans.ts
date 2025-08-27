import useSWR from 'swr';
import { LoansService, APILoanItem } from '@/lib/services/loansService';
import { STATUSCONST } from '@/lib/constants';
import { UserLoanRecord } from '@/types/usertypes';

function toStatusConst(api: APILoanItem): UserLoanRecord['status'] {
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

function formatCurrency(n?: number) {
  if (n === undefined || n === null) return '---';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(n);
}

function transformLoan(item: APILoanItem): UserLoanRecord {
  const name =
    `${item.user?.first_name ?? ''} ${item.user?.last_name ?? ''}`.trim() ||
    (item.user?.email ?? '---');
  return {
    id: item._id,
    name,
    email: item.user?.email ?? '---',
    transactionCost: formatCurrency(item.transaction_cost),
    loanAmount: formatCurrency(item.loan_amount ?? item.loan_amount_requested),
    dateRequested: item.createdAt
      ? new Date(item.createdAt).toLocaleDateString()
      : '---',
    duration: item.loan_duration_in_months
      ? `${item.loan_duration_in_months} months`
      : '---',
    nextPayment: item.next_payment
      ? new Date(item.next_payment).toLocaleDateString()
      : undefined,
    status: toStatusConst(item),
  } as UserLoanRecord;
}

export function useUserLoans(userId?: string) {
  const key = userId ? ['user-loans', userId] : null;
  const { data, error, isLoading, mutate } = useSWR(key, () =>
    LoansService.getLoansByUser(userId as string)
  );

  const records: UserLoanRecord[] = (data || []).map(transformLoan);

  return {
    loans: records,
    loading: isLoading,
    error,
    refresh: () => mutate(),
  };
}
