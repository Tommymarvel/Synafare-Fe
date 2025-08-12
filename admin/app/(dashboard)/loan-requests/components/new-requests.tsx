import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoanReqType } from "@/types/loantypes";
import ActionButton from "./action-button";
import Pagination from "@/components/pagination";
import Image from "next/image";
import EmptyList from "./empty-list";

const NewRequests = ({ data }: { data: LoanReqType[] }) => {
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
        {data.map((request) => (
          <TableRow
            className="border-b border-b-gray-200 text-resin-black"
            key={request.id}
          >
            <TableCell className="p-6">
              <p className="text-gray-900 font-medium">{request.name}</p>
              <p className="text-gray-500">{request.id}</p>
            </TableCell>
            <TableCell className="p-6">{request.userType}</TableCell>
            <TableCell className="p-6">{request.customer}</TableCell>
            <TableCell className="p-6">{request.loanAmount}</TableCell>
            <TableCell className="p-6">{request.dateRequested}</TableCell>
            <TableCell className="p-6">{request.duration}</TableCell>
            <TableCell className="p-6">
              <ActionButton id={request.id} />
            </TableCell>
          </TableRow>
        ))}
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
