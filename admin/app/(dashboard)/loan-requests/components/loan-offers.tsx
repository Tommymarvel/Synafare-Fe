import EmptyList from './empty-list';

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
import Status from '@/components/status';
import { Loan } from '../../loans/types';
import { fmtDate, fmtNaira } from '@/lib/format';

const LoanOffers = ({
  data,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  onPrevious = () => {},
  onNext = () => {},
}: {
  data: Loan[];
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
}) => {
  if (!data || data.length < 1)
    return (
      <div>
        <EmptyList
          title="No Loan Offers"
          message="You do not have any loan offers"
          src="/empty-loan.svg"
        />
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-200 py-3 px-6 border-none">
          <TableHead className="py-[13px] ps-6">Name</TableHead>
          <TableHead className="py-[13px] ps-6">Loan Offers</TableHead>
          <TableHead className="py-[13px] ps-6">Equity Amount</TableHead>
          <TableHead className="py-[13px] ps-6">Customer</TableHead>
          <TableHead className="py-[13px] ps-6">Date Paid</TableHead>
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
              <p className="text-gray-900 font-medium">
                {request.customerName?.trim() && request.customerName !== '-'
                  ? request.customerName
                  : request.userFirstName && request.userLastName
                  ? `${request.userFirstName} ${request.userLastName}`
                  : '---'}
              </p>
              <p className="text-gray-500">{request.id.slice(0, 8)}...</p>{' '}
            </TableCell>
            <TableCell className="p-6">
              {fmtNaira(request.loanAmount)}
            </TableCell>
            <TableCell className="p-6">
              {fmtNaira(request.equityAmount)}
            </TableCell>
            <TableCell className="p-6">{request.customerName}</TableCell>
            <TableCell className="p-6">
              {fmtDate(request.datePaid ?? '')}
            </TableCell>
            <TableCell className="p-6">
              <Status status={request.loanStatus} />
            </TableCell>
            <TableCell className="p-6 text-[#E2A109]">
              <a href={'/loan-requests/' + request.id}>View</a>
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

export default LoanOffers;
