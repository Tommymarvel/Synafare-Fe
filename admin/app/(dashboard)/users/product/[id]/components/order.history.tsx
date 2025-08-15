import CardWrapper from "@/components/cardWrapper";
import Status from "@/components/status";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice } from "@/types/usertypes";

const OrderHistor = ({ data }: { data: Invoice[] }) => {
  return (
    <CardWrapper className="p-0">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-4 py-3 px-6 border-none">
            <TableHead className="py-[13px] ps-6">Invoice ID</TableHead>
            <TableHead className="py-[13px] ps-6">Customer</TableHead>
            <TableHead className="py-[13px] ps-6">Issue Date</TableHead>
            <TableHead className="py-[13px] ps-6">Due Date</TableHead>
            <TableHead className="py-[13px] ps-6">Amount</TableHead>
            <TableHead className="py-[13px] ps-6">Status</TableHead>
            <TableHead className="py-[13px] ps-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request) => (
            <TableRow
              className="border-b border-b-gray-200 text-resin-black"
              key={request.invoiceId}
            >
              <TableCell className="p-6">#{request.invoiceId}</TableCell>
              <TableCell className="p-6">
                <p className="text-gray-900 font-medium">
                  {request.customerName}
                </p>
                <p className="text-gray-500">{request.customerEmail}</p>
              </TableCell>
              <TableCell className="p-6">{request.issueDate}</TableCell>
              <TableCell className="p-6">{request.dueDate}</TableCell>
              <TableCell className="p-6">
                {request.amount.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </TableCell>
              <TableCell className="p-6">
                <Status status={request.status} />
              </TableCell>

              <TableCell className="text-[#E2A109] p-6">
                <a href={"/loan-requests/" + request.invoiceId}>View</a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardWrapper>
  );
};

export default OrderHistor;
