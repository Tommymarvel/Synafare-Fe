'use client';
import CardWrapper from '@/components/cardWrapper';
import GoBack from '@/components/goback';
import Status from '@/components/status';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCustomerDetail } from '@/hooks/useCustomerDetail';
import { STATUSCONST } from '@/lib/constants';
import { useParams, useSearchParams } from 'next/navigation';
import ViewOfferModal from '../../[id]/components/modals/view-offer';
import { useState } from 'react';
import Pagination from '@/components/pagination';
import { useCustomerLoans } from '@/hooks/useCustomerLoans';
import { useCustomerInvoices } from '@/hooks/useCustomerInvoices';
import InvoicePreviewModal from '../../[id]/components/user.invoice.preview';

function safe(val?: unknown) {
  return val === undefined || val === null || val === '' ? '---' : String(val);
}

const UserCustomerPage = () => {
  const params = useParams();
  const search = useSearchParams();
  const customerId = params?.id as string;
  const ownerId = (search?.get('owner') as string) || '';
  const [openOffer, setOpenOffer] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const { detail } = useCustomerDetail(ownerId, customerId);
  const { loans } = useCustomerLoans(ownerId, customerId);
  const { invoices } = useCustomerInvoices(customerId);

  const initial = safe(detail?.name?.charAt(0));
  const since = detail?.dateJoined || '---';

  return (
    <div>
      <InvoicePreviewModal
        open={openPreview}
        onOpenChange={setOpenPreview}
        userId={ownerId}
        invoiceId={selectedInvoiceId}
      />
      <ViewOfferModal open={openOffer} onOpenChange={setOpenOffer} />

      <GoBack className="mt-5 mb-3" />
      <div className="space-y-6">
        <CardWrapper className="p-[26px] flex items-center my-5">
          <div className="gap-x-4 flex items-center shrink-0">
            <div className="text-[30px] font-medium text-gray-3 w-[72px] h-[72px] rounded-full bg-gray-4 flex items-center justify-center">
              {initial}
            </div>
            <div>
              <h2 className="font-medium text-xl">{safe(detail?.name)}</h2>
              <p className="text-gray-3">Customer since: {since}</p>
            </div>
          </div>
          <div className="grow flex justify-around">
            <div className="space-y-[11px]">
              <p className="text-xs text-gray-3">Email Address</p>
              <p className="text-[16px]">{safe(detail?.email)}</p>
            </div>
            <div className="space-y-[11px]">
              <p className="text-xs text-gray-3">Phone Number</p>
              <p className="text-[16px]">{safe(detail?.phoneNumber)}</p>
            </div>
          </div>
        </CardWrapper>

        <CardWrapper className="p-0  my-5 rounded-lg">
          <div className="bg-gray-4 flex itesm-center justify-between itesm-center w-full p-[18px]">
            <h1 className="font-medium">Loans</h1>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.99928 13.9995C9.41595 13.9995 8.83262 13.7745 8.39095 13.3329L2.95762 7.89954C2.71595 7.65788 2.71595 7.25788 2.95762 7.01621C3.19928 6.77454 3.59928 6.77454 3.84095 7.01621L9.27428 12.4495C9.67428 12.8495 10.3243 12.8495 10.7243 12.4495L16.1576 7.01621C16.3993 6.77454 16.7993 6.77454 17.041 7.01621C17.2826 7.25788 17.2826 7.65788 17.041 7.89954L11.6076 13.3329C11.166 13.7745 10.5826 13.9995 9.99928 13.9995Z"
                fill="#1D1C1D"
              />
            </svg>
          </div>
          {/* <div className="py-[30px] text-center italic text-gray-3">
            No recent loan activity
          </div> */}
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-200 py-3 px-6 border-none">
                <TableHead className="py-[13px] ps-6">Customer</TableHead>
                <TableHead className="py-[13px] ps-6">
                  Transaction Cost
                </TableHead>
                <TableHead className="py-[13px] ps-6">Loan Amount</TableHead>
                <TableHead className="py-[13px] ps-6">Date Requested</TableHead>
                <TableHead className="py-[13px] ps-6">Duration</TableHead>
                <TableHead className="py-[13px] ps-6">Next Payment</TableHead>
                <TableHead className="py-[13px] ps-6">Status</TableHead>
                <TableHead className="py-[13px] ps-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loans.map((request) => (
                <TableRow
                  className="border-b border-b-gray-200 text-resin-black"
                  key={request.id}
                >
                  <TableCell className="p-6">
                    <p className="text-gray-900 font-medium">{request.name}</p>
                    <p className="text-gray-500">{request.email}</p>
                  </TableCell>
                  <TableCell className="p-6">
                    {request.transactionCost}
                  </TableCell>
                  <TableCell className="p-6">{request.loanAmount}</TableCell>
                  <TableCell className="p-6">{request.dateRequested}</TableCell>
                  <TableCell className="p-6">{request.duration}</TableCell>
                  <TableCell className="p-6">
                    {request.nextPayment ?? '---'}
                  </TableCell>
                  <TableCell className="p-6">
                    <Status status={request.status} />
                  </TableCell>
                  <TableCell className="text-[#E2A109] p-6">
                    {request.status == STATUSCONST.OFFER_RECEIVED ? (
                      <button onClick={() => setOpenOffer(true)}>View</button>
                    ) : (
                      <a href={'/loan-requests/' + request.id}>View</a>
                    )}
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
        <CardWrapper className="p-0  my-5 rounded-lg">
          <h1 className="font-medium p-[18px] bg-gray-4 border-b border-b-border-gray">
            Invoice
          </h1>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-4 py-3 px-6 border-none">
                <TableHead className="py-[13px] ps-6">Invoice ID</TableHead>
                <TableHead className="py-[13px] ps-6">Customer</TableHead>
                <TableHead className="py-[13px] ps-6">Issue Date</TableHead>
                <TableHead className="py-[13px] ps-6">Due Date</TableHead>
                <TableHead className="py-[13px] ps-6">Amount</TableHead>
                <TableHead className="py-[13px] ps-6">Status</TableHead>
                <TableHead className="py-[13px] ps-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((request) => (
                <TableRow
                  className="border-b border-b-gray-200 text-resin-black"
                  key={request.invoiceId}
                >
                  <TableCell className="p-6">#{request.invoiceId}</TableCell>
                  <TableCell className="p-6">
                    <p className="text-gray-900 font-medium">
                      {request.customerName}
                    </p>
                    <p className="text-gray-500">{request.customerEmail}</p>
                  </TableCell>
                  <TableCell className="p-6">{request.issueDate}</TableCell>
                  <TableCell className="p-6">{request.dueDate}</TableCell>
                  <TableCell className="p-6">
                    {request.amount.toLocaleString('en-NG', {
                      style: 'currency',
                      currency: 'NGN',
                    })}
                  </TableCell>
                  <TableCell className="p-6">
                    <Status status={request.status} />
                  </TableCell>

                  <TableCell className="text-[#E2A109] p-6">
                    <button
                      onClick={() => {
                        setSelectedInvoiceId(request._id || request.invoiceId);
                        setOpenPreview(true);
                      }}
                    >
                      View
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardWrapper>
      </div>
    </div>
  );
};

export default UserCustomerPage;
