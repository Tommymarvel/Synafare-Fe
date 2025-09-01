'use client';
import EmptyList from '@/app/(dashboard)/loan-requests/components/empty-list';
import { UserLoanRecord } from '@/types/usertypes';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Status from '@/components/status';
import Pagination from '@/components/pagination';
import { STATUSCONST } from '@/lib/constants';
import ViewOfferModal from './modals/view-offer';
import { useState } from 'react';

const UserLoanRequests = ({
  data,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: {
  data: UserLoanRecord[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) => {
  const [openOffer, setOpenOffer] = useState(false);
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
    <>
      <ViewOfferModal open={openOffer} onOpenChange={setOpenOffer} />
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 py-3 px-6 border-none">
            <TableHead className="py-[13px] ps-6">Customer</TableHead>
            <TableHead className="py-[13px] ps-6">Transaction Cost</TableHead>
            <TableHead className="py-[13px] ps-6">Loan Amount</TableHead>
            <TableHead className="py-[13px] ps-6">Date Requested</TableHead>
            <TableHead className="py-[13px] ps-6">Duration</TableHead>
            <TableHead className="py-[13px] ps-6">Next Payment</TableHead>
            <TableHead className="py-[13px] ps-6">Status</TableHead>
            <TableHead className="py-[13px] ps-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request) => (
            <TableRow
              className="border-b border-b-gray-200 text-resin-black"
              key={request.id}
            >
              <TableCell className="p-6">
                <p className="text-gray-900 font-medium">{request.name}</p>
                <p className="text-gray-500">{request.email}</p>
              </TableCell>
              <TableCell className="p-6">{request.transactionCost}</TableCell>
              <TableCell className="p-6">{request.loanAmount}</TableCell>
              <TableCell className="p-6">{request.dateRequested}</TableCell>
              <TableCell className="p-6">{request.duration}</TableCell>
              <TableCell className="p-6">
                {request.nextPayment ?? '---'}
              </TableCell>
              <TableCell className="p-6">
                <Status status={request.status} />
              </TableCell>
              <TableCell className="text-[#E2A109] p-6">
                {request.status == STATUSCONST.OFFER_RECEIVED ? (
                  <button onClick={() => setOpenOffer(true)}>View</button>
                ) : (
                  <a href={'/loan-requests/' + request.id}>View</a>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="border-t border-t-gray-200">
          <TableRow>
            <TableCell colSpan={8} className="p-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onPrevious={onPrevious}
                onNext={onNext}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

export default UserLoanRequests;
