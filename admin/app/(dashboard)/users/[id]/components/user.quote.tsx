"use client";
import EmptyList from "@/app/(dashboard)/loan-requests/components/empty-list";
import CardWrapper from "@/components/cardWrapper";
import SearchInput from "@/components/search.input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const UserQuote = ({ data }: { data: any[] }) => {
  //   if (!data || data.length < 1) {
  //     return (
  //       <CardWrapper className="px-[23px] py-3 rounded-lg">
  //         <UserQuoteHeader />
  //         <EmptyList
  //           title="No Quote Request"
  //           message="User does not have any quote request"
  //           src="/invoice.svg"
  //         />
  //       </CardWrapper>
  //     );
  //   }
  const [sent, setSent] = useState(false);
  return (
    <>
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
      <CardWrapper className="px-[23px] py-3 rounded-lg">
        <UserQuoteHeader />
      </CardWrapper>
    </>
  );
};

const UserQuoteHeader = function () {
  return (
    <div className="flex justify-between">
      <Select>
        <SelectTrigger className="border p-3 border-border-gray rounded-md ">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
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
