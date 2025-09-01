'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Eye, Pencil, Trash2, Search } from 'lucide-react';
import { Customer } from '../types';
import { Input } from '@/app/components/form/Input';
import EmptyState from '@/app/components/EmptyState';
import EditCustomerModal from './EditCustomerModal';
import DeleteCustomerModal from './DeleteCustomerModal';
import Pagination from '@/app/components/pagination';
import axiosInstance from '@/lib/axiosInstance';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

type Props = {
  customers: Customer[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRefresh?: () => void;
};

export default function CustomersTable({
  customers,
  currentPage,
  totalPages,
  onPageChange,
  onRefresh,
}: Props) {
  const [q, setQ] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  const filtered = customers.filter(
    (c) =>
      `${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase()) ||
      c.email.toLowerCase().includes(q.toLowerCase()) ||
      c.phone.includes(q)
  );

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditModalOpen(true);
  };

  const handleDelete = (customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCustomer) return;

    try {
      const res = await axiosInstance.delete(
        `/customer/delete/${selectedCustomer.id}`
      );
      toast.success(res.data.message || 'Customer deleted successfully');
      onRefresh?.();
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'An error occurred while deleting customer';
      toast.error(errorMessage);
    }
  };

  const handleModalClose = () => {
    setEditModalOpen(false);
    setDeleteModalOpen(false);
    setSelectedCustomer(null);
  };

  const th =
    'sticky top-0 bg-[#F0F2F5] text-left text-xs font-medium text-raisin px-4 lg:px-6 py-3';

  return (
    <div className="space-y-4 border border-[#DCDCDC] rounded-lg bg-white py-4">
      {/* search */}
      <div className="px-4">
        <div className="relative max-w-xl">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search"
            className="rounded-2xl pl-11"
          />
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        </div>
      </div>

      {/* table (only this scrolls horizontally) */}
      <div className="overflow-x-auto scrollbar-mikado rounded-xl border bg-white">
        <table className="min-w-max w-full text-sm">
          <thead>
            <tr>
              <th className={`${th} w-10`}>
                <input type="checkbox" />
              </th>
              <th className={th}>Name</th>
              <th className={th}>Email Address</th>
              <th className={`${th} hidden md:table-cell`}>Phone Number</th>
              <th className={`${th} hidden lg:table-cell`}>Date Added</th>
              <th className={th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-t hover:bg-neutral-50">
                <td className="px-4 lg:px-6 py-3">
                  <input type="checkbox" />
                </td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap">
                  <div className="font-medium text-raisin">{c.name}</div>
                </td>
                <td className="px-4 lg:px-6 py-3 text-raisin/80">{c.email}</td>
                <td className="px-4 lg:px-6 py-3 hidden md:table-cell">
                  {c.phone}
                </td>
                <td className="px-4 lg:px-6 py-3 hidden lg:table-cell">
                  {format(new Date(c.createdAt), 'MMM d, yyyy')}
                </td>
                <td className="px-4 lg:px-6 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/customers/${c.id}`}
                      className="p-2 rounded-md border hover:bg-neutral-50"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      className="p-2 rounded-md border hover:bg-neutral-50"
                      title="Edit"
                      onClick={() => handleEdit(c)}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      className="p-2 rounded-md border hover:bg-neutral-50"
                      title="Delete"
                      onClick={() => handleDelete(c)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="p-0">
                  <EmptyState
                    title="No Customers Found"
                    description="No customers match your search criteria. Try adjusting your search terms."
                    illustration="/empty.svg"
                    className="border-0 py-8"
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="px-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>

      {/* modals */}
      <EditCustomerModal
        open={editModalOpen}
        onClose={handleModalClose}
        onUpdated={() => {
          onRefresh?.();
          handleModalClose();
        }}
        customer={selectedCustomer}
      />

      <DeleteCustomerModal
        open={deleteModalOpen}
        onClose={handleModalClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
