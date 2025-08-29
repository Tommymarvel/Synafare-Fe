'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Search, Plus } from 'lucide-react';
import Pagination from '@/app/components/pagination';
import { toast } from 'react-toastify';
import { fmtDate, fmtNaira } from '@/lib/format';
import StatusChip from '@/app/components/statusChip';
import { useRouter } from 'next/navigation';
import { InvoiceStatus, RowAction, RowActions } from './components/RowActions';

import { useInvoices, useInvoiceActions } from './hooks/useInvoices';
import type { Invoice } from './hooks/useInvoices';
import { useAuth } from '@/context/AuthContext';
import SetupInvoiceModal from './components/Setup';
import EmptyState from '@/app/components/EmptyState';
import InvoiceIllustration from '@/app/assets/empty-customers.svg';

type DateRange = '' | '7' | '30' | '90';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'unpaid', label: 'Unpaid' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

export default function InvoicesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');
  const [dateRange, setDateRange] = useState<DateRange>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [showLogoModal, setShowLogoModal] = useState(false);

  // Use SWR hook for data fetching
  const {
    data: invoices,
    meta,
    error,
    isLoading,
    mutate,
  } = useInvoices({
    page,
    limit: pageSize,
    status: statusFilter || undefined,
    search: search.trim() || undefined,
  });

  // Use invoice actions hook
  const {
    markAsPaid,
    sendInvoice,
    deleteInvoice,
    bulkDeleteInvoices,
    downloadInvoice,
  } = useInvoiceActions();

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // Reset selection when data changes
  useEffect(() => {
    setSelected(new Set());
  }, [invoices?.length]); // Only depend on length instead of the entire array

  // Handle create invoice click - check for business logo first
  const handleCreateInvoice = () => {
    // Check if user has business and business logo
    if (!user?.business?.business_logo) {
      setShowLogoModal(true);
      return;
    }

    // If business logo exists, proceed to create invoice
    router.push('/dashboard/invoices/create');
  };
  const totalInvoices = meta?.total_invoices || invoices.length;
  const totalPages = Math.ceil(totalInvoices / pageSize);

  // Filter invoices based on active tab
  const filteredByTab = useMemo(() => {
    if (activeTab === 'all') return invoices;
    return invoices.filter((invoice) => {
      switch (activeTab) {
        case 'draft':
          return invoice.status === 'DRAFT';
        case 'unpaid':
          return invoice.status === 'PENDING';
        case 'paid':
          return invoice.status === 'PAID';
        case 'overdue':
          return invoice.status === 'OVERDUE';
        default:
          return true;
      }
    });
  }, [invoices, activeTab]);

  // Compute filtered results for client-side date filtering
  const filtered = useMemo(() => {
    if (!dateRange) return filteredByTab;

    const now = new Date();
    const days = Number(dateRange);
    const since = new Date(now);
    since.setDate(now.getDate() - days);

    return filteredByTab.filter((invoice) => {
      const issued = new Date(invoice.issueDate);
      return issued >= since;
    });
  }, [filteredByTab, dateRange]);

  // For client-side pagination display (server handles actual pagination)
  const pageRows = filtered;

  // Row selection (page-scoped "select all")
  const pageIds = pageRows.map((r) => r.id);
  const allSelectedOnPage =
    pageIds.every((id) => selected.has(id)) && pageIds.length > 0;

  const toggleRow = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAllOnPage = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelectedOnPage) {
        pageIds.forEach((id) => next.delete(id));
      } else {
        pageIds.forEach((id) => next.add(id));
      }
      return next;
    });
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selected.size === 0) {
      toast.error('Please select invoices to delete');
      return;
    }

    const selectedIds = Array.from(selected);
    const message =
      selectedIds.length === 1
        ? 'Are you sure you want to delete this invoice?'
        : `Are you sure you want to delete ${selectedIds.length} invoices?`;

    if (confirm(message)) {
      try {
        const res = await bulkDeleteInvoices(selectedIds);
        toast.success(
          res?.message ||
            `${selectedIds.length} invoice(s) deleted successfully`
        );
        setSelected(new Set());
        await mutate();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete invoices';
        toast.error(errorMessage);
      }
    }
  };

  const handleAction = async (action: RowAction, invoice: Invoice) => {
    try {
      switch (action) {
        case 'view':
          router.push(`/dashboard/invoices/${invoice.id}`);
          break;
        case 'edit':
          router.push(`/dashboard/invoices/${invoice.id}/edit`);
          break;
        case 'delete':
          if (confirm('Are you sure you want to delete this invoice?')) {
            const res = await deleteInvoice(invoice.id);
            toast.success(res?.message || 'Invoice deleted successfully');
            await mutate();
          }
          break;
        case 'markPaid':
          {
            const res = await markAsPaid(invoice.id);
            toast.success(res?.message || 'Invoice marked as paid');
            await mutate();
          }
          break;
        case 'send':
          {
            const res = await sendInvoice(invoice.id);
            toast.success(res?.message || 'Invoice sent successfully');
            await mutate();
          }
          break;
        case 'download':
          {
            const res = await downloadInvoice(invoice.id);
            toast.success(res?.message || 'Invoice downloaded successfully');
          }
          break;
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred';
      toast.error(errorMessage);
    }
  };

  // sticky header th
  const thStyles =
    'sticky top-0 z-10 bg-[#F0F2F5] px-3 lg:px-6 py-3 font-medium text-xs leading-[18px] text-center';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          {selected.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Delete ({selected.size})
            </button>
          )}
        </div>
        <button
          onClick={handleCreateInvoice}
          className="inline-flex items-center gap-2 px-4 py-2 bg-mikado text-raisin rounded-lg hover:bg-mikado/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? 'border-mikado text-mikado'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4 border rounded-lg mt-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 pt-3">
            <div className="relative w-full sm:w-64">
              <label htmlFor="invoice-search" className="sr-only">
                Search
              </label>
              <input
                id="invoice-search"
                type="text"
                placeholder="Search invoices..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-mikado"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
                <Search className="w-5 h-5" />
              </span>
            </div>

            <div className="flex max-w-full gap-2">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as InvoiceStatus | '')
                }
                className="px-3 py-2 w-1/2 border text-sm rounded-md bg-white"
              >
                <option value="">Status</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING">Pending</option>
                <option value="PAID">Paid</option>
                <option value="OVERDUE">Overdue</option>
              </select>

              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="px-3 py-2 w-1/2 flex-1 text-sm border rounded-md bg-white"
              >
                <option value="">Select Date Range</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="-mx-1 md:mx-0 ">
            <div
              className="overflow-x-auto md:overflow-visible scrollbar-mikado px-1 md:px-0"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <table className="min-w-[500px] md:min-w-0 w-full bg-white border rounded-lg table-auto">
                <thead>
                  <tr className="bg-[#F0F2F5]">
                    <th className={`${thStyles} w-[48px]`}>
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={allSelectedOnPage}
                        onChange={toggleAllOnPage}
                        aria-label="Select all rows on this page"
                      />
                    </th>
                    <th className={`${thStyles} text-left`}>Invoice ID</th>
                    <th className={`${thStyles} text-left`}>Customer</th>
                    <th className={`${thStyles} hidden md:table-cell`}>
                      Issue Date
                    </th>
                    <th className={`${thStyles} hidden md:table-cell`}>
                      Due Date
                    </th>
                    <th className={thStyles}>Amount</th>
                    <th className={`${thStyles} hidden lg:table-cell`}>
                      Status
                    </th>
                    <th className={thStyles}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-sm text-[#797979]"
                      >
                        Loading invoices...
                      </td>
                    </tr>
                  ) : pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <EmptyState
                          title={
                            search || statusFilter || dateRange
                              ? 'No Invoices Match Filters'
                              : 'No Invoices Found'
                          }
                          description={
                            search || statusFilter || dateRange
                              ? 'No invoices match your current filters. Try adjusting your search criteria.'
                              : "You haven't created any invoices yet. Start by creating your first invoice."
                          }
                          actionLabel={
                            search || statusFilter || dateRange
                              ? 'Clear Filters'
                              : 'Create Invoice'
                          }
                          onAction={
                            search || statusFilter || dateRange
                              ? () => {
                                  setSearch('');
                                  setStatusFilter('');
                                  setDateRange('');
                                  setActiveTab('all');
                                }
                              : handleCreateInvoice
                          }
                          illustration={InvoiceIllustration}
                          className="border-0"
                        />
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((invoice: Invoice) => (
                      <tr
                        key={invoice.id}
                        className="hover:bg-neutral-50 border-b"
                      >
                        <td className="px-6 py-3 text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5"
                            checked={selected.has(invoice.id)}
                            onChange={() => toggleRow(invoice.id)}
                            aria-label={`Select ${invoice.invoiceId}`}
                          />
                        </td>

                        <td className="px-6 py-3">
                          <div className="font-medium text-sm text-raisin whitespace-nowrap">
                            {invoice.invoiceId}
                          </div>
                        </td>

                        <td className="px-6 py-3">
                          <div className="font-medium text-sm text-raisin whitespace-nowrap md:whitespace-normal capitalize truncate">
                            {invoice.customerName}
                          </div>
                          {invoice.customerEmail && (
                            <div className="text-xs text-[#797979] whitespace-nowrap md:whitespace-normal truncate">
                              {invoice.customerEmail}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-3 text-sm text-center hidden md:table-cell whitespace-nowrap">
                          {fmtDate(invoice.issueDate)}
                        </td>

                        <td className="px-6 py-3 text-sm text-center hidden md:table-cell whitespace-nowrap">
                          {fmtDate(invoice.dueDate)}
                        </td>

                        <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                          {fmtNaira(invoice.amount)}
                        </td>

                        <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                          <StatusChip status={invoice.status} />
                        </td>

                        <td className="px-6 py-3 text-center text-neutral-400 hover:text-neutral-600 whitespace-nowrap">
                          <RowActions
                            invoice={invoice}
                            onAction={handleAction}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer / Pagination */}
          <div className="py-4 px-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(page - 1) * pageSize + 1} to{' '}
                {Math.min(page * pageSize, totalInvoices)} of {totalInvoices}{' '}
                results
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Setup Invoice Modal */}
      {showLogoModal && (
        <SetupInvoiceModal onClose={() => setShowLogoModal(false)} />
      )}
    </div>
  );
}
