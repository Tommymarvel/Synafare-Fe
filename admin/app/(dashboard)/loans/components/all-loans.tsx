import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import EmptyList from "../../loan-requests/components/empty-list";
import { AllLoansType } from "@/types/loantypes";
import Pagination from "@/components/pagination";
import Status from "@/components/status";

const AllLoansTable = ({ data }: { data: AllLoansType[] }) => {
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
          <TableHead className="py-[13px] ps-6">Loan Amount</TableHead>
          <TableHead className="py-[13px] ps-6">Amount Due</TableHead>
          <TableHead className="py-[13px] ps-6">Date Disbursed</TableHead>
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
              <p className="text-gray-500">{request.id}</p>
            </TableCell>
            <TableCell className="p-6">{request.loanAmount}</TableCell>
            <TableCell className="p-6">{request.amountDue}</TableCell>
            <TableCell className="p-6">{request.dateDisbursed}</TableCell>
            <TableCell className="p-6">{request.duration}</TableCell>
            <TableCell className="p-6">
              {request.nextPayment ?? "N/A"}
            </TableCell>
            <TableCell className="p-6">
              <Status status={request.status} />
            </TableCell>
            <TableCell className="text-[#E2A109] p-6">View</TableCell>
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

export default AllLoansTable;
