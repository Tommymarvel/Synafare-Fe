import { TableCell } from "@/components/ui/table";

type TableStatusType = "Successful" | "Pending";

const TableStatus = ({ status }: { status: TableStatusType }) => {
  if (status === "Pending") {
    return (
      <TableCell className="p-6">
        <span className="bg-[#FFF8ED] text-[#E2A109] text-xs py-[2px] px-2 rounded-full">
          pending
        </span>
      </TableCell>
    );
  }
  if (status === "Successful") {
    return (
      <TableCell className="p-6">
        <span className="bg-success-50/50 text-success text-xs py-[2px] px-2 rounded-full">
          successful
        </span>
      </TableCell>
    );
  }
  return (
    <TableCell className="p-6">
      <span className="bg-success-50/50 text-success text-xs py-[2px] px-2 rounded-full">
        unknown
      </span>
    </TableCell>
  );
};

export default TableStatus;
