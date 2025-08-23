'use client';

import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import Pagination from '@/app/components/pagination';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { fmtNaira } from '@/lib/format';
import StatusChip from '@/app/components/statusChip';
import { useRouter } from 'next/navigation';
import QuotationPreviewModal from './modal/QuotationPreviewModal';
import QuoteRequestModalV2 from './modal/QuoteStatusModal';
import {
  RowActions,
  QuoteRequest,
  QuoteRequestStatus,
} from './components/RowActions';

type DateRange = '' | '7' | '30' | '90';
const PAGE_SIZE = 10;

type RowAction =
  | 'viewRequest'
  | 'sendQuote'
  | 'viewQuote'
  | 'acceptRequest'
  | 'rejectRequest'
  | 'view';

// Mock data for demonstration
const mockQuoteRequests: QuoteRequest[] = [
  {
    id: '1',
    customer: 'Mary Thomas',
    product: '1.5kVa 2.4kWh LT',
    quantity: 10,
    quoteSent: null,
    counterAmount: null,
    dateRequested: '2025-01-06T00:00:00Z',
    status: 'PENDING',
    customerEmail: 'mary.thomas@example.com',
    supplierName: 'Blue Camel Energy',
    productCategory: 'Inverter',
  },
  {
    id: '2',
    customer: 'Mary Thomas',
    product: '1.5kVa 2.4kWh LT',
    quantity: 21,
    quoteSent: null,
    counterAmount: null,
    dateRequested: '2025-01-06T00:00:00Z',
    status: 'QUOTE_SENT',
    customerEmail: 'mary.thomas@example.com',
    supplierName: 'Blue Camel Energy',
    productCategory: 'Inverter',
  },
  {
    id: '3',
    customer: 'Mary Thomas',
    product: '1.5kVa 2.4kWh LT',
    quantity: 10,
    quoteSent: 1181675,
    counterAmount: 827172,
    dateRequested: '2025-01-06T00:00:00Z',
    status: 'NEGOTIATED',
    customerEmail: 'mary.thomas@example.com',
    supplierName: 'Blue Camel Energy',
    productCategory: 'Inverter',
  },
  {
    id: '4',
    customer: 'Mary Thomas',
    product: '1.5kVa 2.4kWh LT',
    quantity: 20,
    quoteSent: 1181675,
    counterAmount: 827172,
    dateRequested: '2025-01-06T00:00:00Z',
    status: 'NEGOTIATED',
    customerEmail: 'mary.thomas@example.com',
    supplierName: 'Blue Camel Energy',
    productCategory: 'Inverter',
  },
  {
    id: '5',
    customer: 'Mary Thomas',
    product: '1.5kVa 2.4kWh LT',
    quantity: 10,
    quoteSent: 1181675,
    counterAmount: 827172,
    dateRequested: '2025-01-06T00:00:00Z',
    status: 'REJECTED',
    customerEmail: 'mary.thomas@example.com',
    supplierName: 'Blue Camel Energy',
    productCategory: 'Inverter',
  },
  {
    id: '6',
    customer: 'Mary Thomas',
    product: '1.5kVa 2.4kWh LT',
    quantity: 8,
    quoteSent: 1181675,
    counterAmount: 827172,
    dateRequested: '2025-01-06T00:00:00Z',
    status: 'ACCEPTED',
    customerEmail: 'mary.thomas@example.com',
    supplierName: 'Blue Camel Energy',
    productCategory: 'Inverter',
  },
  {
    id: '7',
    customer: 'Mary Thomas',
    product: '1.5kVa 2.4kWh LT',
    quantity: 100,
    quoteSent: 1181675,
    counterAmount: 827172,
    dateRequested: '2025-01-06T00:00:00Z',
    status: 'ACCEPTED',
    customerEmail: 'mary.thomas@example.com',
    supplierName: 'Blue Camel Energy',
    productCategory: 'Inverter',
  },
  {
    id: '8',
    customer: 'Mary Thomas',
    product: '1.5kVa 2.4kWh LT',
    quantity: 10,
    quoteSent: 1181675,
    counterAmount: 827172,
    dateRequested: '2025-01-06T00:00:00Z',
    status: 'DELIVERED',
    customerEmail: 'mary.thomas@example.com',
    supplierName: 'Blue Camel Energy',
    productCategory: 'Inverter',
  },
];

