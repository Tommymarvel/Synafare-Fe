import NoInventory from '@/app/assets/no-inventory.png';
import CardWrapper from '@/app/components/cardWrapper';
import Pagination from '@/app/components/pagination';
import SearchInput from '@/app/components/search.input';
import StatusChip, { StatusType } from '@/app/components/statusChip';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import Image from 'next/image';

interface InventoryDataType {
  id: string;
  productName: string;
  url: string;
  sku: string | null;
  category: string;
  price: number;
  inStock: number;
  lastUpdated: string;
  status: StatusType;
}

const Inventory = ({ data }: { data: InventoryDataType[] }) => {
  if (!data || data.length < 1)
    return (
      <div className="flex flex-col items-center justify-center h-[70dvh] space-y-6 border rounded-lg">
        <Image
          src={NoInventory}
          alt="No inventory illustration"
          width={180}
          height={180}
        />
        <h2 className="text-lg font-semibold text-neutral-900">
          No Item in Inventory{' '}
        </h2>
        <p className="text-sm text-neutral-500 max-w-xs text-center">
          You do not have any item in your inventory. click “Add to Inventory”
          to add a product
        </p>
        <button
          // onClick={() => router.push('/dashboard/loans/request')}
          className="px-6 py-3 bg-mikado text-white rounded-md hover:bg-yellow-600
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
                   focus-visible:ring-mikado"
        >
          Request Loan
        </button>
      </div>
    );
  return (
    <CardWrapper className="p-0 rounded-lg">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center py-3 px-6">
        {/* Left: filters */}
        <div className="flex gap-x-[10px]">
          <Select>
            <SelectTrigger className="border p-3 border-border-gray rounded-md w-[157px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="unpublished">Unpublished</SelectItem>
              <SelectItem value="outofstock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select>
            <SelectTrigger className="border p-3 border-border-gray rounded-md w-[157px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inverter">Inverter</SelectItem>
              <SelectItem value="battery">Battery</SelectItem>
              <SelectItem value="panel">Panel</SelectItem>
              <SelectItem value="accessory">Accessory</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right: search + export */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-x-[10px] w-full sm:w-auto">
          <div className="w-full sm:max-w-[334px]">
            <SearchInput />
          </div>
          <button className="border rounded-lg border-border-gray font-medium flex gap-x-2 py-2 px-[22.3px] shrink-0">
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
                  <Image
                    src={request.url}
                    alt={request.productName}
                    width={40}
                    height={40}
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
                {request.price.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </TableCell>
              <TableCell className="p-6">{request.inStock}</TableCell>
              <TableCell className="p-6">{request.lastUpdated}</TableCell>
              <TableCell className="p-6">
                <StatusChip status={request.status} />
              </TableCell>
              <TableCell className="p-6 text-[#E2A109] font-semibold">
                <a href={'/users/product/' + request.id}>View</a>
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

export default Inventory;
