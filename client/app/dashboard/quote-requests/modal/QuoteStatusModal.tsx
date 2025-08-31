'use client';

import { useEffect, useState } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';
import NegotiateModal from './NegotiateModal';
import { createPortal } from 'react-dom';
import { useAuth } from '@/context/AuthContext';

type HistoryItem = {
  id: string;
  title: string; // e.g. "₦900,000 Quotation Sent" or "Mary Smith negotiated amount to ₦875,000"
  note?: string; // small helper text under title
  date: string; // "12 Mar 2025"
  tone?: 'active' | 'muted'; // green dot vs gray dot
  ctaLabel?: string; // "View Quote"
  onCtaClick?: () => void;
  onViewQuote?: () => void; // Add this for view quote functionality
};

type QuoteModalProps = {
  open: boolean;
  onClose: () => void;

  // summary
  quantity: number | string;
  quoteSent?: string; // "— — — — — —" when none
  counterAmount?: string; // same
  deliveryAddress: string; // can be multi-line
  customerName: string;
  additionalMessage?: string;
  requestId?: string; // Add requestId prop
  supplierId?: string; // ID of the supplier this quote is being sent to

  // history & actions
  history?: HistoryItem[];
  onSendQuotation?: () => void; // shown when no history yet
  onAccept?: () => void; // shown when there is history (negotiation)
  onReject?: () => void;
  onViewQuote?: () => void; // Add this for view quote functionality
};

export default function QuoteRequestModal({
  open,
  onClose,
  quantity,
  quoteSent = '— — — — — —',
  counterAmount = '— — — — — —',
  deliveryAddress,
  customerName,
  additionalMessage,
  requestId,
  supplierId,
  history = [],
  onSendQuotation,
  onAccept,
  onReject,
  onViewQuote,
}: QuoteModalProps) {
  const [expanded, setExpanded] = useState(true);
  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const { user } = useAuth();

  // Check if current user is the supplier receiving this quote request
  const isTargetSupplier = user?._id === supplierId;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || '';
      };
    }
  }, [open]);

  if (!open) return null;

  const hasHistory = history.length > 0;

  const modalContent = (
    <div className="fixed inset-0 z-[100000]" aria-hidden={false}>
      {/* overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[99999] pointer-events-auto"
        onClick={onClose}
      />

      {/* container: top-aligned (below app header) */}
      <div className="fixed inset-0 flex items-start justify-center px-3 pt-20 z-[100000]">
        <div
          className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          role="dialog"
          aria-modal="true"
        >
          {/* Header */}
          <div className="relative border-b border-gray-100 px-6 py-4">
            <h2 className="text-base font-semibold">Quote Request</h2>
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            {/* Top 3-column summary */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryKV label="Quantity" value={String(quantity)} />
              <SummaryKV label="Quote Sent" value={quoteSent} />
              <SummaryKV label="Counter Amount" value={counterAmount} />
            </div>

            {/* Delivery / Customer */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <SummaryKV
                label="Delivery Address"
                value={deliveryAddress}
                multi
              />
              <SummaryKV label="Customer" value={customerName} />
            </div>

            {/* Additional message */}
            {additionalMessage ? (
              <div className="mt-5">
                <SummaryKV
                  label="Additional Message"
                  value={additionalMessage}
                  multi
                />
              </div>
            ) : null}

            {/* Request History */}
            <div className="mt-6 rounded-xl border border-gray-100">
              <button
                type="button"
                onClick={() => setExpanded((s) => !s)}
                className="flex w-full items-center justify-between px-4 py-3"
              >
                <span className="text-sm font-semibold">Request History</span>
                {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {expanded && (
                <div className="divide-y divide-gray-100">
                  {hasHistory ? (
                    history.map((h) => (
                      <HistoryRow key={h.id} {...h} onViewQuote={onViewQuote} />
                    ))
                  ) : (
                    <div className="px-4 py-4 text-sm text-gray-500">
                      No activity yet.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer CTAs */}
            <div className="mt-5">
              {!hasHistory ? (
                // No history case: only show Send Quotation if user is the target supplier
                isTargetSupplier ? (
                  <Button
                    onClick={onSendQuotation}
                    className="w-full rounded-xl py-3 text-sm"
                  >
                    Send Quotation
                  </Button>
                ) : (
                  <div className="text-center text-sm text-gray-500 py-4">
                    Waiting for supplier to send quotation...
                  </div>
                )
              ) : // Has history case: only show actions if user is the target supplier
              isTargetSupplier ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button
                    variant="secondary"
                    onClick={onReject}
                    className="w-full sm:w-[32%] rounded-xl py-3 text-sm"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={onAccept}
                    className="w-full sm:w-[32%] rounded-xl py-3 text-sm"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => {
                      setNegotiateOpen(true);
                    }}
                    className="w-full sm:w-[32%] rounded-xl py-3 text-sm"
                  >
                    Negotiate
                  </Button>
                </div>
              ) : (
                <div className="text-center text-sm text-gray-500 py-4">
                  Quote activity in progress...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {negotiateOpen && isTargetSupplier && (
        <NegotiateModal
          onClose={() => setNegotiateOpen(false)}
          onSuccess={() => {
            setNegotiateOpen(false);
            // Refresh the quote status or perform any other action
          }}
          amountReceived={
            quoteSent === '— — — — — —'
              ? 0
              : Number(quoteSent.replace(/[^0-9.-]+/g, ''))
          }
          requestId={requestId || ''}
        />
      )}
    </div>
  );

  // Render modal into document.body to avoid stacking context issues
  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }

  return null;
}

/* ---------- subcomponents ---------- */

function SummaryKV({
  label,
  value,
  multi = false,
}: {
  label: string;
  value: string;
  multi?: boolean;
}) {
  return (
    <div>
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div
        className={`mt-1 text-sm text-gray-900 ${
          multi ? 'whitespace-pre-line' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function HistoryRow({
  title,
  note,
  date,
  tone = 'muted',
  ctaLabel,
  onCtaClick,
  onViewQuote,
}: HistoryItem) {
  const dot = tone === 'active' ? 'bg-green-500' : 'bg-gray-400';

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        {/* left track & dot */}
        <div className="relative">
          <span
            className={`mt-1 inline-block h-2.5 w-2.5 rounded-full ${dot}`}
          />
        </div>

        {/* content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="truncate text-sm font-medium text-gray-900">
              {title}
            </div>
            <div className="shrink-0 text-xs text-gray-500">{date}</div>
          </div>

          {note && (
            <div className="mt-0.5 text-xs text-gray-500 whitespace-pre-line">
              {note}
            </div>
          )}

          {ctaLabel && onCtaClick && (
            <button
              type="button"
              onClick={onCtaClick}
              className="mt-1 text-xs font-medium text-mikado underline underline-offset-2"
            >
              {ctaLabel}
            </button>
          )}

          {onViewQuote && (
            <button
              type="button"
              onClick={onViewQuote}
              className="mt-1 text-xs font-medium text-mikado underline underline-offset-2 capitalize"
            >
              View Quote
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
