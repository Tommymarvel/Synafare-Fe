import { Transaction } from "@/hooks/useDashboard";
import { format } from "date-fns";

interface CashflowDataPoint {
  month: string;
  inflow: number;
  outflow: number;
}

export function transformCashflow(transactions: Transaction[]): CashflowDataPoint[] {
  const grouped: Record<string, { inflow: number; outflow: number }> = {};

  transactions.forEach((trx) => {
    const month = format(new Date(trx.createdAt), "MMM"); // "Jan", "Feb", etc.
    if (!grouped[month]) {
      grouped[month] = { inflow: 0, outflow: 0 };
    }

    if (trx.trx_type === "fund_wallet") {
      grouped[month].inflow += trx.trx_amount;
    } else if (trx.trx_type === "withdrawal") {
      grouped[month].outflow += trx.trx_amount;
    }
  });

  return Object.entries(grouped).map(([month, { inflow, outflow }]) => ({
    month,
    inflow,
    outflow,
  }));
}
