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
import { Loan } from "../../loans/types";
import { fmtDate, fmtNaira } from "@/lib/format";

const DeclinedRequests = ({ data }: { data: Loan[] }) => {
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
              <p className="text-gray-900 font-medium">
                {request.customerName?.trim() && request.customerName !== '-'
                  ? request.customerName
                  : request.userFirstName && request.userLastName
                  ? `${request.userFirstName} ${request.userLastName}`
                  : 'N/A'}
              </p>
              <p className="text-gray-500">{request.id.slice(0, 8)}...</p>{' '}
            </TableCell>
            <TableCell className="p-6 capitalize">
              {request.userType ?? '---'}
            </TableCell>
            <TableCell className="p-6">
              {fmtNaira(request.loanAmount)}
            </TableCell>
            <TableCell className="p-6">
              {fmtDate(request.dateRequested)}
            </TableCell>
            <TableCell className="p-6">
              {request.loanDurationInMonths} months
            </TableCell>
            <TableCell className="p-6">
              <Status status={request.loanStatus} />
            </TableCell>
            <TableCell className="p-6 text-[#E2A109]">
              <a href={'/loan-requests/' + request.id}>View</a>
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

export default DeclinedRequests;
