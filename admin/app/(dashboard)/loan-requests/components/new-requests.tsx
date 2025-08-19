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
import ActionButton, { ActionType } from './action-button';
import Pagination from '@/components/pagination';
import EmptyList from './empty-list';
import { Loan } from '../../loans/types';
import { toast } from 'react-toastify';
import { useState } from 'react';
import axiosInstance from '@/lib/axiosInstance';

type Props = { data: Loan[] };

const currency = (n: number) =>
  typeof n === 'number' ? n.toLocaleString('en-NG', { maximumFractionDigits: 2 }) : String(n);

const NewRequests = ({ data }: Props) => {
  
  const [submitting, setSubmitting] = useState<string | null>(null); 

  async function acceptOffer(
    loanId: string,
    amountOffered: number,
    monthlyRate: number,
    action: ActionType
  ) {
    try {
      setSubmitting(loanId);

      await axiosInstance.patch(`/loan/admin/action/${loanId}`, {
        actionType: action,
        amountOffered,
        interest: monthlyRate,
      });

      toast.success(
        action === 'offer' ? 'Request accepted successfully' : 'Request declined successfully'
      );
      return true;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'An error occurred';
      toast.error(msg);
      return false;
    } finally {
      setSubmitting(null);
    }
  }

  if (!data || data.length < 1) {
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
          <TableHead className="py-[13px] ps-6">User Type</TableHead>
          <TableHead className="py-[13px] ps-6">Customer</TableHead>
          <TableHead className="py-[13px] ps-6">Loan Amount</TableHead>
          <TableHead className="py-[13px] ps-6">Date Requested</TableHead>
          <TableHead className="py-[13px] ps-6">Duration</TableHead>
          <TableHead className="py-[13px] ps-6">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((request) => {
          const {
            id,
            userFirstName,
            userLastName,
            customerName,
            loanAmount,
            dateRequested,
            loanDurationInMonths,
            interest,
          } = request;

          const isRowSubmitting = submitting === id;

          return (
            <TableRow className="border-b border-b-gray-200 text-resin-black" key={id}>
              <TableCell className="p-6">
                <p className="text-gray-900 font-medium capitalize">
                  {userFirstName} {userLastName}
                </p>
                <p className="text-gray-500">{id}</p>
              </TableCell>

              <TableCell className="p-6">------</TableCell>

              <TableCell className="p-6">{customerName ?? '—'}</TableCell>

              <TableCell className="p-6">₦{currency(loanAmount)}</TableCell>

              <TableCell className="p-6">
                {new Date(dateRequested).toLocaleString()}
              </TableCell>

              <TableCell className="p-6">{loanDurationInMonths} months</TableCell>

              <TableCell className="p-6">
                <ActionButton
                  id={id}
                  disabled={isRowSubmitting}
                  handleAction={(action) =>
                    acceptOffer(id, loanAmount, interest, action)
                  }
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>

      <TableFooter className="border-t border-t-gray-200">
        <TableRow>
          <TableCell colSpan={7} className="px-6 py-6">
            <Pagination />
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default NewRequests;
