import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Pagination from '@/components/pagination';
import EmptyList from '../../loan-requests/components/empty-list';
import Status from '@/components/status';
import UserActionButton from './user-action';
import { AllUsers } from '@/types/usertypes';

interface AllUsersTableProps {
  data: AllUsers[];
  loading?: boolean;
  onUserUpdated?: () => void;
  // Pagination props
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}

const AllUsersTable = ({
  data,
  loading = false,
  onUserUpdated,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: AllUsersTableProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2">Loading users...</span>
      </div>
    );
  }

  if (!data || data.length < 1) {
    return (
      <EmptyList
        title="No Users"
        message="You do not have any users"
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
              <UserActionButton
                status={request.status}
                id={request.id}
                firebaseUid={request.firebaseUid}
                onUserUpdated={onUserUpdated}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="border-t border-t-gray-200">
        <TableRow>
          <TableCell colSpan={7} className="px-6 py-6">
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
  );
};

export default AllUsersTable;
