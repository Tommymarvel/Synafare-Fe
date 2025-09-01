'use client';

import React, { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import { MoreVertical } from 'lucide-react';
import Pagination from '@/app/components/pagination';
import type { Loan, LoanStatus } from '../types';
import { createPortal } from 'react-dom';
import axiosInstance from '@/lib/axiosInstance';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { KeyedMutator } from 'swr';
import FinancingOfferModal from './FinancingOfferModal';
import { fmtNaira } from '@/lib/format';
import StatusChip from '@/app/components/statusChip';
import EmptyState from '@/app/components/EmptyState';
// import AcceptLoanAgreement from './AcceptLoanAgreement';

const PAGE_SIZE = 10;

type RowAction =
  | 'viewLoan'
  | 'cancelRequest'
  | 'viewOffer'
  | 'acceptRequest'
  | 'rejectRequest'
  | 'liquidateLoan'
  | 'payDownpayment';

export function RowActions({
  loan,
  onAction,
}: {
  loan: Loan;
  onAction?: (action: RowAction, loan: Loan) => void;
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const positionMenu = () => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    // align right edges; menu width = 192px (w-48)
    setCoords({ top: r.bottom + 8, left: r.right - 192 });
  };

  const toggle = () => {
    if (!open) positionMenu();
    setOpen((v) => !v);
  };

  useEffect(() => {
    if (!open) return;

    const onDocPointer = (e: Event) => {
      const t = e.target as Node | null;
      const clickInsideButton = !!btnRef.current && btnRef.current.contains(t);
      const clickInsideMenu = !!menuRef.current && menuRef.current.contains(t);
      if (!clickInsideButton && !clickInsideMenu) setOpen(false);
    };

    const onEsc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onReposition = () => positionMenu();

    // use pointerdown so touch works too
    document.addEventListener('pointerdown', onDocPointer);
    document.addEventListener('keydown', onEsc);
    window.addEventListener('resize', onReposition);
    window.addEventListener('scroll', onReposition, true);

    return () => {
      document.removeEventListener('pointerdown', onDocPointer);
      document.removeEventListener('keydown', onEsc);
      window.removeEventListener('resize', onReposition);
      window.removeEventListener('scroll', onReposition, true);
    };
  }, [open]);

  return (
    <div className="relative inline-flex">
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 text-neutral-500 hover:text-neutral-700"
        title="More"
      >
        <MoreVertical className="w-5 h-5" />
      </button>

      {open &&
        coords &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            className="fixed z-[1000] w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5 p-2"
            style={{ top: coords.top, left: coords.left }}
          >
            <div className="space-y-1">
              {buildMenuForStatus(loan.loanStatus).map(
                ({ key, label, tone }) => (
                  <button
                    key={key}
                    role="menuitem"
                    // use onMouseDown to ensure it fires even if something else
                    // tries to close on mousedown later
                    onMouseDown={() => {
                      setOpen(false);
                      onAction?.(key, loan);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                      tone === 'danger'
                        ? 'hover:bg-red-50 text-red-600'
                        : 'hover:bg-gray-50 text-raisin'
                    }`}
                  >
                    {label}
                  </button>
                )
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

function buildMenuForStatus(
  status: LoanStatus
): { key: RowAction; label: string; tone?: 'danger' }[] {
  switch (status) {
    case 'PENDING':
      return [
        { key: 'viewLoan', label: 'View Loan' },
        { key: 'cancelRequest', label: 'Cancel Request', tone: 'danger' },
      ];
    case 'OFFER_RECEIVED':
      return [
        { key: 'viewOffer', label: 'View Offer' },
        { key: 'acceptRequest', label: 'Accept Request' },
        { key: 'rejectRequest', label: 'Reject Request', tone: 'danger' },
      ];
    case 'AWAITING DOWNPAYMENT':
      return [
        { key: 'viewLoan', label: 'View Loan' },
        { key: 'payDownpayment', label: 'Pay Downpayment' },
        { key: 'cancelRequest', label: 'Cancel Request', tone: 'danger' },
      ];
    case 'AWAITING DISBURSEMENT':
      return [{ key: 'viewLoan', label: 'View Loan' }];
    case 'ACTIVE':
      return [
        { key: 'viewLoan', label: 'View Loan' },
        { key: 'liquidateLoan', label: 'Liquidate Loan', tone: 'danger' },
      ];
    case 'COMPLETED':
    case 'REJECTED':
      // read-only: just view
      return [{ key: 'viewLoan', label: 'View Loan' }];
    default:
      return [{ key: 'viewLoan', label: 'View Loan' }];
  }
}

export default function LoansTable({
  loans,
  refresh,
}: {
  loans: Loan[];
  refresh: KeyedMutator<Loan[]>;
}) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLoan, setActiveLoan] = useState<Loan | null>(null);
  // const [showAgreement, setShowAgreement] = useState(false);

  // Reset page & selection when loans change
  React.useEffect(() => {
    setPage(1);
    setSelected(new Set());
  }, [loans]);

  // Pagination - use filtered loans directly
  const totalPages = Math.max(1, Math.ceil(loans.length / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, loans.length);
  const pageRows = loans.slice(start, end);

  // Row selection (page-scoped “select all”)
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

  const handleCancel = async (id: string) => {
    try {
      await axiosInstance.post(`/loan/action/${id}`, {
        actionType: 'cancelled',
      });
      refresh();
      toast.success('Loan cancelled successfully');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        (axiosError.response && axiosError.response.data
          ? axiosError.response.data.message || axiosError.response.data
          : axiosError.message || 'An error occurred'
        ).toString()
      );
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axiosInstance.patch(`/loan/action/${id}`, {
        actionType: 'rejected',
      });
      refresh();
      toast.success('Loan rejected successfully');
    } catch (error) {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        (axiosError.response && axiosError.response.data
          ? axiosError.response.data.message || axiosError.response.data
          : axiosError.message || 'An error occurred'
        ).toString()
      );
    }
  };

  // sticky header th
  const thStyles =
    'sticky top-0 z-10 bg-[#F0F2F5] px-3 lg:px-6 py-3 font-medium text-xs leading-[18px] text-center';

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="-mx-1 md:mx-0">
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
                <th className={thStyles}>Transaction Cost</th>
                <th className={thStyles}>Loan Amount</th>
                <th className={`${thStyles} hidden md:table-cell`}>
                  Date Requested
                </th>
                <th className={`${thStyles} hidden lg:table-cell`}>Duration</th>
                <th className={`${thStyles} hidden lg:table-cell`}>
                  Next Payment
                </th>
                <th className={`${thStyles} hidden lg:table-cell`}>Status</th>
                <th className={thStyles}>Action</th>
              </tr>
            </thead>

            <tbody>
              {pageRows.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-0">
                    <EmptyState
                      title="No Loans Found"
                      description="No loans match your current filters. Try adjusting your search criteria."
                      illustration="/empty-loan.svg"
                      className="border-0 py-10"
                    />
                  </td>
                </tr>
              ) : (
                pageRows.map((loan: Loan) => (
                  <tr key={loan.id} className="hover:bg-neutral-50 border-b">
                    <td className="px-6 py-3 text-center">
                      <input
                        type="checkbox"
                        className="h-5 w-5"
                        checked={selected.has(loan.id)}
                        onChange={() => toggleRow(loan.id)}
                        aria-label={`Select ${loan.customerName}`}
                      />
                    </td>

                    <td className="px-6 py-3">
                      <div className="font-medium text-sm text-raisin whitespace-nowrap md:whitespace-normal capitalize truncate w-[10ch]">
                        {loan?.customerName ||
                          `${loan.user?.first_name} ${loan?.user?.last_name}`}
                      </div>
                      <div className="text-xs text-[#797979] whitespace-nowrap md:whitespace-normal truncate w-[10ch]">
                        {loan?.customerEmail || loan?.user?.email}
                      </div>
                    </td>

                    <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                      {fmtNaira(loan.transactionCost)}
                    </td>
                    <td className="px-6 py-3 text-sm text-center whitespace-nowrap">
                      {fmtNaira(loan.loan_amount)}
                    </td>

                    <td className="px-6 py-3 text-sm text-center hidden md:table-cell whitespace-nowrap">
                      {format(new Date(loan.dateRequested), 'MMM d, yyyy')}
                    </td>

                    <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                      {loan.loanDurationInMonths} months
                    </td>

                    <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                      {loan.nextPaymentDate
                        ? format(new Date(loan.nextPaymentDate), 'MMM d, yyyy')
                        : '— — —'}
                    </td>

                    <td className="px-6 py-3 text-sm text-center hidden lg:table-cell whitespace-nowrap">
                      <StatusChip status={loan.loanStatus} />
                    </td>

                    <td className="px-6 py-3 text-center text-neutral-400 hover:text-neutral-600 whitespace-nowrap">
                      <RowActions
                        loan={loan}
                        onAction={async (action) => {
                          // TODO: wire these to real handlers
                          // action is one of:
                          // 'viewLoan' | 'cancelRequest' | 'viewOffer' | 'acceptRequest' | 'rejectRequest' | 'liquidateLoan' | 'payDownpayment'
                          if (action === 'viewLoan') {
                            // Navigate to loan details page
                            window.location.href = `/dashboard/loans/${loan.id}`;
                          } else if (action === 'liquidateLoan') {
                            window.location.href = `/dashboard/loans/${loan.id}/liquidate`;
                          } else if (action === 'payDownpayment') {
                            // Navigate to downpayment page
                            window.location.href = `/dashboard/loans/offers/${loan.id}/pay`;
                          } else if (action === 'rejectRequest') {
                            handleReject(loan.id);
                          } else if (action === 'cancelRequest') {
                            handleCancel(loan.id);
                          } else if (action === 'acceptRequest') {
                            try {
                              await axiosInstance.patch(
                                `/loan/${loan.id}/agreement/`,
                                { actionType: 'signed' }
                              );
                              toast.success(
                                'Loan agreement signed successfully'
                              );
                              refresh(); // Add refresh call
                              if (loan.loan_type === 'inventory_financing') {
                                window.location.href = `/dashboard/loans/offers/${loan.id}/pay`;
                              }
                            } catch (error) {
                              const axiosError = error as AxiosError<{
                                message?: string;
                              }>;
                              toast.error(
                                (axiosError.response && axiosError.response.data
                                  ? axiosError.response.data.message ||
                                    axiosError.response.data
                                  : axiosError.message || 'An error occurred'
                                ).toString()
                              );
                            }
                          }
                          if (action === 'viewOffer') {
                            setActiveLoan(loan);
                            setModalOpen(true);
                          }
                          console.log(action, loan.id);
                        }}
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
      <FinancingOfferModal
        open={modalOpen}
        loan={activeLoan}
        onClose={() => setModalOpen(false)}
        onReject={() => {
          setModalOpen(false);
          // TODO: call reject API
          alert('Offer rejected (stub)');
        }}
        onAccept={async (loan) => {
          console.log('Accepting loan offer:', loan.id);
          // if (loan.loan_agreement !== 'signed') {
          //   // setShowAgreement(true);
          //   return;
          // }

          setModalOpen(false);

          try {
            await axiosInstance.patch(`/loan/${loan.id}/agreement/`, {
              actionType: 'signed',
            });

            toast.success('Loan agreement signed successfully');

            if (loan.loan_type === 'inventory_financing') {
              window.location.href = `/dashboard/loans/offers/${loan.id}/pay`;
            }
          } catch (error) {
            const axiosError = error as AxiosError<{ message?: string }>;
            toast.error(
              axiosError.response?.data?.message ||
                axiosError.message ||
                'An error occurred'
            );
          }
        }}
      />
      {/* <AcceptLoanAgreement
        open={showAgreement}
        onClose={() => setShowAgreement(false)}
        onAccept={handleAccept}
        loan={activeLoan}
      /> */}
    </div>
  );
}
