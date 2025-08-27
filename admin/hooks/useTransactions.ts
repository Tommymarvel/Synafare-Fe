import useSWR from 'swr';
import { useMemo } from 'react';
import {
  TransactionsService,
  APITransaction,
} from '@/lib/services/transactionsService';
import { WalletTransactions } from '@/types/market.place.types';
import { STATUSCONST, TRANSACTIONTYPE } from '@/lib/constants';

function mapType(
  apiType: string
): WalletTransactions['transactionType'] | string {
  switch (apiType) {
    case 'down_payment':
      return TRANSACTIONTYPE.DOWNPAYMENT;
    case 'loan_disbursment':
      return TRANSACTIONTYPE.LOANDISBURSAL;
    case 'loan_repayment':
      return TRANSACTIONTYPE.LOANREPAYMENT;
    default:
      return apiType;
  }
}

function mapStatus(s: string): WalletTransactions['status'] {
  if (s === 'successful') return STATUSCONST.SUCCESS;
  return STATUSCONST.PENDING;
}

function mapTrx(t: APITransaction): WalletTransactions {
  return {
    id: t._id,
    date: t.trx_date || t.createdAt || '---',
    name: t.user || '---',
    transactionType: mapType(
      t.trx_type
    ) as WalletTransactions['transactionType'],
    transactionRef: t.ref_id || t.trx_id || '---',
    channel: '---',
    amount: t.trx_amount ?? 0,
    status: mapStatus(t.trx_status),
  };
}

export function useTransactions(page = 1, limit = 10) {
  const key = ['transactions', page, limit] as const;
  const { data, error, isLoading, mutate } = useSWR(key, () =>
    TransactionsService.getAll({ page, limit })
  );

  const items: WalletTransactions[] = useMemo(
    () => data?.data?.map(mapTrx) ?? [],
    [data]
  );
  const meta = useMemo(
    () => data?.meta ?? { total: 0, page, limit, totalPages: 0 },
    [data, page, limit]
  );

  return { items, meta, isLoading, error, refresh: mutate };
}
