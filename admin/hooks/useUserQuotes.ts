import useSWR from 'swr';
import { QuotesService, RawQuoteRequest } from '@/lib/services/quotesService';
import { QuoteRequest, QuoteRequestStatus } from '@/types/usertypes';
import { STATUSCONST } from '@/lib/constants';

function formatDate(iso?: string): string {
  if (!iso) return '---';
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return '---';
  }
}

function mapStatus(s?: string): QuoteRequestStatus {
  const k = (s || '').toLowerCase();
  switch (k) {
    case 'accepted':
      return STATUSCONST.ACCEPTED;
    case 'rejected':
      return STATUSCONST.REJECTED;
    case 'delivered':
      return STATUSCONST.DELIVERED;
    case 'negotiated':
      return STATUSCONST.NEGOTIATED;
    case 'quote sent':
    case 'quotesent':
      return STATUSCONST.QUOTESENT;
    case 'pending':
    default:
      return STATUSCONST.PENDING;
  }
}

export function useUserQuotes(userId?: string) {
  const { data, error, isLoading } = useSWR(
    userId ? ['/quotes', userId] : null,
    () => QuotesService.getQuoteRequestsByUser(userId as string)
  );

  const quotes: QuoteRequest[] = (data?.data || []).map(
    (q: RawQuoteRequest): QuoteRequest => ({
      id: q._id,
      customer:
        `${q.user?.first_name || ''} ${q.user?.last_name || ''}`.trim() ||
        q.user?.email ||
        '---',
      quantity: q.items?.reduce((sum, it) => sum + (it.quantity || 0), 0) || 0,
      quoteSent:
        q.offerHistory?.find((h) => typeof h.amount_recieved === 'number')
          ?.amount_recieved ?? null,
      counterAmount:
        q.offerHistory
          ?.slice()
          .reverse()
          .find((h) => typeof h.counter_amount === 'number')?.counter_amount ??
        null,
      dateRequested: formatDate(q.createdAt || q.updatedAt),
      status: mapStatus(q.status),
    })
  );

  const rawQuotes = (data?.data || []) as RawQuoteRequest[];
  return { quotes, rawQuotes, loading: isLoading, error };
}
