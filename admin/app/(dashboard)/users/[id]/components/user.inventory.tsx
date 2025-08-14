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

const UserInventory = ({ data }: { data: any[] }) => {
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
      <div className="max-w-[334px] w-full">
        <SearchInput />
      </div>
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
