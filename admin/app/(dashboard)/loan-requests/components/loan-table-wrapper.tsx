import CardWrapper from "@/components/cardWrapper";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LoanTableWrapper = ({
  children,
  hideStatus = false,
}: {
  children: React.ReactNode;
  hideStatus?: boolean;
}) => {
  return (
    <CardWrapper className="px-0 py-0">
      <div className="flex justify-between px-6 py-3">
        <div className="relative max-w-[334px] w-full">
          <input
            type="search"
            placeholder="Search"
            className="w-full ps-4 peer border border-border-gray rounded-[16px] text-[16px]/[24px] placeholder:ps-[26px] py-2  focus:placeholder-transparent "
            name=""
            id=""
          />
          <Image
            className="absolute peer-focus:hidden transition-all left-[14px] top-1/2 -translate-y-1/2"
            src="./search-icon.svg"
            alt="search icon"
            width={20}
            height={20}
          />
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
