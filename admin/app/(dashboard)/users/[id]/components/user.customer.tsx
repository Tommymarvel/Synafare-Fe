import EmptyList from '@/app/(dashboard)/loan-requests/components/empty-list';
import CardWrapper from '@/components/cardWrapper';
import Pagination from '@/components/pagination';
import SearchInput from '@/components/search.input';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { UserCustomer } from '@/types/usertypes';

const UserCustomerTable = ({
  data,
  ownerUserId,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: {
  data: UserCustomer[];
  ownerUserId?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) => {
  if (!data || data.length < 1) {
    return (
      <CardWrapper className="px-[23px] py-3 rounded-lg">
        <div className="max-w-[334px] w-full">
          <SearchInput />
        </div>
        <EmptyList
          title="No Customer"
          message="User does not have any customer"
          src="/printing-invoice.svg"
        />
      </CardWrapper>
    );
  }
  return (
    <CardWrapper className="px-0 py-0 rounded-lg">
      <div className="max-w-[334px] w-full px-6 py-3">
        <SearchInput />
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200 py-3 px-6 border-none">
            <TableHead className="py-[13px] ps-6">Name</TableHead>
            <TableHead className="py-[13px] ps-6">Email Address</TableHead>
            <TableHead className="py-[13px] ps-6">Phone Number</TableHead>
            <TableHead className="py-[13px] ps-6">Date Added</TableHead>
            <TableHead className="py-[13px] ps-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((request) => (
            <TableRow
              className="border-b border-b-gray-200 text-resin-black"
              key={request.id}
            >
              <TableCell className="p-6">{request.name}</TableCell>
              <TableCell className="p-6">{request.email}</TableCell>
              <TableCell className="p-6">{request.phoneNumber}</TableCell>
              <TableCell className="p-6">{request.dateAdded}</TableCell>
              <TableCell className="p-6 text-[#E2A109] ">
                <a
                  href={`/users/customer/${request.id}${
                    ownerUserId ? `?owner=${ownerUserId}` : ''
                  }`}
                >
                  View
                </a>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter className="border-t border-t-gray-200">
          <TableRow>
            <TableCell colSpan={8} className="p-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onPrevious={onPrevious}
                onNext={onNext}
              />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </CardWrapper>
  );
};

export default UserCustomerTable;
