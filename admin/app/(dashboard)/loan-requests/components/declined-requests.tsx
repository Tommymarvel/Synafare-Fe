import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyList from "./empty-list";
import Status from "@/components/status";
import Pagination from "@/components/pagination";
import { DeclineLoanType } from "@/types/loantypes";

const DeclinedRequests = ({ data }: { data: DeclineLoanType[] }) => {
  if (!data || data.length < 1)
    return (
      <div>
        <EmptyList
          title="No Loan Offers"
          message="You do not have any loan offers"
          src="/empty-loan.svg"
        />
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-200 py-3 px-6 border-none">
          <TableHead className="py-[13px] ps-6">Name</TableHead>
          <TableHead className="py-[13px] ps-6">User Type</TableHead>
          <TableHead className="py-[13px] ps-6">Loan Amount</TableHead>
          <TableHead className="py-[13px] ps-6">Date Requested</TableHead>
          <TableHead className="py-[13px] ps-6">Duration</TableHead>
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
              <p className="text-gray-500">{request.id}</p>
            </TableCell>
            <TableCell className="p-6">{request.userType}</TableCell>
            <TableCell className="p-6">{request.loanAmount}</TableCell>
            <TableCell className="p-6">{request.dateRequested}</TableCell>
            <TableCell className="p-6">{request.duration}</TableCell>
            <TableCell className="p-6">
              <Status status={request.status} />
            </TableCell>
            <TableCell className="p-6 text-[#E2A109]">View all</TableCell>
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

export default DeclinedRequests;
