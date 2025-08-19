import { DateRangePreset } from '@/app/(dashboard)/loan-requests/components/loan-table-wrapper';
import {
  LoanStatusFilter,
  STATUS_KEY_BY_LABEL,
} from '@/lib/status-types';

// helper to compute start date
function fromDate(range: DateRangePreset): Date | null {
  if (range === '7') return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  if (range === '30') return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  if (range === '90') return new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
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
    const matchesDate =
      from && created instanceof Date && !isNaN(created.getTime())
        ? created >= from
        : true;

    return matchesSearch && matchesStatus && matchesDate;
  });
}
