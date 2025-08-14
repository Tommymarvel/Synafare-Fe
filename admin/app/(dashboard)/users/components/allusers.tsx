import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/pagination";
import EmptyList from "../../loan-requests/components/empty-list";
import Status from "@/components/status";
import UserActionButton from "./user-action";
import { AllUsers } from "@/types/usertypes";
const AllUsersTable = ({ data }: { data: AllUsers[] }) => {
  if (!data || data.length < 1) {
    return (
      <EmptyList
        title="No User"
        message="You do not have any User"
        src="/no-user.svg"
      />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-200 py-3 px-6 border-none">
          <TableHead className="py-[13px] ps-6">Name</TableHead>
          <TableHead className="py-[13px] ps-6">Email Address</TableHead>
          <TableHead className="py-[13px] ps-6">User Type</TableHead>
          <TableHead className="py-[13px] ps-6">Date Added</TableHead>
          <TableHead className="py-[13px] ps-6">Status</TableHead>
          <TableHead className="py-[13px] ps-6">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((request) => (
          <TableRow
            className="border-b border-b-gray-200 text-resin-black"
            key={request.email}
          >
            <TableCell className="p-6">
              <p className="text-gray-900 font-medium">{request.name}</p>
            </TableCell>
            <TableCell className="p-6">{request.email}</TableCell>
            <TableCell className="p-6">{request.userType}</TableCell>
            <TableCell className="p-6">{request.dateAdded}</TableCell>
            <TableCell className="p-6">
              <Status status={request.status} />
            </TableCell>
            <TableCell className="p-6">
              <UserActionButton status={request.status} id={request.id} />
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

export default AllUsersTable;
