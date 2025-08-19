"use client";
import EmptyList from "@/app/(dashboard)/loan-requests/components/empty-list";
import CardWrapper from "@/components/cardWrapper";
import Pagination from "@/components/pagination";
import SearchInput from "@/components/search.input";
import Status from "@/components/status";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuoteRequest } from "@/types/usertypes";
import { useState } from "react";
import QuoteRequestModal from "./modals/quote-request";

const UserQuote = ({ data }: { data: QuoteRequest[] }) => {
    const [sent, setSent] = useState(false);
    const [openQuote, setOpenQuote] = useState(false);
  if (!data || data.length < 1) {
    return (
      <CardWrapper className="px-[23px] py-3 rounded-lg">
        <UserQuoteHeader />
        <EmptyList
          title="No Quote Request"
          message="User does not have any quote request"
          src="/invoice.svg"
        />
      </CardWrapper>
    );
  }

  return (
    <>
      <QuoteRequestModal open={openQuote} onOpenChange={setOpenQuote} />
      <div className="flex gap-x-[10px] items-center mb-3">
        <button
          onClick={() => setSent(false)}
          className={
            " block py-2 px-3 font-medium rounded-md " +
            (!sent
              ? " bg-secondary-4 text-[#E2A109]"
              : "border-gray-300 text-gray-3 border ")
          }
        >
          Received Quotes
        </button>
        <button
          onClick={() => setSent(true)}
          className={
            " block py-2 px-3 font-medium rounded-md " +
            (sent
              ? " bg-secondary-4 text-[#E2A109]"
              : "border-gray-300 text-gray-3 border")
          }
        >
          Sent Quotes
        </button>
      </div>
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
            {data.map((request) => (
              <TableRow
                className="border-b border-b-gray-200 text-resin-black"
                key={request.id}
              >
                <TableCell className="p-6">{request.customer}</TableCell>
                <TableCell className="p-6">{request.quantity}</TableCell>
                <TableCell className="p-6">
                  {request.quoteSent ?? "-----------"}
                </TableCell>
                <TableCell className="p-6">
                  {request.counterAmount ?? "-----------"}
                </TableCell>
                <TableCell className="p-6">{request.dateRequested}</TableCell>
                <TableCell className="p-6">
                  <Status status={request.status} />
                </TableCell>
                <TableCell className="text-[#E2A109] p-6">
                  <button onClick={() => setOpenQuote(true)}>View</button>
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
          <SelectItem value="dark">Pending</SelectItem>
          <SelectItem value="system">Successful</SelectItem>
        </SelectContent>
      </Select>
      <div className="max-w-[334px] w-full">
        <SearchInput />
      </div>
    </div>
  );
};
export default UserQuote;
