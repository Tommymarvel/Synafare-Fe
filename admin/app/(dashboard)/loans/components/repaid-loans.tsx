// app/(loans)/components/RepaidLoanTable.tsx
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
import { STATUSCONST } from '@/lib/constants';
import { Loan } from '../types';
import EmptyList from '../../loan-requests/components/empty-list';
import { fmtDate, fmtNaira } from '@/lib/format';

type Props = { data: Loan[] };

export default function RepaidLoanTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <EmptyList
        title="No Repaid Loans"
        message="No loans have been completed yet."
        src="/empty-loan.svg"
      />
    );
  }

  const repaid = data.filter((l) => l.loanStatus === STATUSCONST.COMPLETED);

  if (repaid.length === 0) {
    return (
      <EmptyList
        title="No Repaid Loans"
        message="No loans have been completed yet."
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
        {repaid.map((loan) => (
          <TableRow
            className="border-b border-b-gray-200 text-resin-black"
            key={loan.id}
          >
            <TableCell className="p-6">
              <p className="text-gray-900 font-medium">
                {loan.customerName?.trim() && loan.customerName !== '-'
                  ? loan.customerName
                  : loan.userFirstName && loan.userLastName
                  ? `${loan.userFirstName} ${loan.userLastName}`
                  : '---'}
              </p>
              <p className="text-gray-500">
                {' '}
                {loan.customerEmail?.trim() && loan.customerEmail !== '-'
                  ? loan.userEmail
                  : '---'}
              </p>
            </TableCell>
            <TableCell className="p-6">{fmtNaira(loan.loanAmount)}</TableCell>
            <TableCell className="p-6">
              {fmtNaira(loan.outstandingBalance)}
            </TableCell>
            <TableCell className="p-6">
              {' '}
              {fmtDate(loan.dateRequested)}
            </TableCell>
            <TableCell className="p-6">
              {loan.loanDurationInMonths} months
            </TableCell>
            <TableCell className="p-6">
              {fmtDate(loan.nextPaymentDate) || '---'}
            </TableCell>
            <TableCell className="p-6">
              <Status status={loan.loanStatus} />
            </TableCell>
            <TableCell className="text-[#E2A109] p-6">
              <a href={'/loans/' + loan.id}> View</a>
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
