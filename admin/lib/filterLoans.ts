import { DateRangePreset } from '@/app/(dashboard)/loan-requests/components/loan-table-wrapper';
import { LoanStatusFilter, STATUS_KEY_BY_LABEL } from '@/lib/status-types';

// helper to compute start date
function fromDate(range: DateRangePreset): Date | null {
  const now = new Date();

  if (range === '1') {
    // Today - start of today
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (range === '2') {
    // Yesterday - start of yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    return new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );
  }
  if (range === '7') return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  if (range === '30') return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  if (range === '90') return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return null;
}

// helper to compute end date for exact day matches
function toDate(range: DateRangePreset): Date | null {
  const now = new Date();

  if (range === '1') {
    // Today - end of today
    const endOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    endOfToday.setHours(23, 59, 59, 999);
    return endOfToday;
  }
  if (range === '2') {
    // Yesterday - end of yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const endOfYesterday = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );
    endOfYesterday.setHours(23, 59, 59, 999);
    return endOfYesterday;
  }
  return null;
}

export function filterLoans<
  T extends {
    loanStatus?: string;
    createdAt?: string;
    id?: string;
    userFirstName?: string;
    userLastName?: string;
    loanAmount?: number;
  }
>(
  loans: T[],
  opts: { q: string; status: LoanStatusFilter; range: DateRangePreset }
): T[] {
  const q = opts.q.trim().toLowerCase();
  const from = fromDate(opts.range);
  const to = toDate(opts.range);

  return loans.filter((loan) => {
    // map label -> key (so "Pending" → "PENDING")
    const loanStatusKey = loan.loanStatus
      ? STATUS_KEY_BY_LABEL[loan.loanStatus]
      : undefined;

    const searchable = `${loan.id ?? ''} ${loan.userFirstName ?? ''} ${
      loan.userLastName ?? ''
    } ${loan.loanAmount ?? ''}`.toLowerCase();

    const created = loan.createdAt ? new Date(loan.createdAt) : null;

    const matchesSearch = q ? searchable.includes(q) : true;
    const matchesStatus =
      opts.status === 'ALL' ? true : loanStatusKey === opts.status;

    let matchesDate = true;
    if (from && created instanceof Date && !isNaN(created.getTime())) {
      if (to) {
        // Exact day range (today or yesterday)
        matchesDate = created >= from && created <= to;
      } else {
        // Last X days range
        matchesDate = created >= from;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });
}
