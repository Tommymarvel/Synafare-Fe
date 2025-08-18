import CardWrapper from "@/components/cardWrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchInput from "@/components/search.input";

const LoanTableWrapper = ({
  children,
  hideStatus = false,
}: {
  children: React.ReactNode;
  hideStatus?: boolean;
}) => {
  return (
    <CardWrapper className="px-0 py-0 rounded-lg">
      <div className="flex justify-between px-6 py-3">
        <div className="max-w-[334px] w-full">
          <SearchInput />
        </div>

        <div className="gap-x-[10px] flex">
          {!hideStatus && (
            <Select>
              <SelectTrigger className="border p-3 border-border-gray rounded-md ">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Pending</SelectItem>
                <SelectItem value="system">Successful</SelectItem>
              </SelectContent>
            </Select>
          )}

          <Select>
            <SelectTrigger className="border p-3 border-border-gray rounded-md ">
              <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent></SelectContent>
          </Select>
        </div>
      </div>
      {children}
    </CardWrapper>
  );
};

export default LoanTableWrapper;
