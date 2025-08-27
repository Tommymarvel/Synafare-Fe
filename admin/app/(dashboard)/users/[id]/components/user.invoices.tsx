'use client';
import EmptyList from '@/app/(dashboard)/loan-requests/components/empty-list';
import { Invoice } from '@/types/usertypes';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Status from '@/components/status';
import { useState } from 'react';
import InvoicePreviewModal from './user.invoice.preview';

const UserInvoice = ({ data, userId }: { data: Invoice[]; userId: string }) => {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(
    null
  );
  const [openPreview, setOpenPreview] = useState(false);

  if (!data || data.length < 1) {
    return (
      <EmptyList
        title="No Invoices"
        message="This user has no invoices yet"
        src="/empty-loan.svg"
      />
    );
  }

  return (
    <>
      <InvoicePreviewModal
        open={openPreview}
        onOpenChange={setOpenPreview}
        userId={userId}
        invoiceId={selectedInvoiceId}
      />

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-4 border-none">
            <TableHead className="py-3 ps-6">Invoice ID</TableHead>
            <TableHead className="py-3 ps-6">Customer</TableHead>
            <TableHead className="py-3 ps-6">Issue Date</TableHead>
            <TableHead className="py-3 ps-6">Due Date</TableHead>
            <TableHead className="py-3 ps-6">Amount</TableHead>
            <TableHead className="py-3 ps-6">Status</TableHead>
            <TableHead className="py-3 ps-6">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((inv: Invoice) => (
            <TableRow key={inv.invoiceId} className="border-b border-gray-200">
              <TableCell className="p-6">#{inv.invoiceId}</TableCell>
              <TableCell className="p-6">
                <p className="font-medium">{inv.customerName}</p>
                <p className="text-gray-500">{inv.customerEmail}</p>
              </TableCell>
              <TableCell className="p-6">{inv.issueDate}</TableCell>
              <TableCell className="p-6">{inv.dueDate}</TableCell>
              <TableCell className="p-6">
                {inv.amount.toLocaleString('en-NG', {
                  style: 'currency',
                  currency: 'NGN',
                })}
              </TableCell>
              <TableCell className="p-6">
                <Status status={inv.status} />
              </TableCell>
              <TableCell className="p-6 text-[#E2A109]">
                <button
                  onClick={() => {
                    setSelectedInvoiceId(inv._id || inv.invoiceId);
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
    </>
  );
};

export default UserInvoice;
