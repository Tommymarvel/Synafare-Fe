import EmptyList from "@/app/(dashboard)/loan-requests/components/empty-list";
import CardWrapper from "@/components/cardWrapper";
import Pagination from "@/components/pagination";
import SearchInput from "@/components/search.input";
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
import { InventoryType } from "@/types/usertypes";

const UserInventory = ({ data }: { data: InventoryType[] }) => {
  if (!data || data.length < 1) {
    return (
      <CardWrapper className="px-[23px] py-3 rounded-lg">
        <UserInventoryHeader />
        <EmptyList
          title="No Item in Inventory"
          message="User does not have any item in their inventory"
          src="/empty-inventory.svg"
        />
      </CardWrapper>
    );
  }
  return (
    <CardWrapper className="px-0 py-0 rounded-lg">
      <div className="py-3 px-6 w-full">
        <UserInventoryHeader />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 py-3 px-6 border-none">
            <TableHead className="py-[13px] ps-6">Product</TableHead>
            <TableHead className="py-[13px] ps-6">Category</TableHead>
            <TableHead className="py-[13px] ps-6">Date Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request) => (
            <TableRow
              className="border-b border-b-gray-200 text-resin-black"
              key={request.id}
            >
              <TableCell className="p-6">{request.product}</TableCell>
              <TableCell className="p-6">{request.category}</TableCell>
              <TableCell className="p-6">{request.dateCreated}</TableCell>
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
  );
};

const UserInventoryHeader = function () {
  return (
    <div className="flex justify-between">
      <Select>
        <SelectTrigger className="border p-3 border-border-gray rounded-md w-[157px]">
          <SelectValue placeholder="Category" />
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
export default UserInventory;
