'use client';

import { useEffect, useState } from 'react';
import { X, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/app/components/ui/Button';

type HistoryItem = {
  id: string;
  title: string; // e.g. "₦900,000 Quotation Sent" or "Mary Smith negotiated amount to ₦875,000"
  note?: string; // small helper text under title
  date: string; // "12 Mar 2025"
  tone?: 'active' | 'muted'; // green dot vs gray dot
  ctaLabel?: string; // "View Quote"
  onCtaClick?: () => void;
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

  // history & actions
  history?: HistoryItem[];
  onSendQuotation?: () => void; // shown when no history yet
  onAccept?: () => void; // shown when there is history (negotiation)
  onReject?: () => void;
};

export default function QuoteRequestModalV2({
  open,
  onClose,
  quantity,
  quoteSent = '— — — — — —',
  counterAmount = '— — — — — —',
  deliveryAddress,
  customerName,
  additionalMessage,
  history = [],
  onSendQuotation,
  onAccept,
  onReject,
}: QuoteModalProps) {
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const hasHistory = history.length > 0;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-0 grid place-items-center px-3">
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
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    history.map((h) => <HistoryRow key={h.id} {...h} />)
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
                <Button
                  onClick={onSendQuotation}
                  className="w-full rounded-xl py-3 text-sm"
                >
                  Send Quotation
                </Button>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
                  <Button
                    variant="secondary"
                    onClick={onReject}
                    className="w-full sm:w-[48%] rounded-xl py-3 text-sm"
                  >
                    Reject
                  </Button>
                  <Button
                    onClick={onAccept}
                    className="w-full sm:w-[48%] rounded-xl py-3 text-sm"
                  >
                    Accept
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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

          {note && <div className="mt-0.5 text-xs text-gray-500">{note}</div>}

          {ctaLabel && onCtaClick && (
            <button
              type="button"
              onClick={onCtaClick}
              className="mt-1 text-xs font-medium text-mikado underline underline-offset-2"
            >
              {ctaLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
