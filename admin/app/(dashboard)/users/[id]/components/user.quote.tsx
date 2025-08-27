'use client';
import EmptyList from '@/app/(dashboard)/loan-requests/components/empty-list';
import CardWrapper from '@/components/cardWrapper';
import Pagination from '@/components/pagination';
import SearchInput from '@/components/search.input';
import Status from '@/components/status';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUserQuotes } from '@/hooks/useUserQuotes';
import { RawQuoteRequest } from '@/lib/services/quotesService';
import { QuoteRequest } from '@/types/usertypes';
import { useParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import QuoteRequestModal from './modals/quote-request';

const UserQuote = ({ data }: { data: QuoteRequest[] }) => {
  const params = useParams();
  const userId = params?.id as string;
  const { rawQuotes } = useUserQuotes(userId);

  const [sent, setSent] = useState(false);
  const [openQuote, setOpenQuote] = useState(false);
  const [activeQuote, setActiveQuote] = useState<RawQuoteRequest | null>(null);

  const receivedIds = useMemo(() => {
    const ids = new Set<string>();
    for (const q of rawQuotes || []) {
      if (q?.supplier === userId && q?._id) ids.add(q._id);
    }
    return ids;
  }, [rawQuotes, userId]);

  const filteredData = useMemo(() => {
    const list = data || [];
    if (sent) return list.filter((r) => !receivedIds.has(r.id));
    return list.filter((r) => receivedIds.has(r.id));
  }, [data, sent, receivedIds]);

  return (
    <>
      <QuoteRequestModal
        open={openQuote}
        onOpenChange={setOpenQuote}
        quote={activeQuote ?? undefined}
      />

      <div className="flex gap-x-[10px] items-center mb-3">
        <button
          onClick={() => setSent(false)}
          className={
            ' block py-2 px-3 font-medium rounded-md ' +
            (!sent
              ? ' bg-[#FFF8E2] text-[#E2A109]'
              : 'border-gray-300 text-gray-3 border ')
          }
        >
          Received Quotes
        </button>
        <button
          onClick={() => setSent(true)}
          className={
            ' block py-2 px-3 font-medium rounded-md ' +
            (sent
              ? ' bg-[#FFF8E2] text-[#E2A109]'
              : 'border-gray-300 text-gray-3 border')
          }
        >
          Sent Quotes
        </button>
      </div>
      {filteredData.length < 1 ? (
        <CardWrapper className="px-[23px] py-3 rounded-lg">
          <UserQuoteHeader />
          <EmptyList
            title="No Quote Request"
            message="User does not have any quote request"
            src="/invoice.svg"
          />
        </CardWrapper>
      ) : (
        <CardWrapper className="p-0 rounded-lg mb-4">
          <UserQuoteHeader />
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200 py-3 px-6 border-none">
                <TableHead className="py-[13px] ps-6">Customer</TableHead>
                <TableHead className="py-[13px] ps-6"> Quantity</TableHead>
                <TableHead className="py-[13px] ps-6">Quote Sent</TableHead>
                <TableHead className="py-[13px] ps-6">Counter Amount</TableHead>
                <TableHead className="py-[13px] ps-6">Date Requested</TableHead>
                <TableHead className="py-[13px] ps-6">Status</TableHead>
                <TableHead className="py-[13px] ps-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((request) => (
                <TableRow
                  className="border-b border-b-gray-200 text-resin-black"
                  key={request.id}
                >
                  <TableCell className="p-6">{request.customer}</TableCell>
                  <TableCell className="p-6">{request.quantity}</TableCell>
                  <TableCell className="p-6">
                    {request.quoteSent ?? '-----------'}
                  </TableCell>
                  <TableCell className="p-6">
                    {request.counterAmount ?? '-----------'}
                  </TableCell>
                  <TableCell className="p-6">{request.dateRequested}</TableCell>
                  <TableCell className="p-6">
                    <Status status={request.status} />
                  </TableCell>
                  <TableCell className="text-[#E2A109] p-6">
                    <button
                      onClick={() => {
                        const match =
                          (rawQuotes || []).find((q) => q._id === request.id) ||
                          null;
                        setActiveQuote(match);
                        setOpenQuote(true);
                      }}
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="border-t border-t-gray-200">
              <TableRow>
                <TableCell colSpan={8} className="p-6">
                  <Pagination />
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardWrapper>
      )}
    </>
  );
};

const UserQuoteHeader = function () {
  return (
    <div className="flex justify-between px-6 py-3">
      <Select>
        <SelectTrigger className="border p-3 border-border-gray rounded-md ">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent className="bg-white border-none">
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="successful">Successful</SelectItem>
        </SelectContent>
      </Select>
      <div className="max-w-[334px] w-full">
        <SearchInput />
      </div>
    </div>
  );
};
export default UserQuote;