export default function QuoteRequestsPage() {
  const router = useRouter();
  const [quoteRequests] = useState<QuoteRequest[]>(mockQuoteRequests);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteRequestStatus | ''>('');
  const [dateRange, setDateRange] = useState<DateRange>('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  // Modal states
  const [showQuotePreviewModal, setShowQuotePreviewModal] = useState(false);
  const [showQuoteStatusModal, setShowQuoteStatusModal] = useState(false);
  const [selectedQuoteRequest, setSelectedQuoteRequest] =
    useState<QuoteRequest | null>(null);

  // Compute filtered results
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const now = new Date();

    return quoteRequests.filter((req) => {
      if (
        q &&
        !req.customer.toLowerCase().includes(q) &&
        !req.product.toLowerCase().includes(q)
      )
        return false;
      if (statusFilter && req.status !== statusFilter) return false;

      if (dateRange) {
        const days = Number(dateRange);
        const since = new Date(now);
        since.setDate(now.getDate() - days);
        const requested = new Date(req.dateRequested);
        if (requested < since) return false;
      }

      return true;
    });
  }, [quoteRequests, search, statusFilter, dateRange]);

  // Reset page & selection when filters change
  React.useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [search, statusFilter, dateRange]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, filtered.length);
  const pageRows = filtered.slice(start, end);

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

  const handleAction = async (
    action: RowAction,
    quoteRequest: QuoteRequest
  ) => {
    try {
      switch (action) {
        case 'viewRequest':
          // Show quote preview modal
          setSelectedQuoteRequest(quoteRequest);
          setShowQuotePreviewModal(true);
          break;
        case 'sendQuote':
          // Navigate to write-quote page
          router.push(
            `/dashboard/quote-requests/write-quote?requestId=${quoteRequest.id}`
          );
          break;
        case 'viewQuote':
          // Show quote status modal
          setSelectedQuoteRequest(quoteRequest);
          setShowQuoteStatusModal(true);
          break;
        case 'acceptRequest':
          // Accept the quote request
          await axiosInstance.patch(`/quote-requests/${quoteRequest.id}`, {
            status: 'ACCEPTED',
          });
          toast.success('Quote request accepted successfully');
          break;
        case 'rejectRequest':
          // Reject the quote request
          await axiosInstance.patch(`/quote-requests/${quoteRequest.id}`, {
            status: 'REJECTED',
          });
          toast.success('Quote request rejected successfully');
          break;
        case 'view':
          // View completed/delivered request
          setSelectedQuoteRequest(quoteRequest);
          setShowQuotePreviewModal(true);
          break;
        default:
          console.log('Unknown action:', action);
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError.response?.data?.message ||
          axiosError.message ||
          'An error occurred'
      );
    }
  };

  // sticky header th
  const thStyles =
    'sticky top-0 z-10 bg-[#F0F2F5] px-3 lg:px-6 py-3 font-medium text-xs leading-[18px] text-center';

  const getReceivedCount = () =>
    quoteRequests.filter((req) =>
      ['PENDING', 'QUOTE_SENT'].includes(req.status)
    ).length;
  const getSentCount = () =>
    quoteRequests.filter(
      (req) => !['PENDING', 'QUOTE_SENT'].includes(req.status)
    ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quote Requests
        </h1>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('received')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-mikado text-mikado'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Received Requests
              <span className="ml-2 bg-mikado text-white text-xs px-2 py-1 rounded-full">
                {getReceivedCount()}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-mikado text-mikado'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Sent Requests
              <span className="ml-2 bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {getSentCount()}
              </span>
            </button>
          </nav>
        </div>

        <div className="space-y-4 border rounded-lg mt-4">
          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-6 pt-3">
            <div className="relative w-full sm:w-64">
              <label htmlFor="quote-search" className="sr-only">
                Search
              </label>
              <input
                id="quote-search"
                type="text"
                placeholder="Search"
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
                  setStatusFilter(e.target.value as QuoteRequestStatus | '')
                }
                className="px-3 py-2 w-1/2 border text-sm rounded-md bg-white"
              >
                <option value="">Status</option>
                <option value="PENDING">Pending</option>
                <option value="QUOTE_SENT">Quote Sent</option>
                <option value="NEGOTIATED">Negotiated</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
                <option value="DELIVERED">Delivered</option>
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
                    <th className={`${thStyles} text-left`}>Customer</th>
                    <th className={`${thStyles} text-left`}>Product</th>
                    <th className={thStyles}>Quantity</th>
                    <th className={thStyles}>Quote Sent</th>
                    <th className={thStyles}>Counter Amount</th>
                    <th className={`${thStyles} hidden md:table-cell`}>
                      Date Requested
                    </th>
                    <th className={`${thStyles} hidden lg:table-cell`}>
                      Status
                    </th>
                    <th className={thStyles}>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pageRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-10 text-center text-sm text-[#797979]"
                      >
                        No quote requests match your filters.
                      </td>
                    </tr>
                  ) : (
                    pageRows.map((request: QuoteRequest) => (
                      <tr
                        key={request.id}
                        className="hover:bg-neutral-50 border-b"
                      >
                        <td className="px-6 py-3 text-center">
                          <input
                            type="checkbox"
                            className="h-5 w-5"
                            checked={selected.has(request.id)}
                            onChange={() => toggleRow(request.id)}
                            aria-label={`Select ${request.customer}`}
                          />
                        </td>

                        <td className="px-6 py-3">
                          <div className="font-medium text-sm text-raisin whitespace-nowrap md:whitespace-normal capitalize truncate w-[10ch]">
                            {request.customer}
                          </div>
                          {request.customerEmail && (
                            <div className="text-xs text-[#797979] whitespace-nowrap md:whitespace-normal truncate w-[10ch]">
                              {request.customerEmail}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-3">
                          <div className="font-medium text-sm text-raisin whitespace-nowrap md:whitespace-normal">
                            {request.product}
                          </div>
                          {request.productCategory && (
                            <div className="text-xs text-[#797979]">
                              {request.productCategory}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                          {request.quantity}
                        </td>

                        <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                          {request.quoteSent
                            ? fmtNaira(request.quoteSent)
                            : '— — —'}
                        </td>

                        <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                          {request.counterAmount
                            ? fmtNaira(request.counterAmount)
                            : '— — —'}
                        </td>

                        <td className="px-6 py-3 text-sm text-center hidden md:table-cell whitespace-nowrap">
                          {format(
                            new Date(request.dateRequested),
                            'MMM d, yyyy'
                          )}
                        </td>

                        <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                          <StatusChip status={request.status} />
                        </td>

                        <td className="px-6 py-3 text-center text-neutral-400 hover:text-neutral-600 whitespace-nowrap">
                          <RowActions
                            quoteRequest={request}
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
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>

      {/* Quote Preview Modal */}
      {showQuotePreviewModal && selectedQuoteRequest && (
        <QuotationPreviewModal
          open={showQuotePreviewModal}
          onClose={() => {
            setShowQuotePreviewModal(false);
            setSelectedQuoteRequest(null);
          }}
          quotationId={selectedQuoteRequest.id}
          dateText={format(
            new Date(selectedQuoteRequest.dateRequested),
            'MMMM dd, yyyy'
          )}
          customer={{
            name: selectedQuoteRequest.customer,
            email: selectedQuoteRequest.customerEmail,
            addressLines: ['Address not provided'],
          }}
          lines={[
            {
              id: '1',
              description: selectedQuoteRequest.product,
              qty: selectedQuoteRequest.quantity,
              price: selectedQuoteRequest.quoteSent || 0,
            },
          ]}
          additionalInfo={selectedQuoteRequest.message}
        />
      )}

      {/* Quote Status Modal */}
      {showQuoteStatusModal && selectedQuoteRequest && (
        <QuoteRequestModalV2
          open={showQuoteStatusModal}
          onClose={() => {
            setShowQuoteStatusModal(false);
            setSelectedQuoteRequest(null);
          }}
          quantity={selectedQuoteRequest.quantity}
          quoteSent={
            selectedQuoteRequest.quoteSent
              ? fmtNaira(selectedQuoteRequest.quoteSent)
              : '— — — — — —'
          }
          counterAmount={
            selectedQuoteRequest.counterAmount
              ? fmtNaira(selectedQuoteRequest.counterAmount)
              : '— — — — — —'
          }
          deliveryAddress="Address not provided"
          customerName={selectedQuoteRequest.customer}
          additionalMessage={selectedQuoteRequest.message}
          history={[
            {
              id: '1',
              title: `Quote request created for ${selectedQuoteRequest.product}`,
              date: format(
                new Date(selectedQuoteRequest.dateRequested),
                'dd MMM yyyy'
              ),
              tone: 'muted' as const,
            },
          ]}
          onSendQuotation={() => {
            setShowQuoteStatusModal(false);
            router.push(
              `/dashboard/quote-requests/write-quote?requestId=${selectedQuoteRequest.id}`
            );
          }}
          onAccept={() => {
            handleAction('acceptRequest', selectedQuoteRequest);
            setShowQuoteStatusModal(false);
          }}
          onReject={() => {
            handleAction('rejectRequest', selectedQuoteRequest);
            setShowQuoteStatusModal(false);
          }}
        />
      )}
    </div>
  );
}
