'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search } from 'lucide-react';
import Pagination from '@/app/components/pagination';
import { toast } from 'react-toastify';
import { fmtDate, fmtNaira } from '@/lib/format';
import StatusChip from '@/app/components/statusChip';
import { useRouter } from 'next/navigation';
import QuotationPreviewModal from './modal/QuotationPreviewModal';
import { RowActions } from './components/RowActions';
import type { QuoteRequestStatus, RowAction } from './components/RowActions';
import {
  useQuoteRequests,
  useUpdateQuoteRequest,
  transformOfferHistoryForUI,
} from '@/hooks/useQuoteRequests';
import type { QuoteRequest } from '@/hooks/useQuoteRequests';
import { useAuth } from '@/context/AuthContext';
import QuoteRequestModal from './modal/QuoteStatusModal';
import EmptyState from '@/app/components/EmptyState';

type DateRange = '' | '7' | '30' | '90';

export default function QuoteRequestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<QuoteRequestStatus | ''>('');
  const [dateRange, setDateRange] = useState<DateRange>('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');

  // Modal states
  const [showQuotePreviewModal, setShowQuotePreviewModal] = useState(false);
  const [showQuoteStatusModal, setShowQuoteStatusModal] = useState(false);
  const [selectedQuoteRequest, setSelectedQuoteRequest] =
    useState<QuoteRequest | null>(null);

  // Use SWR hook for data fetching
  const {
    data: quoteRequests,
    meta,
    error,
    isLoading,
    mutate,
  } = useQuoteRequests({
    page,
    limit: pageSize,
    status: statusFilter || undefined,
    search: search.trim() || undefined,
  });

  // Use update hook
  const { acceptQuote, rejectQuote } = useUpdateQuoteRequest();

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  // Reset selection when data changes
  useEffect(() => {
    setSelected(new Set());
  }, [quoteRequests]);

  // Set default tab based on user type when user data loads
  useEffect(() => {
    if (user?.nature_of_solar_business) {
      if (user.nature_of_solar_business === 'supplier') {
        setActiveTab('received');
      } else {
        setActiveTab('sent');
      }
    }
  }, [user?.nature_of_solar_business]);

  // Get totals from meta or fallback to current data
  const totalPages = meta?.totalPages || 1;
  const totalRequests = meta?.total_requests || quoteRequests.length;

  // Compute filtered results for client-side date filtering
  const filtered = useMemo(() => {
    if (!dateRange) return quoteRequests;

    const now = new Date();
    const days = Number(dateRange);
    const since = new Date(now);
    since.setDate(now.getDate() - days);

    return quoteRequests.filter((req) => {
      const requested = new Date(req.dateRequested);
      return requested >= since;
    });
  }, [quoteRequests, dateRange]);

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

  // Check if user is a supplier (after all hooks)
  const isSupplier = user?.nature_of_solar_business === 'supplier';
  const isDistributorOrInstaller =
    user?.nature_of_solar_business === 'distributor' ||
    user?.nature_of_solar_business === 'installer';

  // If user is not a supplier, distributor, or installer, show access denied message
  if (!isSupplier && !isDistributorOrInstaller) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Restricted
            </h1>
            <p className="text-gray-600 mb-6">
              Quote requests are only available for suppliers, distributors, and
              installers.
              {user?.nature_of_solar_business && (
                <span className="block mt-2">
                  Your account type:{' '}
                  <strong className="capitalize">
                    {user.nature_of_solar_business}
                  </strong>
                </span>
              )}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-mikado text-white px-6 py-2 rounded-lg hover:bg-mikado/90 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAction = async (
    action: RowAction,
    quoteRequest: QuoteRequest
  ) => {
    try {
      switch (action) {
        case 'viewRequest':
          // Show quote preview modal
          setSelectedQuoteRequest(quoteRequest);
          setShowQuoteStatusModal(true);
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
          // Accept the quote request using API
          {
            const res = await acceptQuote(quoteRequest.id);
            toast.success(
              res?.message || 'Quote request accepted successfully'
            );
            // Refresh data
            await mutate();
          }
          break;
        case 'rejectRequest':
          // Reject the quote request using API
          {
            const res = await rejectQuote(quoteRequest.id);
            toast.success(
              res?.message || 'Quote request rejected successfully'
            );
            // Refresh data
            await mutate();
          }
          break;
        case 'view':
          // View completed/delivered request
          setSelectedQuoteRequest(quoteRequest);
          setShowQuotePreviewModal(true);
          break;
        case 'pay':
          // Navigate to pay page for accepted quotes
          router.push(`/dashboard/quote-requests/${quoteRequest.id}/pay`);
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
            {/* Show Received Requests tab only for suppliers */}
            {isSupplier && (
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
            )}

            {/* Show Sent Requests tab for all user types */}
            <button
              onClick={() => setActiveTab('sent')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'sent'
                  ? 'border-mikado text-mikado'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {isSupplier ? 'Sent Requests' : 'My Quote Requests'}
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
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-6 py-10 text-center text-sm text-[#797979]"
                      >
                        Loading quote requests...
                      </td>
                    </tr>
                  ) : pageRows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-0">
                        <EmptyState
                          title={
                            search || statusFilter || dateRange
                              ? 'No Quote Requests Match Filters'
                              : 'No Quote Requests Found'
                          }
                          description={
                            search || statusFilter || dateRange
                              ? 'No quote requests match your current filters. Try adjusting your search criteria.'
                              : "You haven't created any quote requests yet. Start by creating your first quote request."
                          }
                          actionLabel={
                            search || statusFilter || dateRange
                              ? 'Clear Filters'
                              : 'Create Quote Request'
                          }
                          actionUrl={
                            search || statusFilter || dateRange
                              ? undefined
                              : '/dashboard/marketplace'
                          }
                          onAction={
                            search || statusFilter || dateRange
                              ? () => {
                                  setSearch('');
                                  setStatusFilter('');
                                  setDateRange('');
                                }
                              : undefined
                          }
                          illustration="/no-item.svg"
                          className="border-0"
                        />
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
                          {fmtDate(request.dateRequested)}
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
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {(page - 1) * pageSize + 1} to{' '}
                {Math.min(page * pageSize, totalRequests)} of {totalRequests}{' '}
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
        <QuoteRequestModal
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
          deliveryAddress={
            selectedQuoteRequest.deliveryLocation || 'Address not provided'
          }
          customerName={selectedQuoteRequest.customer}
          additionalMessage={selectedQuoteRequest.message}
          requestId={selectedQuoteRequest.id}
          history={
            selectedQuoteRequest.offerHistory
              ? transformOfferHistoryForUI(selectedQuoteRequest.offerHistory)
              : []
          }
          onSendQuotation={() => {
            setShowQuoteStatusModal(false);
            router.push(
              `/dashboard/quote-requests/write-quote?requestId=${selectedQuoteRequest.id}`
            );
          }}
          onAccept={async () => {
            if (!selectedQuoteRequest) return;
            await handleAction('acceptRequest', selectedQuoteRequest);
            setShowQuoteStatusModal(false);
          }}
          onReject={async () => {
            if (!selectedQuoteRequest) return;
            await handleAction('rejectRequest', selectedQuoteRequest);
            setShowQuoteStatusModal(false);
          }}
          onViewQuote={() => {
            setShowQuoteStatusModal(false);
            setShowQuotePreviewModal(true);
          }}
        />
      )}
    </div>
  );
}
