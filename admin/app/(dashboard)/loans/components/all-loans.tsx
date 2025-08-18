// app/(loans)/components/AllLoansTable.tsx
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/pagination';
import Status from '@/components/status';
import { Loan } from '../types';
import EmptyList from '../../loan-requests/components/empty-list';

const fmtNaira = (n: number) =>
  new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(
    n ?? 0
  );

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('en-NG') : '—';

type Props = { data: Loan[] };

export default function AllLoansTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <EmptyList
        title="No Loan Request"
        message="You do not have any loan request"
        src="/empty-loan.svg"
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-200 py-3 px-6 border-none">
          <TableHead className="py-[13px] ps-6">Name</TableHead>
          <TableHead className="py-[13px] ps-6">Loan Amount</TableHead>
          <TableHead className="py-[13px] ps-6">Amount Due</TableHead>
          <TableHead className="py-[13px] ps-6">Date Requested</TableHead>
          <TableHead className="py-[13px] ps-6">Duration</TableHead>
          <TableHead className="py-[13px] ps-6">Next Payment</TableHead>
          <TableHead className="py-[13px] ps-6">Status</TableHead>
          <TableHead className="py-[13px] ps-6">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((loan) => (
          <TableRow
            className="border-b border-b-gray-200 text-resin-black"
            key={loan.id}
          >
            <TableCell className="p-6">
              <p className="text-gray-900 font-medium">{loan.customerName}</p>
              <p className="text-gray-500">{loan.customerEmail}</p>
            </TableCell>

            <TableCell className="p-6">{fmtNaira(loan.loanAmount)}</TableCell>
            <TableCell className="p-6">
              {fmtNaira(loan.outstandingBalance)}
            </TableCell>
            <TableCell className="p-6">{fmtDate(loan.dateRequested)}</TableCell>
            <TableCell className="p-6">
              {loan.loanDurationInMonths} months
            </TableCell>
            <TableCell className="p-6">
              {loan.nextPaymentDate ? fmtDate(loan.nextPaymentDate) : 'N/A'}
            </TableCell>
            <TableCell className="p-6">
              <Status status={loan.loanStatus} />
            </TableCell>
            <TableCell className="text-[#E2A109] p-6 cursor-pointer">
              View
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <TableFooter className="border-t border-t-gray-200">
        <TableRow>
          <TableCell colSpan={8} className="px-6 py-6">
            <Pagination />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
