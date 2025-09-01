import { LoanStatusFilter, STATUS_KEY_BY_LABEL } from '@/lib/status-types';

// helper to compute start date based on string range
function getDateRange(range: string): { from: Date | null; to: Date | null } {
  const now = new Date();
  
  switch (range) {
    case 'today': {
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      return { from: startOfDay, to: endOfDay };
    }
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const startOfDay = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      const endOfDay = new Date(startOfDay);
      endOfDay.setHours(23, 59, 59, 999);
      return { from: startOfDay, to: endOfDay };
    }
    case 'last_7_days': {
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return { from, to: null };
    }
    case 'last_30_days': {
      const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return { from, to: null };
    }
    case 'last_90_days': {
      const from = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
      return { from, to: null };
    }
    default:
      return { from: null, to: null };
  }
}

export function filterLoans<
  T extends {
    loanStatus?: string;
    createdAt?: string;
    dateRequested?: string;
    id?: string;
    userFirstName?: string;
    userLastName?: string;
    loanAmount?: number;
  }
>(loans: T[], opts: { q: string; status: LoanStatusFilter; dateRange?: string }): T[] {
  const q = opts.q.trim().toLowerCase();
  const { from, to } = opts.dateRange ? getDateRange(opts.dateRange) : { from: null, to: null };

  return loans.filter((loan) => {
    // map label -> key (so "Pending" → "PENDING")
    const loanStatusKey = loan.loanStatus
      ? STATUS_KEY_BY_LABEL[loan.loanStatus]
      : undefined;

    const searchable = `${loan.id ?? ''} ${loan.userFirstName ?? ''} ${
      loan.userLastName ?? ''
    } ${loan.loanAmount ?? ''}`.toLowerCase();

    // Try both createdAt and dateRequested for date filtering
    const dateField = loan.createdAt || loan.dateRequested;
    const created = dateField ? new Date(dateField) : null;

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
