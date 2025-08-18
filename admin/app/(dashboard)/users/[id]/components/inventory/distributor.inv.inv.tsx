import EmptyList from "@/app/(dashboard)/loan-requests/components/empty-list";
import CardWrapper from "@/components/cardWrapper";
import Pagination from "@/components/pagination";
import SearchInput from "@/components/search.input";
import Status from "@/components/status";
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
import { DInventoryDataType } from "@/types/usertypes";

const DistEmbededInventory = ({ data }: { data: DInventoryDataType[] }) => {
  if (!data || data.length < 1)
    return (
      <CardWrapper className="px-[23px] py-3 rounded-lg">
        <EmptyList
          title="No Item in Inventory"
          message="User does not have any item in their inventory"
          src="/empty-inventory.svg"
        />
      </CardWrapper>
    );
  return (
    <CardWrapper className="p-0 rounded-lg">
      <div className="flex justify-between items-center py-3 px-6">
        <div className="gap-x-[10px] flex ">
          <Select>
            <SelectTrigger className="border p-3 border-border-gray rounded-md w-[157px] ">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Pending</SelectItem>
              <SelectItem value="system">Successful</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="border p-3 border-border-gray rounded-md w-[157px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dark">Pending</SelectItem>
              <SelectItem value="system">Successful</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-x-[10px] grow justify-end  items-center">
          <div className="max-w-[334px] shrink-0 w-full">
            <SearchInput />
          </div>
          <button className="border rounded-lg border-border-gray shrink-0 font-medium flex gap-x-2 py-2 px-[22.3px]">
            <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
              <path
                d="M13.2164 18.5412H7.78307C3.69141 18.5412 1.94141 16.7912 1.94141 12.6996V12.5912C1.94141 8.89124 3.39974 7.10791 6.66641 6.79957C6.99974 6.77457 7.31641 7.02457 7.34974 7.36624C7.38307 7.70791 7.13307 8.01624 6.78307 8.04957C4.16641 8.29124 3.19141 9.52457 3.19141 12.5996V12.7079C3.19141 16.0996 4.39141 17.2996 7.78307 17.2996H13.2164C16.6081 17.2996 17.8081 16.0996 17.8081 12.7079V12.5996C17.8081 9.50791 16.8164 8.27457 14.1497 8.04957C13.8081 8.01624 13.5497 7.71624 13.5831 7.37457C13.6164 7.03291 13.9081 6.77457 14.2581 6.80791C17.5747 7.09124 19.0581 8.88291 19.0581 12.6079V12.7162C19.0581 16.7912 17.3081 18.5412 13.2164 18.5412Z"
                fill="#1D1C1D"
              />
              <path
                d="M10.5 13.0253C10.1583 13.0253 9.875 12.742 9.875 12.4003V1.66699C9.875 1.32533 10.1583 1.04199 10.5 1.04199C10.8417 1.04199 11.125 1.32533 11.125 1.66699V12.4003C11.125 12.7503 10.8417 13.0253 10.5 13.0253Z"
                fill="#1D1C1D"
              />
              <path
                d="M10.4995 13.9585C10.3412 13.9585 10.1829 13.9002 10.0579 13.7752L7.26621 10.9835C7.02454 10.7419 7.02454 10.3419 7.26621 10.1002C7.50788 9.85853 7.90788 9.85853 8.14954 10.1002L10.4995 12.4502L12.8495 10.1002C13.0912 9.85853 13.4912 9.85853 13.7329 10.1002C13.9745 10.3419 13.9745 10.7419 13.7329 10.9835L10.9412 13.7752C10.8162 13.9002 10.6579 13.9585 10.4995 13.9585Z"
                fill="#1D1C1D"
              />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 py-3 px-6 border-none">
            <TableHead className="py-[13px] ps-6">Product</TableHead>
            <TableHead className="py-[13px] ps-6">Category</TableHead>
            <TableHead className="py-[13px] ps-6">Price</TableHead>
            <TableHead className="py-[13px] ps-6">In stock</TableHead>
            <TableHead className="py-[13px] ps-6">Last Updated</TableHead>
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
                <div className="flex gap-x-3 items-center">
                  <img
                    src={request.url}
                    alt={request.productName}
                    className="w-8 h-8"
                  />
                  <div>
                    <p className="font-medium">{request.sku}</p>
                    <p className="font-medium">{request.productName}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="p-6">{request.category}</TableCell>
              <TableCell className="p-6">
                {request.price.toLocaleString("en-NG", {
                  style: "currency",
                  currency: "NGN",
                })}
              </TableCell>
              <TableCell className="p-6">{request.inStock}</TableCell>
              <TableCell className="p-6">{request.lastUpdated}</TableCell>
              <TableCell className="p-6">
                <Status status={request.status} />
              </TableCell>
              <TableCell className="p-6 text-[#E2A109] font-semibold">
                <a href={"/users/product/" + request.id}>View</a>
              </TableCell>
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

export default DistEmbededInventory;
