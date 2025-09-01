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

import { WalletTransactions } from '@/types/market.place.types';
import ViewTransactionReceipt from './modals/view-transaction';
import { useState } from 'react';
import Image from 'next/image';
import { fmtDate } from '@/lib/format';
const TransactionTable = ({
  data,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: {
  data: WalletTransactions[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) => {
  const [openModal, setOpenModal] = useState(true);
  const [currentReceipt, setCurrentReceipt] = useState<
    WalletTransactions | undefined
  >();

  if (!data.length) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="space-y-[10px]">
          <Image
            width={132}
            height={132}
            src="/coins.svg"
            className="mx-auto block"
            alt="No recent transactions"
          />
          <h1 className="text-gray-3 text-center italic">
            No recent transaction
          </h1>
        </div>
      </div>
    );
  }

  const handleShowReceipt = function (id: string) {
    const receipt = data.find((x) => x.id == id);
    if (!receipt) return;
    setCurrentReceipt(receipt);
    setOpenModal(true);
  };
  return (
    <>
      <ViewTransactionReceipt
        receipt={currentReceipt}
        open={openModal}
        onOpenChange={setOpenModal}
      />
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 py-3 px-6 border-none">
            <TableHead className="py-[13px] ps-6">Date</TableHead>
            <TableHead className="py-[13px] ps-6">Name</TableHead>
            <TableHead className="py-[13px] ps-6">Transaction Type</TableHead>
            <TableHead className="py-[13px] ps-6">Transaction Ref</TableHead>
            <TableHead className="py-[13px] ps-6">Amount</TableHead>
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
              <TableCell className="p-6 font-medium">
                {fmtDate(request.date)}
              </TableCell>
              <TableCell className="p-6 font-medium">{request.name}</TableCell>
              <TableCell className="p-6 font-medium">
                {request.transactionType}
              </TableCell>
              <TableCell className="p-6 font-medium">
                {request.transactionRef.length > 15
                  ? `${request.transactionRef.slice(0, 15)}...`
                  : request.transactionRef}
              </TableCell>
              <TableCell className="p-6 font-medium">
                {request.amount.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </TableCell>
              <TableCell className="p-6 font-medium">
                <Status status={request.status} />
              </TableCell>
              <TableCell
                onClick={() => handleShowReceipt(request.id)}
                className="cursor-pointer p-6 font-medium text-[#E2A109]"
              >
                View
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="border-t border-t-gray-200">
          <TableRow>
            <TableCell colSpan={7} className="px-6 py-6">
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

export default TransactionTable;
