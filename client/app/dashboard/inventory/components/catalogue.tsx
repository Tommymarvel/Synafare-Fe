import CardWrapper from '@/app/components/cardWrapper';
import Pagination from '@/app/components/pagination';
import SearchInput from '@/app/components/search.input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import NoInventory from '@/app/assets/no-inventory.png';


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

export type CatelogueType = {
  id: string;
  product: string;
  category: string;
  dateCreated: string;
};

const Catalogue = ({ data }: { data: CatelogueType[] }) => {
    if (!data || data.length < 1) {
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
    }
  return (
    <CardWrapper className="px-0 py-0 rounded-lg">
      <div className="py-3 px-6 w-full">
        <InstallerInventoryHeader />
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
}
const InstallerInventoryHeader = function () {
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
export default Catalogue;
